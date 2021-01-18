const router = require( "express" ).Router();
const freesound = require( "./freesound" );

// freesound api routes
// reference: https://freesound.org/docs/api/resources_apiv2.html#sound-resources
router.get( "/sounds/:id", ( req, res ) => {
  console.log( "/sounds/" + req.params.id )
  freesound.getAPI( `sounds/${req.params.id}` )
    .then( data => {
      console.log( data );
      res.sendStatus( 200 ) //.json( data );
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

router.get( "/download/:id", ( req, res ) => {
  console.log( "/downlaod/" + req.params.id )
  freesound.getAPI( `sounds/${req.params.id}/download`, { stream: true } )
    .then( data => {
      res.status( 200 )
      data.pipe( res ); // stream file to client
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

module.exports = router;
