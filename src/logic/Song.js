import MetaData from "./MetaData";

export default class Song {
  /**
   * metaData - meta data object, see metaData for content
   */
  constructor( obj ) {
    this.obj = obj;
    this.type = obj.constructor.name;

    const acceptedTypes = [ "MP3", "Freesound" ];
    if ( !~acceptedTypes.indexOf( this.type ) )
      throw new Error( "passed invalid class instance to constructor. needs one of: " + acceptedTypes );
  }

  get rawBuffer() {
    return this.obj.buffer;
  }
  audioBuffer = null;
  metaData = null;

  /**
   * initialize the song, required to be usable
   */
  async prepareForPlayback( ctx ) {
    const [ tags, audioBuffer ] = await Promise.all( [
      this.getRawTags(),
      this.decodeAudioData( ctx ),
    ] );

    tags.duration = audioBuffer.duration;
    this.metaData = new MetaData( tags );
}

  async getRawTags() {
    let tags;
    switch( this.type ) {
      case "MP3":
        tags = await this.obj.extractMetaData();
        break;
      case "Freesound":
        // search
        break;
    }

    return tags;
  }

  async decodeAudioData( ctx ) {
    this.audioBuffer = await ctx.decodeAudioData( this.rawBuffer );
    return this.audioBuffer;
  }
}
