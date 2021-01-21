import Equalizer from "./Equalizer";
import AudioEffects from "./AudioEffects";

export default class AudioPlayer {
  /**
   * @param audioCtx   - global shared audio context
   * @param outputNode - global shared output node to connect player output to
   * @pamar playlist   - this players playlist
   */
  constructor( audioCtx, outputNode, playlist ) {
    this.ctx = audioCtx;
    this.playlist = playlist;

    this.gain = audioCtx.createGain();
    this.eq = new Equalizer( audioCtx );
    this.effects = new AudioEffects( audioCtx );

    this.gain.connect( this.eq.entryNode );
    this.eq.outputNode.connect( this.effects.entryNode );
    this.effects.outputNode.connect( outputNode );

    this.globalOutputNode = outputNode;
    this.gain.gain.value = 1.0;
    this.outputNode = this.gain;
  }

  // helper variables for calculating the position
  lastTimestamp = 0;
  get now() {
    return this.ctx.currentTime;
  }
  seekTo = null; // for pause & seek
  isPause = false;
  tempoTimeBonus = 0;

  // status variables
  isPlaying = false;
  playingSpeed = 1;

  /**
   * active song in the playlist
   */
  get current() {
    return this.playlist.activeSong;
  }
  get currentIndex() {
    return this.playlist.currentIndex;
  }

  get currentSongId(){
    return this.playlist.list[this.playlist.currentIndex];
  }

  /**
   * start playback on active song in the playlist
   */
  play() {
    if ( this.current === undefined )
      throw new Error( "can't play an empty playlist" );

    if ( this.bufferSrc ) {
      this.bufferSrc.manuallyStopped = true;
      this.bufferSrc.stop();
    }

    this.bufferSrc = this.ctx.createBufferSource();
    this.bufferSrc.buffer = this.current.audioBuffer;
    this.bufferSrc.onended = this.handleSongEnd;
    this.bufferSrc.connect( this.outputNode );

    if ( this.seekTo !== null ) {
      this.bufferSrc.playbackRate.value = this.playingSpeed;

      const START_DELAY = 0;
      this.bufferSrc.start( START_DELAY, this.seekTo );

      if ( this.isPause )
        this.lastTimestamp = this.now; // on pause time continues to elapse
    } else {
      this.bufferSrc.start();
      this.lastTimestamp = this.now; // initial timestamp
    }
    this.isPlaying = true;
  }
  handleSongEnd = event => {
    /* triggered on
       1) the natural end of a song
       2) bufferSrc.stop()
       We only want the 1. case

       manuallyStopped needs to be maintained on the bufferSrc, a variable on this leads to inconsistent results
    */
    if ( !event.srcElement.manuallyStopped ) {
      this.next();
    }
  }

  /**
    * get the current position in the song (in secs)
    *   for the whole duration (check song.metaData)
    */
  currentPosition() {
    /* // debug
    console.log( "now+time", this.now, this.lastTimestamp )
    console.log( "tempo bonus", this.tempoTimeBonus )
    console.log( "now-last*playing", ((this.now - this.lastTimestamp) * this.playingSpeed) )
    console.log( "seek", this.seekTo || 0 )
    */

    return ((this.now - this.lastTimestamp) * this.playingSpeed) + // speed * time elapsed
      this.tempoTimeBonus + // pre calculated extra time at other speed
      (this.seekTo !== null ? this.seekTo : 0); // previous seek time
  }
  /**
   * pause the playing song (allows for resuming playback at the same position)
   */
  pause() {
    if ( !this.bufferSrc ) return;

    const res = this.currentPosition();
    this.seekTo = res;
    this.tempoTimeBonus = 0; // reset bonus, as it is now part of seekTo

    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();

    this.lastTimestamp = this.now;
    this.isPause = true;
    this.isPlaying = false;
  }

  /**
   * seek to a point in the song (absolute value)
   */
  seek( pointInTime ) {
    if ( this.current.metaData.length.total > pointInTime ) {
      this.seekTo = pointInTime;

      if ( this.bufferSrc ) {
        this.bufferSrc.manuallyStopped = true;
        this.bufferSrc.stop();
      }

      this.isPause = false;

      if ( this.isPlaying )
        this.play();
    }
  }

  resetPlayer() {
    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();
    this.isPause = false;

    this.tempoTimeBonus = 0;
    this.lastTimestamp = this.now;
    this.seekTo = null;
  }
  resetEffects() {
    this.setVolume();
    this.playingSpeed = 1;

    if ( this.effects.effects.totalActive > 0 ) {
      Object.keys( this.effects.effects )
        .filter( x => this.effects.effects[x].active )
        .forEach( x => this.effects.toggle( x ) );
    }

    this.eq.frequencies.forEach( f => this.setEq( f ) );
  }
  /**
   * stop the playing song (does not allow resuming playback)
   *   resets effects, speed, volume, etc.
   */
  stop() {
    this.resetPlayer();
    this.resetEffects();
    this.isPlaying = false;
  }
  /**
   * skip to next song in the playlist (loops around)
   */
  next() {
    const wasPlaying = this.isPlaying;

    this.resetPlayer();
    this.playlist.next();

    if ( wasPlaying )
      this.play();
  }
  /**
   * skip to previous song in the playlist (loops around)
   */
  prev() {
    const wasPlaying = this.isPlaying;

    this.resetPlayer();
    this.playlist.prev();

    if ( wasPlaying )
      this.play();
  }

  /**
   * set the volume for the current playback
   */
  setVolume( value = 1 ) {
    if ( value <= 1 && value >= 0 )
      this.gain.gain.value = value;
    else
      throw new Error( "invalid value for setVolume, must be >=0 and <=1" );
  }
  /**
   * set the playing speed for the current playback
   */
  setTempo( value ) {
    if ( !(value <= 2 && value > 0) ) // arbitrary restriction, can go negative
      throw new Error( "invalid value for setTempo, must be >0 and <=2" );

    this.bufferSrc.playbackRate.value = value;

    const timePlayedInLastTempo = (this.now - this.lastTimestamp) * this.playingSpeed;
    this.tempoTimeBonus += timePlayedInLastTempo;
    this.lastTimestamp = this.now;
    this.playingSpeed = value;
  }

  /**
   * set the db gain of an equalizer
   * indexOrFrequency - either
   *                      1) the index of a node (0-9)
   *                      2) the frequency (32, 64, 125, etc.) of a node
   * value            - db level to set the eq gain to (min: -40; max: 40)
   */
  setEq( indexOrFrequency, value = 0 ) {
    let node;
    if ( indexOrFrequency < this.eq.nodes.length && indexOrFrequency > 0 ) {
      node = this.eq.nodes[indexOrFrequency];
    } else {
      node = this.eq.frequencies[indexOrFrequency];
      if ( node === undefined )
        throw new Error( `invalid frequency, pick one of: ${Object.keys( this.eq.frequencies )}\nor a valid node index: <${this.eq.nodes.length}`  );
    }
    node.gain.value = value;
  }
}
