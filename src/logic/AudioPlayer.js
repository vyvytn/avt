export default class AudioPlayer {
  constructor( audioCtx, outputNode, playlist ) {
    this.ctx = audioCtx;
    this.playlist = playlist;

    this.gain = ctx.createGain();
    this.gain.connect( outputNode );
    this.gain.value = 1.0;
    this.outputNode = this.gain;
  }

  get current() {
    return this.playlist.activeSong;
  }

  pausedOffset = 0; // in sec
  playingSpeed = 1;
  play() {
    if ( this.bufferSrc )
      this.bufferSrc.stop();

    const bufferSrc = this.ctx.createBufferSource();
    bufferSrc.buffer = this.current.buffer;
    bufferSrc.onend = this.handleSongEnd;
    bufferSrc.connect( this.outputNode );

    const TIME_DELAY = 0;
    bufferSrc.playbackRate = this.playingSpeed;
    bufferSrc.start( TIME_DELAY, this.pausedOffset );
    this.pausedOffset = 0;
    this.bufferSrc = bufferSrc;

    // set timer for pause
  }
  handleSongEnd( event ) {
    this.next();
    this.play();
  }
  pause() {
    // this.pausedOffset = xy;
  }
  stop() {
    this.bufferSrc.stop();
    this.pausedOffset = 0;
    this.playingSpeed = 1;
  }
  seek( offset ) {
    this.bufferSrc.stop();
    this.pausedOffset = offset;
    this.play(); // continue from pausedOffset
  }

  next() { this.playlist.next() }
  prev() { this.playlist.prev() }

  setVolume( value ) { // resets at song change
    if ( value <= 1 && value >= 0 )
      this.gain.value = value;
  }
  setTempo( value ) { // resets at song change
    this.playingSpeed = value;
    this.pause();
    this.play();
  }
}
