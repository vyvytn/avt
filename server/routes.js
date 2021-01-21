const router = require( "express" ).Router();
const freesound = require( "./freesound" );

function normalizeMetaData( data ) {
  return {
    id: data.id,
    title: data.name.replace( `\.${data.type}`, "" ),
    artist: data.username,
    imgUrl: data.images.waveform_m,
    duration: data.duration,
  };
}

// freesound api routes
// reference: https://freesound.org/docs/api/resources_apiv2.html#sound-resources
router.get( "/search/:query", ( req, res ) => {
  freesound.getAPI( `search/text?query=${encodeURIComponent( req.params.query )}&fields=id,name,username,duration,images,type` )
    .then( data => {
      const results = data.results.map( x => normalizeMetaData( x ) );
      res.json( results );
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

router.get( "/download/:id", ( req, res ) => {
  freesound.getAPI( `sounds/${req.params.id}/download`, { stream: true } )
    .then( data => {
      data.pipe( res ); // stream file to client
    } )
    .catch( e => res.sendStatus( 400 ) );
} );

/* debug
router.get( "/sounds/:id", ( req, res ) => {
  freesound.getAPI( `sounds/${req.params.id}` )
    .then( data => {
      data = normalizeMetaData( data );
      res.json( metaData );
    } )
    .catch( e => res.sendStatus( 400 ) );
} );
*/

module.exports = router;
