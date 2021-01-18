const axios = require( "axios" );
const fs = require( "./fs" );

const config = fs.loadConfig();

async function getAccessToken( prevData ) {
  // docs: https://freesound.org/docs/api/authentication.html

  const reqParams = {
    client_id: config.client_id,
    client_secret: config.client_secret,
  };

  if ( prevData.refresh_token ) {
    reqParams.grant_type = "refresh_token";
    reqParams.refresh_token = prevData.refresh_token;
  } else {
    reqParams.grant_type = "authorization_code";
    reqParams.code = prevData.auth_code;
  }

  let data = await axios.post( "https://freesound.org/apiv2/oauth2/access_token", {}, { params: reqParams } )
    .then( res => { console.log(res); return res; } )
    .then( res => res.data )
    .catch( err => { console.log(err); return {}; } )

  data.expires_at = Date.now() + (data.expires_in * 1000);
  delete data.expires_in;
  delete data.scope;

  fs.writeData( data );
  return data;
}

async function getAPI( route, options = {} ) {
  let data = fs.readData();

  if ( data.expires_at <= Date.now() ) {
    data = await getAccessToken( data );
  }

  const base = {}
  if ( options.stream )
    base.responseType = "stream";

  const req = axios.create( Object.assign( base, {
    baseURL: "https://freesound.org/apiv2/",
    headers: {"Authorization": `${data.token_type} ${data.access_token}`},
  } ) );
  return req.get( `${route}` )
    .then( res => res.data )
    .catch( err => err.response );
}

module.exports = {
  getAccessToken,
  getAPI,
}
