import axios from "axios";
import MetaData from "./MetaData";
import Song from "./Song";

const serverConnection = "http://localhost:8090"

export default class Freesound {
  constructor( data ) {
    this.id = data.id;
    this.metaData = new MetaData( data );
  }
  async downloadBuffer() {
    this.buffer = await axios.get( `${serverConnection}/download/${this.id}`, { responseType: "arraybuffer" } )
      .then( res => res.data )
      .catch( err => console.log( "server error:" + err ) );
  }
}

export async function search( query ) {
  query = encodeURIComponent( query );

  const results = await axios.get( `${serverConnection}/search/${query}` )
    .then( res => res.data )
    .catch( err => console.log( "server error:" + err ) );

  return results.map( x => new Song( new Freesound( x ) ) );
}
