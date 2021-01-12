export default class MetaData {
  /**
   * not to be created manually
   * accessible through Song.metaData
   *
   * artist - can be null
   * title
   * image  - image buffer
   * length: {
   *   total   - total duration in seconds (machine readable)
   *   minutes - minutes for min:sec (human readable)
   *   seconds - seconds for min:sec (human readable)
   * }
   */
  constructor( data ) {
    this.artist = data.artist ? data.artist : null;
    this.title = data.title ? data.title : "No title"; // make required?
    this.image = data.image ? data.image : null;

    if ( data.duration )
      this.length = {
        total: data.duration,
        minutes: Math.floor( data.duration / 60 ),
        seconds: data.duration % 60,
      };
  }
}
