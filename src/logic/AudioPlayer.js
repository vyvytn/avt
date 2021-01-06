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

  requiresOffset = false;
  lastTimestamp = 0;
  get now() {
    return this.ctx.currentTime;
  }

  playingSpeed = 1;
  tempoTimeBonus = 0;

  play() {
    if ( this.bufferSrc )
      this.bufferSrc.stop();

    const bufferSrc = this.ctx.createBufferSource();
    bufferSrc.buffer = this.current.audioBuffer;

    bufferSrc.onended = this.handleSongEnd;
    bufferSrc.connect( this.outputNode );

    if ( this.requiresOffset ) {
      bufferSrc.playbackRate.value = this.playingSpeed;

      const START_DELAY = 0;
      bufferSrc.start( START_DELAY, this.lastTimestamp );

      this.requiresOffset = false; // reset for handleSongEnd
    } else
      bufferSrc.start();

    this.bufferSrc = bufferSrc;
  }
  handleSongEnd = event => {
    // triggered on the natural end of a song
    // or bufferSrc.stop()
    if ( !this.requiresOffset ) { // only trigger on natural end
      this.next();
      this.play();
    }
  }
  pause() {
    this.requiresOffset = true;
    this.lastTimestamp = (this.now - this.lastTimestamp) * this.playingSpeed + this.tempoTimeBonus;

    this.bufferSrc.stop();
  }
  seek( offset ) {
    this.bufferSrc.stop();
    this.play(); // continue from lastTimetamp
  }

  resetPlayer() {
    this.bufferSrc.stop();
    this.requiresOffset = false; // reset after stop, don't trigger handleSongEnd
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
