<template>
  <b-container fluid="">
    <b-row>
      <b-col col>
        <deck @openLibraryClicked="togglePlaylistModal" id="deckA" :array-playlist="listA" @play="playA()" @pause="pauseA" @stop="stopA"></deck>
      </b-col>
      <b-col cols="12" md="auto">
        <h4>Volume</h4>
        <b-row>
          <b-col cols="auto">
            <VolumeSlider id="gainLeftDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>L</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="gainMasterSlider" :horizontal="false"></VolumeSlider>
            <h6>M</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="gainRightDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>R</h6>
          </b-col>
        </b-row>
        <h4>Tempo</h4>
        <b-row>
          <b-col cols="auto">
            <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>L</h6>
          </b-col>
          <b-col cols="auto">
            <VolumeSlider id="tempoRightDeckSlider" :horizontal="false"></VolumeSlider>
            <h6>R</h6>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="auto">
            <h4>Fading</h4>
            <VolumeSlider id="crossfadeSlider" :horizontal="true"></VolumeSlider>
          </b-col>
        </b-row>
      </b-col>
      <b-col col>
        <deck @openLibraryClicked="togglePlaylistModal" id="deckB" :array-playlist="listB" @play="playB()" @pause="pauseB" @stop="stopB"></deck>
      </b-col>
    </b-row>

    <!--MENU FOR PLAYLIST EDITING BEGIN-->
    <b-modal ref="playlistModal" title="Playlist bearbeiten">
      <b-tabs pills card fill>
        <b-tab title="Bibliothek" active>
          <b-card-text>
            <edit-play-list :play-list-array-a="listA" :play-list-array-b="listB"
                            :song-library="songLibrary"></edit-play-list>
          </b-card-text>
        </b-tab>
        <b-tab title="Musik importieren">
          <b-card-text>
            <FileExplorer @update="updateLibraryFile"></FileExplorer>
          </b-card-text>
        </b-tab>
        <b-tab title="Freesound">
          <FreeSoundList @update="updateLibraryFree" :duplicate="duplicateFreesound"></FreeSoundList>
        </b-tab>
      </b-tabs>
    </b-modal>
    <!--MENU FOR PLAYLIST EDITING END-->
  </b-container>

</template>

<script>

import deck from './deck';
import VolumeSlider from './VolumeSlider';
import FreeSoundList from './FreeSoundList';
import FileExplorer from './FileExplorer';
import EditPlayList from './EditPlayList';
import AudioPlayer from '../logic/AudioPlayer';
import AudioEffects from '../logic/AudioEffects';
import Playlist from '../logic/Playlist';
import MusicLibrary from '../logic/MusicLibrary';
import MP3 from '../logic/MP3';
import Song from '../logic/Song';
import axios from 'axios';

/**
 * Web Audio Api
 * creating audio context and mastergain
 */
const ctx = new AudioContext(); // shared context
const masterGain = ctx.createGain(); // gain shared accross players
masterGain.connect(ctx.destination);
masterGain.value = 1.0;

/**
 * creating player and playlists for deck a and b
 */
const lib = new MusicLibrary();
const playlistA = new Playlist(lib);
const playerA = new AudioPlayer(ctx, masterGain, playlistA);
const playlistB = new Playlist(lib);
const playerB = new AudioPlayer(ctx, masterGain, playlistB);
/**
 * get song and connect to mastergain
 */
let songUrl = 'http://localhost:8080/static/example.mp3';
axios.get(songUrl, { responseType: 'arraybuffer' })
  .then(async res => {
    const bb = new Song(new MP3(res.data));
    await bb.prepareForPlayback(ctx);
    playlistA.add(lib.insert(bb));
    playlistB.add(lib.insert(bb));
    console.log('playing: ' + bb.metaData.artist + ' ' + bb.metaData.title);
  })
  .then(() => axios.get('http://localhost:8080/static/Black Muffin - Die and Retry.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const bm = new Song(new MP3(res.data));
    await bm.prepareForPlayback(ctx);
    playlistA.add(lib.insert(bm));
    playlistB.add(lib.insert(bm));

    console.log('playing: ' + bm.metaData.artist + ' ' + bm.metaData.title);
    console.log(playlist.list);

  })
  .then(() => axios.get('http://localhost:8080/static/Black Muffin - Die and Retry.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const m = new Song(new MP3(res.data));
    await m.prepareForPlayback(ctx);
    playlistA.add(lib.insert(m));
    playlistB.add(lib.insert(m));
    console.log('playing: ' + m.metaData.artist + ' ' + m.metaData.title);
    console.log(playlistA.list);
  });
export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck,
    FileExplorer,
    FreeSoundList,
    EditPlayList,
  },
  data() {
    return {

      value: 0,
      listA: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 },
        { name: 'Gerard', id: 3 },
      ],
      listB: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 },
        { name: 'Gerard', id: 3 },
      ],
      songLibrary: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 },
        { name: 'Gerard', id: 3 },
      ],
      duplicateFreesound: false,
    };
  },
  methods: {
    togglePlaylistModal() {
      this.$refs.playlistModal.show();
    },
    updateLibraryFile(value) {
      for (let i = 0; i < this.songLibrary.length; i++) {
        if (this.songLibrary[i].name === value.name) {
          console.log('Duplikat ' + this.songLibrary[i].name);
          return;
        }
      }
      /*buffer kacke*/
      this.songLibrary.push(value);
    },
    updateLibraryFree(value) {
      for (let i = 0; i < this.songLibrary.length; i++) {
        if (this.songLibrary[i].name === value.name) {
          console.log('Duplikat' + this.songLibrary[i].name);
          this.duplicateFreesound = true;
          return;
        }
      }
      this.duplicateFreesound = false;
      this.songLibrary.push(value);
      console.log('kein Duplikat');
    },
    playA() {
      playerA.play();
      console.log('Deck A sollte spielen.');
    },
    pauseA() {
      playerA.pause();
      console.log('Deck A sollte spielen.');
    },
    stopA() {
      playerA.stop();
      console.log('Deck A sollte spielen.');
    },playB() {
      playerB.play();
      console.log('Deck A sollte spielen.');
    },
    pauseB() {
      playerB.pause();
      console.log('Deck A sollte spielen.');
    },
    stopB() {
      playerB.stop();
      console.log('Deck A sollte spielen.');
    },
    print(val){
      console.log(val)
    }
  },
  mounted() {

  },
  beforeMount() {

  }
};
</script>

<style scoped>
.container-fluid {
  max-height: 100vh;
  padding: 1em;
}

.col-auto {
  padding: .5em;
  margin: .2em .8em;

}

.row {
  justify-content: center;
  margin-bottom: 1.5em;
}

h6, h4 {
  margin-bottom: 0.5em;
  text-align: center;
}
</style>
