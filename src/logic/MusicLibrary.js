import Song from "./Song";

export default class MusicLibrary {
  list = []; // Song[]
  insert( song ) {
    this.list.push( song );
  }

  playlists = [];
  registerAsPlaylist( playlist ) {
    if ( this.playlists.length === 2 )
      throw new Error( "MusicLibrary takes only two Playlists" );

    this.playlists.push( playlist );
    return this.playlists.length - 1;
  }
}
