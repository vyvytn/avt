const axios = require( "axios" );
const fs = require( "./fs" );

async function getAccessToken( env, refreshToken = null ) {
  // docs: https://freesound.org/docs/api/authentication.html

  const reqParams = {
    client_id: env.client_id,
    client_secret: env.client_secret,
  };

  if ( refreshToken == null ) {
    reqParams.grant_type = "authorization_code";
    reqParams.code = env.auth_code;
  } else {
    reqParams.grant_type = "refresh_token";
    reqParams.refresh_token = refreshToken;
  }

  let res = await axios.post( "https://freesound.org/apiv2/oauth2/access_token", {}, { params: reqParams } )
    .then( res => res.data )
    .catch( err => err.response )//.data )

  // if ( res.error == "invalid_grant" && refreshToken ) { // re-used refresh token
  //   res = await getAccessToken(); // try to get new one with auth_code
  // }

  return res;
}

async function getAPI( route, options = {} ) {
  const env = fs.readData();

  const base = {}
  if ( options.stream )
    base.responseType = "stream";

  const req = axios.create( Object.assign( base, {
    baseURL: "https://freesound.org/apiv2/",
    headers: {"Authorization": `${env.token_type} ${env.access_token}`},
  } ) );
  return req.get( `${route}` )
    .then( res => res.data )
    .catch( err => err.response );
}

module.exports = {
  getAccessToken,
  getAPI,
}
