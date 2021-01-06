export default class Playlist {
  constructor( musicLibrary ) {
    this.musicLibrary = musicLibrary;
    this.playlistId = musicLibrary.registerAsPlaylist( this ); // 0=red, 1=green
  }

  list = []; // indices of songs in musicLibrary
  get content() { // translate into songs for external consumption
    const libList = this.musicLibrary.list;
    return this.list.map( index => libList[index] );
  }

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
  add( index ) {
    const isDuplicate = this.list.reduce( ( acc, cur ) => acc ? true : cur === index, false );
    if ( !isDuplicate )
      this.list.push( index );
  }
  delete( at ) {
    this.list.splice( at, 1 );

    if ( at < this.active )
      this.active = this.active-1;
    else if ( at === this.active ) { // explicitly go to the next track
      this.active = this.active-1;
      this.next();
    }
  }

  active = 0;
  get activeSong() {
    return this.content[this.active];
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
