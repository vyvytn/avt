import Equalizer from "./Equalizer";

export default class AudioPlayer {
  constructor( audioCtx, outputNode, playlist ) {
    this.ctx = audioCtx;
    this.playlist = playlist;

    this.eq = new Equalizer( audioCtx );
    this.gain = audioCtx.createGain();
    this.gain.connect( this.eq.entryNode );
    this.eq.outputNode.connect( outputNode );

    this.globalOutputNode = outputNode;
    this.gain.value = 1.0;
    this.outputNode = this.gain;
  }
  /**
   * Add effect node to current playback
   */
  addNode( node ) {
    node.connect( this.outputNode );
    this.outputNode = node;

    this.pause(); // apply to current playback
    this.play(); // what if paused?
  }
  /**
   * Remove all effect nodes
   */
  resetAllNodes() {
    this.pause(); // seperate from bufferSrc
    this.gain.disconnect(); // seperate from added nodes

    this.gain.connect( this.globalOutputNode );
    this.outputNode = this.gain;

    this.play();
  }

  get current() {
    return this.playlist.activeSong;
  }

  lastTimestamp = 0;
  get now() {
    return this.ctx.currentTime;
  }
  seekTo = null; // for pause & seek

  playingSpeed = 1;
  tempoTimeBonus = 0;

  play() {
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
  pause() {
    const res = this.currentPosition();
    this.seekTo = res;
    this.tempoTimeBonus = 0; // reset bonus, as it is now part of seekTo

    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();

    this.lastTimestamp = this.now;
    this.isPause = true;
  }
  seek( pointInTime ) { // only absolute values, i.e. 30 = at the 30sec mark, not +30sec
    if ( this.current.metaData.length.total > pointInTime ) {
      this.seekTo = pointInTime;

      this.bufferSrc.manuallyStopped = true;
      this.bufferSrc.stop();

      this.isPause = false;
      this.play();
    }
  }

  resetPlayer() {
    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();
    this.resetAllNodes(); // disable effects
    this.setVolume();
    this.isPause = false;
    this.playingSpeed = 1;

    this.tempoTimeBonus = 0;
    this.lastTimestamp = 0;
    this.seekTo = null;
  }
  stop() {
    this.resetPlayer();
  }
  next() {
    this.resetPlayer();
    this.playlist.next();
    this.play();
  }
  prev() {
    this.resetPlayer();
    this.playlist.prev();
    this.play();
  }

  setVolume( value = 1 ) { // reset w/ song change
    if ( value <= 1 && value >= 0 )
      this.gain.gain.value = value;
    else
      throw new Error( "invalid value for setVolume, must be >=0 and <=1" );
  }
  setTempo( value ) { // reset w/ song change
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
   * value            - db level to set the eq gain to (default: 0; min: -40; max: 40)
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
