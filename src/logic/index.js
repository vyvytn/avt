// audio logic (preliminary) entry point

import axios from "axios";

import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";
import MusicLibrary from "./MusicLibrary";
import Song from "./Song";
import MP3 from "./MP3";
import { search } from "./Freesound";

const ctx = new AudioContext(); // shared context

const masterGain = ctx.createGain();
masterGain.connect( ctx.destination );
masterGain.value = 1.0;

const lib = new MusicLibrary();
const playlist = new Playlist( lib );
const player = new AudioPlayer( ctx, masterGain, playlist );

(async () => {
  axios.get( "http://localhost:8090/static/Bosshafte Beats - Sunglass Evo.mp3", { responseType: "arraybuffer" } )
    .then( async res => {
      const results = await search( "bruh moment" )
      const bruh = results[0];
      await bruh.prepareForPlayback( ctx );
      playlist.add( lib.insert( bruh ) );

      const bb = new Song( new MP3( res.data ) );
      await bb.prepareForPlayback( ctx );
      playlist.add( lib.insert( bb ) );

      player.play();

      window.setTimeout( () => {
        player.seek( 20 );
        player.setTempo( 1.5 );
        player.next();
      }, 4000 );
      window.setTimeout( () => {
        player.setTempo( 2 );
      }, 8000 );
      window.setTimeout( () => {
        player.pause();
      }, 10000 );
      window.setTimeout( () => {
        player.play();
      }, 12000 );
      window.setTimeout( () => {
        player.setTempo( 1 );
      }, 14000 );
      window.setTimeout( () => {
        player.next();
      }, 18000 );
      window.setTimeout( () => {
        player.pause();
      }, 23000 );

    } )
    .then( () => axios.get( "http://localhost:8090/static/Black Muffin - Die and Retry.mp3", { responseType: "arraybuffer" } ) )
    .then( async res => {
      const bm = new Song( new MP3( res.data ) );
      await bm.prepareForPlayback( ctx );

      playlist.add( lib.insert( bm ) );
      console.log( "inserted 2nd song" )
    })
})();
