<template>
  <div>
    <div v-if="!isClicked">
      <b-spinner v-if="!initReady" type="grow" label="Loading..."></b-spinner>
      <b-button :disabled="!initReady" @click="initialize()" variant="danger">start the dj tool</b-button>
    </div>
    <div v-if="isClicked">
      <b-container fluid="">
        <b-row>
          <b-col col>
            <deck @openLibraryClicked="togglePlaylistModal"
                  id="deckA" :array-playlist="listA"
                  @play="playA"
                  @pause="pauseA"
                  @stop="stopA"
                  @next="nextA"
                  @prev="prevA"
                  :artist.sync="currentArtistA"
                  :title.sync="currentTitleA"
                  @playlistChanged="changePlaylistOrder"
            ></deck>
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
            <deck @openLibraryClicked="togglePlaylistModal"
                  id="deckB"
                  :array-playlist="listB"
                  @play="playB"
                  @pause="pauseB"
                  @stop="stopB"
                  @next="nextB"
                  @prev="prevB"
                  :artist.sync="currentArtistB"
                  :title.sync="currentTitleB"
                  @playlistChanged="changePlaylistOrder"
            >
            </deck>
          </b-col>
        </b-row>

        <!--MENU FOR PLAYLIST EDITING BEGIN-->
        <b-modal ref="playlistModal" title="Playlist bearbeiten">
          <b-tabs pills card fill>
            <b-tab title="Bibliothek" active>
              <b-card-text>
                <edit-play-list
                  :play-list-array-a="listA"
                  :play-list-array-b="listB"
                  :song-library="songLibrary"
                  @playlistChanged="changePlaylistOrder"
                ></edit-play-list>
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
    </div>
  </div>

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
  })
  .then(() => axios.get('http://localhost:8080/static/Black Muffin - Die and Retry.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const bm = new Song(new MP3(res.data));
    await bm.prepareForPlayback(ctx);
    playlistA.add(lib.insert(bm));
    playlistB.add(lib.insert(bm));
  })
  .then(() => axios.get('http://localhost:8080/static/Bosshafte Beats - Sunglass Evo.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const m = new Song(new MP3(res.data));
    await m.prepareForPlayback(ctx);
    playlistA.add(lib.insert(m));
    playlistB.add(lib.insert(m));
  });

export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck,
    FileExplorer,
    FreeSoundList,
    EditPlayList,
    counter: 0
  },
  data() {
    return {
      isClicked: false,
      initReady: false,
      value: 0,
      listA: [],
      listB: [],
      songLibrary: [
      ],
      duplicateFreesound: false,
      currentArtistA: String,
      currentTitleA: String,
      currentArtistB: String,
      currentTitleB: String,
    };
  },
  methods: {
    initialize() {
      this.createPlaylistUI();
      this.insertMetadataA();
      this.insertMetadataB();
      this.isClicked = true;
      //playlistA.list.forEach(el=>  this.playlistUIA.prototype.push(el));
    },
    handleInitButton() {
      setTimeout(this.disableButton, 4000);
    },
    disableButton() {
      this.initReady = true;
    },
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
      console.log('Deck A sollte pausieren.');
    },
    stopA() {
      playerA.stop();
      console.log('Deck A sollte stoppen.');
    },
    nextA() {
      playerA.next();
      this.insertMetadataA();
    },
    prevA() {
      playerA.prev();
      this.insertMetadataA();
    },
    playB() {
      playerB.play();
      console.log('Deck B sollte spielen.');
    },
    pauseB() {
      playerB.pause();
      console.log('Deck B sollte pausieren.');
    },
    stopB() {
      playerB.stop();
      console.log('Deck B sollte stoppen.');
    },
    nextB() {
      playerB.next();
      this.insertMetadataB();
    },
    prevB() {
      playerB.prev();
      this.insertMetadataB();
    },
    printTest(val) {
      console.log('test print ' + val);
    },
    insertMetadataA() {
      var artist = playerA.current.metaData.artist.toString();
      var title = playerA.current.metaData.title.toString();
      this.currentArtistA = artist;
      this.currentTitleA = title;
    },
    insertMetadataB() {
      var artist = playerB.current.metaData.artist.toString();
      var title = playerB.current.metaData.title.toString();
      this.currentArtistB = artist;
      this.currentTitleB = title;
    },
    createPlaylistUI() {
      //playlistA.list.forEach(el=>console.log(playlistA.musicLibrary.list[el].metaData.artist));
      playlistA.list.forEach(el => this.listA.push(
        {
          artist: playlistA.musicLibrary.list[el].metaData.artist.toString(),
          title: playlistA.musicLibrary.list[el].metaData.title,
          songId: el
        }));
      playlistB.list.forEach(el =>this.listB.push(
          {
            artist: playlistB.musicLibrary.list[el].metaData.artist.toString(),
            title: playlistB.musicLibrary.list[el].metaData.title,
            songId: el
          }),
      );
      lib.list.forEach(el=> this.songLibrary.push(
        {
          artist: lib.list[lib.list.indexOf(el)].metaData.artist.toString(),
          title:  lib.list[lib.list.indexOf(el)].metaData.title,
          songId: lib.list.indexOf(el)
        }))
    },
    changePlaylistOrder(){
      //deckA
      this.listA.forEach(el=>console.log(el.songId));
      playlistA.list.forEach((el, index) => playlistA.list[index] =this.listA[index].songId );
      this.insertMetadataA();
      playlistA.list.forEach(el=> console.log(el));

      //deck b
      this.listB.forEach(el=>console.log(el.songId));
      playlistB.list.forEach((el, index) => playlistB.list[index] =this.listB[index].songId );
      this.insertMetadataB();
      playlistB.list.forEach(el=> console.log(el))
    }

  },
  mounted() {
    //this.insertMetadata(playerA.current.metaData.artist.toString(), playerA.current.metaData.title.toString());
    this.handleInitButton();
  },
  props: {
    initialize: Boolean,
  },
  /*computed: {
    listA: function () {
      this.listA.prototype.forEach(el => el.artist === playlistA.musicLibrary.list[playlistA.list[el.index]].metaData.artist);
    },
  }*/
}
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
