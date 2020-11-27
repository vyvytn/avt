export default class AudioPlayer {
  // constructor( AudioContext, output ) - ctx shared among players
  //   output isn't ctx.destination itself, but the master gainNode

  // current: Song
  // play()
  // pause()
  // stop()
  // seek( secToSeekTo )

  // playlist: Playlist
  // skip() - delegate to playlist
  // prev() - delegate to playlist

  // setVolume( val ) - resets at song change
  // setTempo( val )  - resets at song change
}
