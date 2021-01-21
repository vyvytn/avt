import axios from "axios";

const serverConnection = "https://dj.jneidel.com"

export default async function createTelefon( ctx ) {
  const telefon = ctx.createConvolver();

  const impulseResponseBuffer = await axios.get( serverConnection + "/static/impulse-response/telephone.wav", { responseType: "arraybuffer" } )
    .then( res => ctx.decodeAudioData( res.data ) );
  telefon.buffer = impulseResponseBuffer;

  return telefon;
}
