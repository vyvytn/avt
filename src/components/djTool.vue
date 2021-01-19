<template>
  <div>
    <div v-if="!isClicked">
      <b-spinner v-if="!initReady" type="grow" label="Loading..."></b-spinner>
      <b-button :disabled="!initReady" @click="initialize()" variant="danger">start the dj tool</b-button>
    </div>
    <b-container fluid="">
      <b-row>
        <b-col col>
          <canvas ref="canvasA"  width="346" height="50" style="border-radius: 5px"></canvas>
        </b-col>
        <b-col cols="12" md="auto" width="343 px">
        </b-col>
        <b-col col>
          <canvas ref="canvasB"  width="346" height="50" style="border-radius: 5px"></canvas>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="isClicked" >
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
                <VolumeSlider id="gainLeftDeckSlider" :horizontal="false" :tempo="false" @valueChanged="setVolumeA"></VolumeSlider>
                <h6>L</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="gainMasterSlider" :horizontal="false" :tempo="false" @valueChanged="setMaster"></VolumeSlider>
                <h6>M</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="gainRightDeckSlider" :horizontal="false" :tempo="false" @valueChanged="setVolumeB"></VolumeSlider>
                <h6>R</h6>
              </b-col>
            </b-row>
            <h4>Tempo</h4>
            <b-row>
              <b-col cols="auto">
                <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false" :tempo="true" @valueChanged="setTempoA"></VolumeSlider>
                <h6>L</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="tempoRightDeckSlider" :horizontal="false" :tempo="true" @valueChanged="setTempoB"></VolumeSlider>
                <h6>R</h6>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="auto">
                <h4>Fading</h4>
                <VolumeSlider id="crossfadeSlider" :horizontal="true" :tempo="false" @valueChanged="setCrossfader"></VolumeSlider>
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
import Crossfader from '../logic/Crossfader';

/**
 * Web Audio Api
 * creating audio context and mastergain
 */
const ctx = new AudioContext(); // shared context
const masterGain = ctx.createGain(); // gain shared accross players
masterGain.connect(ctx.destination);
//masterGain.value = 1;

const crossfader = new Crossfader( ctx );
const [ leftOutNode, rightOutNode ] = crossfader.generateOutputNodes( masterGain );

/**create analyzer for player A
 */
const analyzerA= ctx.createAnalyser();
analyzerA.fftSize = 2048;
let bufferLengthA = analyzerA.frequencyBinCount;
let dataArrayA = new Uint8Array(bufferLengthA);
analyzerA.getByteTimeDomainData(dataArrayA);

/**create analyzer for player B
 */
const analyzerB= ctx.createAnalyser();
analyzerB.fftSize = 2048;
let bufferLengthB = analyzerB.frequencyBinCount;
let dataArrayB = new Uint8Array(bufferLengthB);
analyzerB.getByteTimeDomainData(dataArrayB);

/**
 * creating player and playlists for deck a and b
 */
const lib = new MusicLibrary();
const playlistA = new Playlist(lib);
const playerA = new AudioPlayer(ctx, leftOutNode, playlistA);
const playlistB = new Playlist(lib);
const playerB = new AudioPlayer(ctx, rightOutNode, playlistB);
playerA.addNode(analyzerA);
playerB.addNode(analyzerB);

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
      songLibrary: [],
      duplicateFreesound: false,
      currentArtistA: String,
      currentTitleA: String,
      currentArtistB: String,
      currentTitleB: String,
      canvasA: {},
      canvasCtxA: {},
      canvasB: {},
      canvasCtxB: {},
    };
  },
  methods: {
    initialize() {
      this.createPlaylistUI();
      this.insertMetadataA();
      this.insertMetadataB();
      this.isClicked = true;
      //playlistA.list.forEach(el=>  this.playlistUIA.prototype.push(el));

      this.frameLooperA();
      this.frameLooperB();
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
      playerA.addNode(analyzerA);
      this.insertMetadataA();
    },
    prevA() {
      playerA.prev();
      playerA.addNode(analyzerA);
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
      playerB.addNode(analyzerB);
      this.insertMetadataB();
    },
    prevB() {
      playerB.prev();
      playerA.addNode(analyzerB);
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
      playlistB.list.forEach(el => this.listB.push(
        {
          artist: playlistB.musicLibrary.list[el].metaData.artist.toString(),
          title: playlistB.musicLibrary.list[el].metaData.title,
          songId: el
        }),
      );
      lib.list.forEach(el => this.songLibrary.push(
        {
          artist: lib.list[lib.list.indexOf(el)].metaData.artist.toString(),
          title: lib.list[lib.list.indexOf(el)].metaData.title,
          songId: lib.list.indexOf(el)
        }));
    },
    changePlaylistOrder() {
      //deckA
      this.listA.forEach(el => console.log(el.songId));
      playlistA.list.forEach((el, index) => playlistA.list[index] = this.listA[index].songId);
      this.insertMetadataA();
      playlistA.list.forEach(el => console.log(el));

      //deck b
      this.listB.forEach(el => console.log(el.songId));
      playlistB.list.forEach((el, index) => playlistB.list[index] = this.listB[index].songId);
      this.insertMetadataB();
      playlistB.list.forEach(el => console.log(el));
    },
    frameLooperA() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperA) ||
        window.webkitRequestAnimationFrame(this.frameLooperA);
      analyzerA.getByteTimeDomainData(dataArrayA);

      this.canvasCtxA.fillStyle = "rgb(200, 200, 200)";
      this.canvasCtxA.fillRect(0,0,this.canvasA.width, this.canvasA.height);

      this.canvasCtxA.lineWidth = 2;
      this.canvasCtxA.strokeStyle = "rgb(0, 0, 0)";
      this.canvasCtxA.beginPath();

      let sliceWidth = this.canvasA.width * 1.0 / bufferLengthA;
      let x = 0;

      for (let i = 0; i < bufferLengthA; i++){
        let v = dataArrayA[i] / 128.0;
        let y = v * this.canvasA.height / 2;

        if (i == 0){
          this.canvasCtxA.moveTo(x, y);
        } else {
          this.canvasCtxA.lineTo(x, y);
        }

        x+= sliceWidth;
      }

      this.canvasCtxA.lineTo(this.canvasA.width, this.canvasA.height / 2);
      this.canvasCtxA.stroke();
    },
    frameLooperB() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperB) ||
        window.webkitRequestAnimationFrame(this.frameLooperB);
      analyzerB.getByteTimeDomainData(dataArrayB);

      this.canvasCtxB.fillStyle = "rgb(200, 200, 200)";
      this.canvasCtxB.fillRect(0,0,this.canvasB.width, this.canvasB.height);

      this.canvasCtxB.lineWidth = 2;
      this.canvasCtxB.strokeStyle = "rgb(0, 0, 0)";
      this.canvasCtxB.beginPath();

      let sliceWidth = this.canvasB.width * 1.0 / bufferLengthB;
      let x = 0;

      for (let i = 0; i < bufferLengthB; i++){
        let v = dataArrayB[i] / 128.0;
        let y = v * this.canvasB.height / 2;

        if (i == 0){
          this.canvasCtxB.moveTo(x, y);
        } else {
          this.canvasCtxB.lineTo(x, y);
        }

        x+= sliceWidth;
      }

      this.canvasCtxB.lineTo(this.canvasB.width, this.canvasB.height / 2);
      this.canvasCtxB.stroke();
    },
    setVolumeA(value){
      playerA.setVolume(value);
      console.log('Player A Gain: '+ playerA.gain.gain.value)
    },
    setVolumeB(value){
      playerB.setVolume(value)
      console.log('Player B Gain: '+ playerB.gain.gain.value)
    },
    setMaster(value){
      //masterGain.value;
      console.log('Master Gain: '+ masterGain.value)
    },
    setCrossfader(value){
      crossfader.setBalance(value);
      console.log('Crossfader Balance: '+value);
    },
    setTempoA(value){
      playerA.setTempo(value);
      console.log('Player A Tempo: '+ playerA.playingSpeed)

    },
    setTempoB(value){
      playerB.setTempo(value);
      console.log('Player B Tempo: '+ playerB.playingSpeed)
    },

  },
  mounted() {
    //this.insertMetadata(playerA.current.metaData.artist.toString(), playerA.current.metaData.title.toString());
    this.handleInitButton();
    this.canvasA = this.$refs['canvasA'];
    this.canvasCtxA = this.$refs['canvasA'].getContext('2d');
    this.canvasB = this.$refs['canvasB'];
    this.canvasCtxB = this.$refs['canvasB'].getContext('2d');
  },
  props: {
    /*initialized: Boolean,*/
  },
  /*computed: {
    listA: function () {
      this.listA.prototype.forEach(el => el.artist === playlistA.musicLibrary.list[playlistA.list[el.index]].metaData.artist);
    },
  }*/
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
