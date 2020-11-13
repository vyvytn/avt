const fs = require( "fs" );
const path = require( "path" );

const configFd = fs.openSync( path.resolve( __dirname, "config.json" ), "r" );
const dataFd = fs.openSync( path.resolve( __dirname, "data.json" ), "r+" );

function loadConfig() {
  const raw = fs.readFileSync( configFd, { encoding: "utf8" } );
  return JSON.parse( raw );
}

const dataBuff = new Buffer.alloc( 200 ); // leftover space will be padded w/ '\0'
function readData() {
  fs.readSync( dataFd, dataBuff, { position: 0 } );
  const raw = dataBuff.toString( "utf8" ).replace(/\0/g, "");
  // src: https://github.com/nodejs/node/issues/4775#issuecomment-173130272
  return JSON.parse( raw );
}

function writeData( raw ) {
  const json = JSON.stringify( raw, null, 2 );
  // file needs to be emptied before the write, otherwise there might be leftover data
  fs.ftruncateSync( dataFd );
  fs.writeFileSync( dataFd, json, 0, "utf8" );
}

module.exports = {
  loadConfig,
  readData,
  writeData,
}
