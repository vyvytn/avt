export default class MetaData {
  constructor( data ) {
    this.artist = data.artist ? data.artist : null;
    this.title = data.title ? data.title : "No title"; // required?
    this.image = data.image ? data.image : null;
  }
}
