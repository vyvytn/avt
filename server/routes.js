const router = require( "express" ).Router();
const freesound = require( "./freesound" );

// freesound api routes
// reference: https://freesound.org/docs/api/resources_apiv2.html#sound-resources
router.get( "/sounds/:id", ( req, res ) => {
  freesound.getAPI( `sounds/${req.params.id}` )
    .then( data => {
      const metaData = {
        title: data.name.replace( `\.${data.type}`, "" ),
        artist: data.username || null,
        imgUrl: data.images.waveform_m || null,
        duration: data.duration,
        id: data.id,
      };

      res.json( metaData );
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

router.get( "/download/:id", ( req, res ) => {
  freesound.getAPI( `sounds/${req.params.id}/download`, { stream: true } )
    .then( data => {
      res.status( 200 )
      data.pipe( res ); // stream file to client
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

module.exports = router;
