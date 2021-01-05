import MetaData from "./MetaData";

export default class Song {
  constructor( obj ) {
    this.obj = obj;
    this.type = obj.constructor.name;

    const acceptedTypes = [ "MP3", "Freesound" ];
    if ( !~acceptedTypes.indexOf( this.type ) )
      throw new Error( "passed invalid class instance to constructor. needs one of: " + acceptedTypes );
  }

  get buffer() {
    return this.obj.buffer;
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

  async decodeAudioData( ctx ) {
    this.audioBuffer = await ctx.decodeAudioData( this.buffer );
    return this.audioBuffer;
  }

  // ? audio encoding props: { bitrate, encoding, etc. }
}
