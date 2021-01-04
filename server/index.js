const express = require( "express" );
const bodyParser = require( "body-parser" );
const cors = require( "cors" );
const fs = require( "./fs" );

const data = fs.readData();

const server = express();

server.use( bodyParser.json() );
server.use( bodyParser.urlencoded( { extended: true } ) );

server.use( cors() ); // allow for access from vue router
server.use( "/static", express.static( `${__dirname}/../static` ) );

/* Todo:
 * - cleanup refresh routes
 * - convert expires_in into comparable date object
 * - automatic refresh if expired
 *
 * - heroku deployment with data.json possible?
 */

server.use( "/", require( "./routes" ) );

// error handler (fallback)
server.use( "/", ( err, req, res ) => {
  res.status( 500 ).json( {
    error: true,
    errorMsg: err.message || "generic server error",
  } );
} );

const port = 8090;
server.listen( port, () => console.log( `Listening on port: ${port}` ) );
