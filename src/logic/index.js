// audio logic (preliminary) entry point

import axios from "axios";

import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";
import MusicLibrary from "./MusicLibrary";
import Song from "./Song";
import MP3 from "./MP3";
import { search } from "./Freesound";
import Crossfader from "./Crossfader";

const serverConnection = "https://dj.jneidel.com";

const ctx = new AudioContext(); // shared context

const masterGain = ctx.createGain(); // gain shared accross players
masterGain.connect( ctx.destination );
masterGain.value = 1.0;

const crossfader = new Crossfader( ctx );
const [ leftOutNode, rightOutNode ] = crossfader.generateOutputNodes( masterGain );

const lib = new MusicLibrary();
const playlist = new Playlist( lib );
const player = new AudioPlayer( ctx, leftOutNode, playlist );

const rightPlaylist = new Playlist( lib );
const rightPlayer = new AudioPlayer( ctx, rightOutNode, rightPlaylist );

(async () => {
  axios.get( serverConnection + "/static/Bosshafte Beats - Sunglass Evo.mp3", { responseType: "arraybuffer" } )
    .then( async res => {
      // const results = await search( "bruh moment" )
      // const bruh = results[0];
      // await bruh.prepareForPlayback( ctx );
      // playlist.add( lib.insert( bruh ) );

      const bb = new Song( new MP3( res.data ) );
      await bb.prepareForPlayback( ctx );
      playlist.add( lib.insert( bb ) );

      player.play();

      window.setTimeout( () => {
        player.effects.toggle( "Verzerrer" );
      }, 2000 );
      window.setTimeout( () => {
        player.effects.toggle( "Telefon" );
      }, 4000 );
       window.setTimeout( () => {
        player.effects.toggle( "Verzerrer" );
      }, 8000 );
      window.setTimeout( () => {
        player.effects.toggle( "Telefon" );
      }, 10000 );

      // window.setTimeout( () => {
      //   player.seek( 20 );
      //   player.setTempo( 1.5 );
      //   player.next();
      // }, 4000 );
      // window.setTimeout( () => {
      //   player.setTempo( 2 );
      // }, 8000 );
      // window.setTimeout( () => {
      //   player.pause();
      // }, 10000 );
      // window.setTimeout( () => {
      //   player.play();
      // }, 12000 );
      // window.setTimeout( () => {
      //   console.log( "1x + bass boosted" )
      //   player.setEq( 64, 25 );
      //   player.setTempo( 1 );
      // }, 14000 );
      // window.setTimeout( () => {
      //   console.log( "next" )
      //   player.next();
      //   console.log( "playing: " + player.current.metaData.artist + " - " + player.current.metaData.title );
      // }, 15000 );
      window.setTimeout( () => {
        player.pause();
        rightPlayer.pause();
      }, 20000 );

    } )
    .then( () => axios.get( serverConnection + "/static/Black Muffin - Die and Retry.mp3", { responseType: "arraybuffer" } ) )
    .then( async res => {
      const bm = new Song( new MP3( res.data ) );
      await bm.prepareForPlayback( ctx );

      playlist.add( lib.insert( bm ) );
      rightPlaylist.add( lib.insert( bm ) );
      console.log( "inserted 2nd song" )

      // rightPlayer.play();
      // console.log( "play 2nd" )

      // window.setTimeout( () => {
      //   console.log( "cross 1" )
      //   crossfader.setBalance( 1 );
      // }, 2000 );
      // window.setTimeout( () => {
      //   console.log( "cross 0" )
      //   crossfader.setBalance( 0 );
      // }, 4000 );
      // window.setTimeout( () => {
      //   console.log( "cross .25" )
      //   crossfader.setBalance( .25 );
      // }, 6000 );
    })
})();
