import MetaData from "./MetaData";

export default class Song {
  metaData = null;
  get rawBuffer() { return this.obj.buffer; }
  audioBuffer = null;

  constructor( obj ) {
    this.obj = obj;
    this.type = obj.constructor.name;

    const acceptedTypes = [ "MP3", "Freesound" ];
    if ( !~acceptedTypes.indexOf( this.type ) )
      throw new Error( "passed invalid class instance to constructor. needs one of: " + acceptedTypes );

    if ( this.type === "Freesound" )
      this.metaData = obj.metaData;
  }

  async prepareForPlayback( ctx ) { // needs to be run together w/ counstructor, otherwise obj not usable

    switch( this.type ) {
      case "MP3":
        const [ tags, audioBuffer ] = await Promise.all( [
          this.obj.extractMetaData(),
          this.decodeAudioData( ctx ),
        ] );

        tags.duration = audioBuffer.duration;
        this.metaData = new MetaData( tags );
        break;
      case "Freesound":
        await this.obj.downloadBuffer();
        await this.decodeAudioData( ctx );
        break;
    }
  }

  async decodeAudioData( ctx ) {
    this.audioBuffer = await ctx.decodeAudioData( this.rawBuffer );
    return this.audioBuffer;
  }
}
