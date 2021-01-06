export default class MetaData {
  constructor( data ) {
    this.artist = data.artist ? data.artist : null;
    this.title = data.title ? data.title : "No title"; // required?
    this.image = data.image ? data.image : null;

    if ( data.duration )
      this.length = {
        total: data.duration, // in secs for calculation
        minutes: Math.floor( data.duration / 60 ), // for min:sec for humans
        seconds: data.duration % 60,
      };
  }
}
