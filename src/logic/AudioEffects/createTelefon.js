import axios from "axios";

export default async function createTelefon( ctx, serverConnection ) {
  const telefon = ctx.createConvolver();

  const impulseResponseBuffer = await axios.get( serverConnection + "/static/impulse-response/telephone.wav", { responseType: "arraybuffer" } )
    .then( res => ctx.decodeAudioData( res.data ) );
  telefon.buffer = impulseResponseBuffer;

  return telefon;
}
