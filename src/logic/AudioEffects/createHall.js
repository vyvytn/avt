import axios from "axios";

const serverConnection = "https://dj.jneidel.com"

export default async function createHall( ctx ) {
  const hall = ctx.createConvolver();

  const impulseResponseBuffer = await axios.get( serverConnection + "/static/impulse-response/spring.wav", { responseType: "arraybuffer" } )
    .then( res => ctx.decodeAudioData( res.data ) );
  hall.buffer = impulseResponseBuffer;

  return hall;
}
