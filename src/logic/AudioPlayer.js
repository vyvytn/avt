export default class AudioPlayer {
  constructor( audioCtx, outputNode, playlist ) {
    this.ctx = audioCtx;
    this.playlist = playlist;

    this.gain = audioCtx.createGain();
    this.gain.connect( outputNode );
    this.gain.value = 1.0;
    this.outputNode = this.gain;
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
    } else {
      this.bufferSrc.start();
      this.lastTimestamp = this.now;
    }
  }
  handleSongEnd = event => {
    /* triggered on
       1) the natural end of a song
       2) bufferSrc.stop()
       We only want the 1. case

       manuallyStopped needs to be maintained on the bufferSrc, a variable on this leads to inconsistent results
    */
    if ( !event.explicitOriginalTarget.manuallyStopped ) {
      this.next();
    }
  }
  pause() {
    /* debug
    console.log( "now+time", this.now, this.lastTimestamp )
    console.log( "tempo bonus", this.tempoTimeBonus )
    console.log( "now-last*playing", ((this.now - this.lastTimestamp) * this.playingSpeed) )
    console.log( "seek", this.seekTo || 0 )
    */

    const res =
      ((this.now - this.lastTimestamp) * this.playingSpeed) + // speed * time elapsed
      this.tempoTimeBonus + // pre calculated extra time at other speed
      (this.seekTo !== null ? this.seekTo : 0); // previous seek time
    this.seekTo = res;
    this.tempoTimeBonus = 0; // reset bonus, as it is now part of seekTo
    this.lastTimestamp = this.now; // put last timestamp here, as past speed has been factored in and is now part of seekTo

    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();
  }
  seek( pointInTime ) { // only absolute values, i.e. 30 = at the 30sec mark, not +30sec
    if ( this.current.metaData.length.total > pointInTime ) {
      this.seekTo = pointInTime;

      this.bufferSrc.manuallyStopped = true;
      this.bufferSrc.stop();

      this.play();
    }
  }

  resetPlayer() {
    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();
    this.setVolume();
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
}
