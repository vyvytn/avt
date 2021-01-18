export default class Playlist {
  /**
   * id to differentiate between the left and right playlist
   *   id (0 or 1) could be translated into a color (0=red, 1=green), etc.
   */
  playlistId;

  constructor( musicLibrary ) {
    this.musicLibrary = musicLibrary;
    this.playlistId = musicLibrary.registerAsPlaylist( this );
  }

  /**
   * list of song indices, refering to their place in the library
   */
  list = [];

  /**
   * list of songs in the playlist (w/ song objects themselves)
   */
  get content() { // translate into songs for external consumption
    const libList = this.musicLibrary.list;
    return this.list.map( index => libList[index] );
  }

  /**
   * add a song (via it's library index) to the playlist
   */
  add( index ) {
    const isDuplicate = this.list.reduce( ( acc, cur ) => acc ? true : cur === index, false );
    if ( !isDuplicate )
      this.list.push( index );
  }
  /**
   * delete a song at the given index (not library index, but this.list index)
   * @param at - list index
   */
  delete( at ) {
    this.list.splice( at, 1 );
    if ( at < this.active )
      this.active = this.active-1;
    else if ( at === this.active ) { // explicitly go to the next track
      this.active = this.active-1;
      this.next();
    }
  }
  /**
   * move a song from position from to position to
   * @param from - list index
   * @param to - list index
   */
  move( from, to ) {
    try {
      const element = this.list.splice( from, 1 )[0]; // throws if no from index
      this.list.splice( to, 0, element );

      if ( this.active === from )
        this.active = to;
      else if ( this.active > from && this.active < to )
        this.active = this.active -1;
    } catch( e ) {
      throw new Error( "Invalid index to move from" );
    }
  }

  // to be accessed through AudioPlayer
  active = 0;
  get activeSong() {
    return this.content[this.active];
  }

  get activeSongId(){
    return this.active

  }

  next() { // loop around if on last song
    this.active = this.active+1 === this.list.length ? 0 : this.active+1;
    return this.active;
  }
  prev() {
    this.active = this.active-1 === 0 ? this.list.length-1 : this.active-1;
    return this.active;
  }
}
