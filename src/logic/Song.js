import MetaData from "./MetaData";

export default class Song {
  acceptedTypes = [ "MP3", "Freesound" ];
  constructor( obj ) {
    this.obj = obj;

    const type = obj.constructor.name;
    if ( !~this.acceptedTypes.indexOf( type ) )
      throw new Error( "passed invalid class instance to constructor. needs one of: " + this.acceptedTypes );

    this.type = type;
  }

  async getMetaData() {
    if ( this.metaData )
      return this.metaData;

    let tags;
    switch( this.type ) {
      case "MP3":
        tags = await this.obj.extractMetaData();
        break;
      case "Freesound":
        // search
        break;
    }

    const metaData = new MetaData( tags );
    this.metaData = metaData;
    return metaData;
  }
  // ? audio encoding props: { bitrate, encoding, etc. }
}
