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

    if ( this.lastTimestamp !== 0 ) {
      this.bufferSrc.playbackRate.value = this.playingSpeed;

      const START_DELAY = 0;
      this.bufferSrc.start( START_DELAY, this.lastTimestamp );
    } else
      this.bufferSrc.start();
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
    this.lastTimestamp = (this.now - this.lastTimestamp) * this.playingSpeed + this.tempoTimeBonus;

    this.bufferSrc.stop();
  }
  seek( pointInTime ) { // only absolute values, i.e. 30 = at the 30sec mark, not +30sec
    if ( this.current.metaData.length.total > pointInTime ) {
      this.lastTimestamp = pointInTime;

      this.bufferSrc.manuallyStopped = true;
      this.bufferSrc.stop();

      this.play(); // play from lastTimestamp
    }
  }

  resetPlayer() {
    this.bufferSrc.manuallyStopped = true;
    this.bufferSrc.stop();
    this.setVolume();
    this.playingSpeed = 1;
    this.tempoTimeBonus = 0;
    this.lastTimestamp = 0;
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
    this.lastTimestamp = timePlayedInLastTempo;
    this.tempoTimeBonus += timePlayedInLastTempo;
    this.playingSpeed = value;
  }
}
