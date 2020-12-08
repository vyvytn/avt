// audio logic (preliminary) entry point

import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";
import MusicLibrary from "./MusicLibrary";

// shared context
const ctx = new AudioContext();

const masterGain = ctx.createGain();
masterGain.connect( ctx.destination );
masterGain.value = 1.0;

const lib = new MusicLibrary();
const playlist = new Playlist( lib );
const player = new AudioPlayer( ctx, masterGain, playlist );
