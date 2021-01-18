import { Promise as mp3Tags } from 'node-id3';

export default class MP3 {
  /**
   * @param arraybuff - has to be arraybuffer, only type decodeAudioData accepts
   */
  constructor( arraybuff ) {
    this.buffer = arraybuff;
  }

  async extractMetaData() {
    const buff = Buffer.from( this.buffer );
    const tags = await mp3Tags.read( buff )
      .then( tags => {
        const cleanedTags = {};

        const setTag = key => { if ( tags[key] ) cleanedTags[key] = tags[key] };
        setTag( "artist" );
        setTag( "title" );
        if ( tags.image ) cleanedTags.image = tags.image.imageBuffer;

        return cleanedTags;
      } )
      .catch( err => {
        return {}
      } ) // empty tags, error reading them

    return tags;
  }
}
