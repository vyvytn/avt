import axios from "axios";

export default async function createHall( ctx, serverConnection ) {
  const hall = ctx.createConvolver();

  const impulseResponseBuffer = await axios.get( serverConnection + "/static/impulse-response/spring.wav", { responseType: "arraybuffer" } )
    .then( res => ctx.decodeAudioData( res.data ) );
  hall.buffer = impulseResponseBuffer;

  return hall;
}
