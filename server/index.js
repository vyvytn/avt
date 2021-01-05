const express = require( "express" );
const bodyParser = require( "body-parser" );
const cors = require( "cors" );
const fs = require( "./fs" );
const freesound = require( "./freesound" );

const freesoundProps = fs.loadConfig();
const data = fs.readData();

const server = express();

server.use( bodyParser.json() );
server.use( bodyParser.urlencoded( { extended: true } ) );

server.use( cors() ); // allow for access from vue router
server.use( "/static", express.static( `${__dirname}/../static` ) );

/* Todo:
 * - cleanup refresh routes
 * - refactor routes into own file
 * - convert expires_in into comparable date object
 * - automatic refresh if expired
 * - error handling middleware
 * - help menu on .all( "*" ) routes
 *
 * - heroku deployment with data.json possible?
 */

server.use( "/refresh_token", ( req, res ) => {
  console.log( "/refresh_token" )
  freesound.getAccessToken( freesoundProps , data.refresh_token )
    .then( d => {
      console.log( d )
      if ( d ) {
        try {
          fs.writeData( d );
        } catch(e) {
          console.error( e );
        }
      }

      res.json( d.data );
    } )
} );
server.use( "/refresh_auth", ( req, res ) => {
  console.log( "/refresh_auth" )
  freesound.getAccessToken( freesoundProps )
    .then( d => {
      console.log( d )
      if ( d ) {
        try {
          fs.writeData( d );
        } catch(e) {
          console.error( e );
        }
      }

      res.json( d.data );
    } )
} );

// freesound api routes
// reference: https://freesound.org/docs/api/resources_apiv2.html#sound-resources
server.use( "/sounds/:id", ( req, res ) => {
  console.log( "/sounds/" + req.params.id )
  freesound.getAPI( `sounds/${req.params.id}` )
    .then( data => {
      console.log( data );
      res.sendStatus( 200 ) //.json( data );
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

server.use( "/download/:id", ( req, res ) => {
  console.log( "/downlaod/" + req.params.id )
  freesound.getAPI( `sounds/${req.params.id}/download`, { stream: true } )
    .then( data => {
      res.status( 200 )
      data.pipe( res ); // stream file to client
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

// help menu
server.use( "/", ( req, res ) => {
  res.status( 200 ).send( `Available routes:
/sounds/:id   - get info on sound
/download/:id - download sound file
` );
} );

const port = 8090;
server.listen( port, () => console.log( `Listening on port: ${port}` ) );
