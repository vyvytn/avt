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

  pausedOffset = 0; // in sec, applied on play()

  // for using pause
  pausedTimer = null;
  pausedTimerOffset = 0;

  playingSpeed = 1;

  async play() {
    if ( this.bufferSrc )
      this.bufferSrc.stop();

    const bufferSrc = this.ctx.createBufferSource();
    bufferSrc.buffer = this.current.audioBuffer ?
      this.current.audioBuffer :
      await this.current.decodeAudioData( this.ctx ); // buffer needs to be decoded once prior to playing
    bufferSrc.onend = this.handleSongEnd;
    bufferSrc.connect( this.outputNode );

    const TIME_DELAY = 0;
    // bufferSrc.playbackRate = this.playingSpeed;
    bufferSrc.start( TIME_DELAY, this.pausedOffset );
    this.pausedOffset = 0;
    this.bufferSrc = bufferSrc;

    this.pausedTimer = Date.now();
  }
  handleSongEnd( event ) {
    this.next();
    this.play();
  }
  pause() {
    let secsElapsed = Math.round( (Date.now()-this.pausedTimer)/1000, 0 ); // read timer
    secsElapsed = secsElapsed * this.playingSpeed; // apply playing speed
    secsElapsed = secsElapsed + this.pausedTimerOffset; // apply timer offset from pause/playing more than once on song

    // offset to be applied
    this.pausedOffset = secsElapsed;
    this.pausedTimerOffset = secsElapsed;
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

  next() {
    this.pausedTimerOffset = 0;
    this.playlist.next();
    this.stop();
    this.play();
  }
  prev() {
    this.pausedTimerOffset = 0;
    this.playlist.prev();
    this.stop();
    this.play();
  }

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
