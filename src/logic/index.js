// audio logic (preliminary) entry point

import axios from "axios";

import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";
import MusicLibrary from "./MusicLibrary";
import Song from "./Song";
import MP3 from "./MP3";
import Crossfader from "./Crossfader";

const ctx = new AudioContext(); // shared context

const masterGain = ctx.createGain();
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
  axios.get( "http://localhost:8090/static/Bosshafte Beats - Sunglass Evo.mp3", { responseType: "arraybuffer" } )
    .then( async res => {
      const bb = new Song( new MP3( res.data ) );
      await bb.prepareForPlayback( ctx );
      playlist.add( lib.insert( bb ) );

      player.play();
      console.log( "playing: " + bb.metaData.artist + " - " + bb.metaData.title );

      window.setTimeout( () => {
        console.log( "seek + 1.5x" )
        player.seek( 20 );
        player.setTempo( 1.5 );
      }, 2000 );
      window.setTimeout( () => {
        console.log( "2x" )
        player.setTempo( 2 );
      }, 6000 );
      window.setTimeout( () => {
        console.log( "pause" )
        player.pause();
      }, 8000 );
      window.setTimeout( () => {
        console.log( "play" )
        player.play();
      }, 10000 );
      window.setTimeout( () => {
        console.log( "1x" )
        player.setTempo( 1 );
      }, 12000 );
      // window.setTimeout( () => {
      //   console.log( "next" )
      //   player.next();
      //   console.log( "playing: " + player.current.metaData.artist + " - " + player.current.metaData.title );
      // }, 15000 );
      window.setTimeout( () => {
        console.log( "pause" )
        player.pause();
        rightPlayer.pause();
      }, 19000 );

    } )
    .then( () => axios.get( "http://localhost:8090/static/Black Muffin - Die and Retry.mp3", { responseType: "arraybuffer" } ) )
    .then( async res => {
      const bm = new Song( new MP3( res.data ) );
      await bm.prepareForPlayback( ctx );

      playlist.add( lib.insert( bm ) );
      rightPlaylist.add( lib.insert( bm ) );
      console.log( "inserted 2nd song" )

      rightPlayer.play();
      console.log( "play 2nd" )

      window.setTimeout( () => {
        console.log( "cross 1" )
        crossfader.setBalance( 1 );
      }, 2000 );
      window.setTimeout( () => {
        console.log( "cross 0" )
        crossfader.setBalance( 0 );
      }, 4000 );
      window.setTimeout( () => {
        console.log( "cross .25" )
        crossfader.setBalance( .25 );
      }, 6000 );
    })
})();
