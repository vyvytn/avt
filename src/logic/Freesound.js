export default class Freesound {
  constructor( freesoundId ) {
    this.id = freesoundId;
    // create incomplete metaData obj based on return data
  }
  getMetaData() {
    // complete metaData obj
  }
  getBuffer() {
    // stream buffer
    // this.buffer = arraybuff;
  }
}

export function search( query ) {
  // get results

  // res.map( r => new Freesound( r.id ) );
  // return res;
}
