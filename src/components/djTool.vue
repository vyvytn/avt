<template>
  <div>
    <b-container id="loading-state" fluid="" v-if="!isClicked">
      <b-row>
        <h1 class="text-light">Welcome to our DJ App with Freesound.org API</h1>
      </b-row>
      <b-row>
        <p class="h1">
          <b-icon icon="music-note-beamed" style="color: white;"></b-icon>
        </p>
      </b-row>
      <b-row>
        <b-button :disabled="!initReady" @click="initialize()" variant="outline-light">
          <b-spinner small v-if="!initReady" label="Loading...">
          </b-spinner>
          <b>LET'S BEGIN</b>
        </b-button>
      </b-row>
    </b-container>
    <b-container id="dj-app" fluid="" v-if="isClicked">
      <b-row>
        <b-col col>
          <div class="p-2 mb-3 shadow-sm rounded-lg border-0"
               style="background: linear-gradient(135deg, #84e8ca, #b9efe0);">
            <h4 class="text-light" style="text-align: center;">DECK A</h4>
            <vue-slider
              :max="510"
              v-model="timeA"
              :interval="10"
              :hide-label=true
              :tooltip-placement="'bottom'"
              direction="ltr"
              :contained=true
              :drag-on-click=true
              style="display: block; width: 98%;"
              @change="setSeekA(timeA)"></vue-slider>
            <canvas ref="canvasA" class="rounded" style="width: 100%; max-height: 50px"></canvas>
          </div>
          <deck @openLibraryClicked="togglePlaylistModal"
                id="deckA"
                :array-playlist="listA"
                @play="playA"
                @pause="pauseA"
                @stop="stopA"
                @next="nextA"
                @prev="prevA"
                :artist.sync="currentArtistA"
                :title.sync="currentTitleA"
                :songId.sync="currentIdA"
                :length.sync="lengthA"
                @playlistChanged="changePlaylistOrder('A')"
                @changeEqDeck="setEqA"
                @toggleFX="setFXA"
          ></deck>
        </b-col>
        <b-col cols="12" md="auto">
          <h4 class="text-light">Volume</h4>
          <b-row>
            <b-col cols="auto">
              <VolumeSlider id="gainLeftDeckSlider" :horizontal="false" :tempo="false"
                            @valueChanged="setVolumeA"></VolumeSlider>
              <h5 class="text-dark">L</h5>
            </b-col>
            <b-col cols="auto">
              <VolumeSlider id="gainMasterSlider" :horizontal="false" :tempo="false"
                            @valueChanged="setMaster"></VolumeSlider>
              <h5 class="text-dark">M</h5>
            </b-col>
            <b-col cols="auto">
              <VolumeSlider id="gainRightDeckSlider" :horizontal="false" :tempo="false"
                            @valueChanged="setVolumeB"></VolumeSlider>
              <h5 class="text-dark">R</h5>
            </b-col>
          </b-row>
          <h4 class="text-light">Tempo</h4>
          <b-row>
            <b-col cols="auto">
              <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false" :tempo="true"
                            @valueChanged="setTempoA" :value3="defaultTempoA"></VolumeSlider>
              <h5 class="text-dark">L</h5>
            </b-col>
            <b-col cols="auto">
              <VolumeSlider id="tempoRightDeckSlider" :horizontal="false" :tempo="true"
                            @valueChanged="setTempoB" :value3="defaultTempoB"></VolumeSlider>
              <h5 class="text-dark">R</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="auto">
              <h4 class="text-light">Fading</h4>
              <VolumeSlider id="crossfadeSlider" :horizontal="true" :tempo="false"
                            @valueChanged="setCrossfader"></VolumeSlider>
            </b-col>
          </b-row>
        </b-col>
        <b-col col class="justify-content-center">
          <div class="p-2 mb-3 shadow-sm rounded-lg border-0"
               style="background:linear-gradient(135deg, #a498ee, #bbb1f8);">
            <h4 class="text-light" style="text-align: center ">DECK B</h4>
            <vue-slider
              :max="510"
              v-model="timeB"
              :interval="10"
              :hide-label=true
              :tooltip-placement="'bottom'"
              direction="ltr"
              :contained=true
              :drag-on-click=true
              style="display: block; width: 98%;"
              @change="setSeekB(timeB)"></vue-slider>
            <canvas ref="canvasB" class="rounded" style="width: 100%; max-height: 50px"></canvas>
          </div>
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
                :songId.sync="currentIdB"
                :length.sync="lengthB"
                @playlistChanged="changePlaylistOrder('B')"
                @changeEqDeck="setEqB"
                @toggleFX="setFXB"
          >
          </deck>
        </b-col>
      </b-row>

      <!--MENU FOR PLAYLIST EDITING BEGIN-->
      <b-modal ok-only scrollable ref="playlistModal" title="PLAYLIST BEARBEITEN" size="lg">
        <b-tabs pills fill v-model="tabIndex">
          <b-tab title="Bibliothek" class="mt-4" :title-link-class="linkClass(0)">
            <b-card-text>
              <edit-play-list
                :play-list-array-a="listA"
                :play-list-array-b="listB"
                :song-library="songLibrary"
                @playlistChanged="changePlaylistOrder"
                @deleteFromPlaylistA="deleteSongFromDeckById ('A', value)"
                @deleteFromPlaylistB="deleteSongFromDeckById('B', value)"
              ></edit-play-list>
            </b-card-text>
          </b-tab>
          <b-tab title="Mp3 Hochladen" class="mt-4" :title-link-class="linkClass(1)">
            <b-card-text>
              <FileExplorer @upload="updateLibraryFile"></FileExplorer>
            </b-card-text>
          </b-tab>
          <b-tab title="Freesound Suche" class="mt-4" :title-link-class="linkClass(2)">
            <FreeSoundList :uploadSuccess="uploadFinished" @upload="handleFreesound"
                           :duplicate="duplicateFreesound"></FreeSoundList>
          </b-tab>
        </b-tabs>
      </b-modal>
      <!--MENU FOR PLAYLIST EDITING END-->
    </b-container>
  </div>

</template>

<script>

import deck from './deck';
import VolumeSlider from './VolumeSlider';
import FreeSoundList from './FreeSoundList';
import FileExplorer from './FileExplorer';
import EditPlayList from './EditPlayList';
import AudioPlayer from '../logic/AudioPlayer';
import Playlist from '../logic/Playlist';
import MusicLibrary from '../logic/MusicLibrary';
import MP3 from '../logic/MP3';
import Song from '../logic/Song';
import axios from 'axios';
import Crossfader from '../logic/Crossfader';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

const serverConnection = 'https://dj-api.jneidel.com';

/**
 * Web Audio Api
 * creating audio context and mastergain
 */
const ctx = new AudioContext(); // shared context
const masterGain = ctx.createGain(); // gain shared accross players
masterGain.connect(ctx.destination);
masterGain.gain.value = 0.5;

const crossfader = new Crossfader(ctx);
const [leftOutNode, rightOutNode] = crossfader.generateOutputNodes(masterGain);

/**create analyzer for player A
 */
const analyzerA = ctx.createAnalyser();
analyzerA.fftSize = 256;
let bufferLengthA = analyzerA.frequencyBinCount;
let dataArrayA = new Uint8Array(bufferLengthA);
analyzerA.getByteTimeDomainData(dataArrayA);

/**create analyzer for player B
 */
const analyzerB = ctx.createAnalyser();
analyzerB.fftSize = 256;
let bufferLengthB = analyzerB.frequencyBinCount;
let dataArrayB = new Uint8Array(bufferLengthB);
analyzerB.getByteTimeDomainData(dataArrayB);

analyzerA.connect(leftOutNode);
analyzerB.connect(rightOutNode);

/**
 * creating player and playlists for deck a and b
 */
const lib = new MusicLibrary();
const playlistA = new Playlist(lib);
const playerA = new AudioPlayer(ctx, analyzerA, playlistA);
const playlistB = new Playlist(lib);
const playerB = new AudioPlayer(ctx, analyzerB, playlistB);

/**
 * get song and connect to mastergain
 */
let songUrl = serverConnection + '/static/example.mp3';
axios.get(songUrl, { responseType: 'arraybuffer' })
  .then(async res => {
    const bb = new Song(new MP3(res.data));
    await bb.prepareForPlayback(ctx);
    let index = lib.insert(bb);
    playlistA.add(index);
    playlistB.add(index);
  })
  .then(() => axios.get(serverConnection + '/static/Black Muffin - Die and Retry.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const bm = new Song(new MP3(res.data));
    await bm.prepareForPlayback(ctx);
    let index = lib.insert(bm);
    playlistA.add(index);
    playlistB.add(index);
  })
  .then(() => axios.get(serverConnection + '/static/Bosshafte Beats - Sunglass Evo.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const m = new Song(new MP3(res.data));
    await m.prepareForPlayback(ctx);
    let index = lib.insert(m);
    playlistA.add(index);
    playlistB.add(index);
  });

export default {
  name: 'djtool',
  components: {
    VolumeSlider,
    deck,
    FileExplorer,
    FreeSoundList,
    EditPlayList,
    VueSlider,
    counter: 0
  },
  data() {
    return {
      tabIndex: 0,
      isClicked: false,
      initReady: false,
      value: 0,
      listA: [],
      listB: [],
      songLibrary: [],
      duplicateFreesound: false,
      currentArtistA: String,
      currentTitleA: String,
      lengthA: '',
      lengthB: '',
      currentArtistB: String,
      currentTitleB: String,
      currentIdA: Number,
      currentIdB: Number,
      canvasA: {},
      canvasCtxA: {},
      canvasB: {},
      canvasCtxB: {},
      playingA: Boolean,
      pausingA: Boolean,
      playingB: Boolean,
      pausingB: Boolean,
      mutedA: false,
      mutedStringA: String,
      mutedB: false,
      mutedStringB: String,
      currentVolumeA: Number,
      timeA: playerA.currentPosition(),
      timeB: playerB.currentPosition(),
      /*timerA: null,
      timerB: null,
      durationA: 0,
      durationB: 0,
      pausedTimerA: true,
      pausedTimerB: true,
      speedA: 1000,
      speedB: 1000,*/
      defaultTempoA: 1,
      defaultTempoB: 1,
      uploadFinished: true,
      timeIDA: null,
      timeIDB: null,
    };
  },
  methods: {
    initialize() {
      this.createPlaylistUI();
      this.insertMetadataA();
      this.insertMetadataB();
      this.isClicked = true;
      this.playingA = false;
      this.pausingA = false;
      this.playingB = false;
      this.pausingB = false;
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

    /**
     * add own mp3 to library
     * add buffer to audiocontext
     * */
    updateLibraryFile(value) {
      let newSong = null;
      value.arrayBuffer()
        .then(res => {
            newSong = new Song(new MP3(res));
            newSong.prepareForPlayback(ctx);
            let newSongIndex = lib.insert(newSong);
            if (lib.list[newSongIndex].metaData !== null) {
              this.songLibrary.push(
                {
                  artist: lib.list[newSongIndex].metaData.artist.toString(),
                  title: lib.list[newSongIndex].metaData.title,
                  songId: newSongIndex
                });
            } else {
              this.songLibrary.push(
                {
                  artist: 'unknown',
                  title: value.name,
                  songId: newSongIndex
                });
            }
          }
        );
    },
    /**
     * add chosen song from freesound to audiocontex context
     * */
    async handleFreesound(value) {
      this.uploadFinished = false;
      await value.prepareForPlayback(ctx);
      let newSongIdx = lib.insert(value);
      if (lib.list[newSongIdx].metaData !== null) {
        this.songLibrary.push(
          {
            artist: lib.list[newSongIdx].metaData.artist.toString(),
            title: lib.list[newSongIdx].metaData.title,
            songId: newSongIdx
          });
      } else {
        this.songLibrary.push(
          {
            artist: 'unknown',
            title: value.name,
            songId: newSongIdx
          });
      }
      this.uploadFinished = true;
    },
    showTimeA() {
      this.timeIDA = window.setTimeout(this.getCurrentTimeA, 100);
    },
    getCurrentTimeA() {
      let totalLeft = Math.round(lib.list[playlistA.list[this.currentIdA]].metaData.length.total - playerA.currentPosition());
      let min = Math.floor(totalLeft / 60);
      let sec = totalLeft - (min * 60);

      this.lengthA = min.toString() + ':' + sec.toString();
      this.showTimeA();

    },
    stopTimerA() {
      clearTimeout(this.timeIDA);
      this.lengthA = '0:0';
    },
    showTimeB() {
      this.timeIDB = window.setTimeout(this.getCurrentTimeB, 100);
    },
    getCurrentTimeB() {
      let totalLeft = Math.round(lib.list[playlistB.list[this.currentIdB]].metaData.length.total - playerB.currentPosition());
      let min = Math.floor(totalLeft / 60);
      let sec = totalLeft - (min * 60);
      this.lengthB = min.toString() + ':' + sec.toString();
      this.showTimeB();
    },
    stopTimerB() {
      clearTimeout(this.timeIDB);
      this.lengthB = '0:0';
    },
    /**
     * play pause stop previous next song functions for player A and B
     **/
    playA() {
      this.canvasA = this.$refs['canvasA'];
      this.canvasCtxA = this.$refs['canvasA'].getContext('2d');
      this.showTimeA();
      this.frameLooperA();
      this.playingA = true;
      this.pausingA = false;
      playerA.play();
      this.insertMetadataA();
    },
    pauseA() {
      this.playingA = false;
      this.pausingA = true;
      playerA.pause();
    },
    stopA() {
      this.playingA = false;
      this.pausingA = false;
      playerA.stop();
      this.stopTimerA();
      this.insertMetadataA();
    },
    nextA() {
      playerA.next();
      this.insertMetadataA();
      this.playA();
    },
    prevA() {
      playerA.prev();
      this.insertMetadataA();
      this.playA();
    },
    playB() {
      this.canvasB = this.$refs['canvasB'];
      this.canvasCtxB = this.$refs['canvasB'].getContext('2d');
      this.frameLooperB();
      this.showTimeB();
      this.playingB = true;
      this.pausingB = false;
      playerB.play();
      this.insertMetadataB();
    },
    pauseB() {
      this.playingB = false;
      this.pausingB = true;
      playerB.pause();
    },
    stopB() {
      this.playingB = false;
      this.pausingB = false;
      playerB.stop();
      this.stopTimerB();
      this.insertMetadataB();
    },
    nextB() {
      playerB.next();
      this.insertMetadataB();
      this.playB();
    },
    prevB() {
      playerB.prev();
      this.insertMetadataB();
      this.playB();
    },
    getCurrentIdA() {
      this.currentIdA = playerA.currentIndex;
    },
    getCurrentIdB() {
      this.currentIdB = playerB.currentIndex;
    },
    /**
     * refreshes shown metadata of a song
     */
    insertMetadataA() {
      let artist = playerA.current.metaData.artist;
      let title = playerA.current.metaData.title;
      let total = playerA.current.metaData.length.total;
      let minutes = Math.floor(total / 60)
        .toString();
      let seconds = Math.round(total - minutes * 60)
        .toString();
      this.currentArtistA = artist;
      this.currentTitleA = title;
      this.lengthA = minutes + ':' + seconds;
      this.getCurrentIdA();
    },
    insertMetadataB() {
      let artist = playerB.current.metaData.artist;
      let title = playerB.current.metaData.title;
      let total = playerB.current.metaData.length.total;
      let minutes = Math.floor(total / 60)
        .toString();
      let seconds = Math.round(total - minutes * 60)
        .toString();
      this.currentArtistB = artist;
      this.currentTitleB = title;
      this.lengthB = minutes + ':' + seconds;
      this.getCurrentIdB();
    },
    createPlaylistUI() {
      playlistA.list.forEach(el => this.listA.push(
        {
          artist: playlistA.musicLibrary.list[el].metaData.artist.toString(),
          title: playlistA.musicLibrary.list[el].metaData.title,
          length: playlistA.musicLibrary.list[el].metaData.length.total,
          songId: el
        }));
      playlistB.list.forEach(el => this.listB.push(
        {
          artist: playlistB.musicLibrary.list[el].metaData.artist.toString(),
          title: playlistB.musicLibrary.list[el].metaData.title,
          length: playlistB.musicLibrary.list[el].metaData.length.total,
          songId: el
        }),
      );
      lib.list.forEach(el => this.songLibrary.push(
        {
          artist: lib.list[lib.list.indexOf(el)].metaData.artist.toString(),
          title: lib.list[lib.list.indexOf(el)].metaData.title,
          length: lib.list[lib.list.indexOf(el)].metaData.length.total,
          songId: lib.list.indexOf(el)
        }));
    },
    refreshPlaylistA() {
      this.listA.forEach((el, index) => playlistA.list[index] = this.listA[index].songId);
      this.getCurrentIdA();
      if (this.playingA) {
        if (playlistA.musicLibrary.list[playerA.currentIndex].metaData.artist !== this.listA[this.currentIdA].artist) {
          this.playA();
        }
      } else {
        playerA.stop();
      }
    },
    refreshPlaylistB() {
      this.listB.forEach((el, index) => playlistB.list[index] = this.listB[index].songId);
      this.getCurrentIdB();
      if (this.playingB) {
        if (playlistB.musicLibrary.list[playerB.currentIndex].metaData.artist !== this.listB[this.currentIdB].artist) {
          this.playB();
        }
      } else {
        playerB.stop();
      }
    },
    changePlaylistOrder(deck) {
      if (deck === 'A') {
        this.refreshPlaylistA();
      } else if (deck === 'B') {
        this.refreshPlaylistB();
      } else {
        this.refreshPlaylistA();
        this.refreshPlaylistB();
      }
    },
    /**
     * delete song from certain playlist
     */
    deleteSongFromDeckById(deck, sId) {
      if (deck === 'A') {
        if (playlistA.list.length < 2) {
          playlistA.delete(sId);
          this.currentArtistA = 'no artist';
          this.currentTitleA = 'no title';
          this.lengthA = 'unknown';
          this.pauseA();
          this.stopA();
        } else {
          playlistA.delete(sId);
          this.refreshPlaylistA();
          this.insertMetadataA();
        }
      } else if (deck === 'B') {
        if (playlistB.list.length < 2) {
          playlistB.delete(sId);
          this.currentArtistB = 'no artist';
          this.currentTitleB = 'no title';
          this.lengthB = 'unknown';
          this.pauseB();
          this.stopB();
        } else {
          playlistB.delete(sId);
          this.refreshPlaylistB();
          this.insertMetadataB();
        }
      }
    },
    /**
     * for visualizing the sound in player A
     */
    frameLooperA() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperA) ||
        window.webkitRequestAnimationFrame(this.frameLooperA);
      analyzerA.getByteTimeDomainData(dataArrayA);
      this.canvasCtxA.clearRect(0, 0, this.canvasA.width, this.canvasA.height);

      let barWidth = (this.canvasA.width / bufferLengthA) * 4;
      let barHeight;
      let x = 0;

      this.canvasCtxA.fillStyle = 'rgb(185,240,225)';
      this.canvasCtxA.fillRect(0, 0, this.canvasA.width, this.canvasA.height);

      for (let i = 0; i < bufferLengthA; i++) {
        barHeight = (dataArrayA[i] / 2);

        this.canvasCtxA.fillStyle = 'rgb(155,210,' + Math.floor(barHeight + 125) + ')';
        this.canvasCtxA.fillRect(x, this.canvasA.height - barHeight, barWidth, barHeight);

        x += barWidth + 3; // Gives 1px space between each bar
      }
    },
    /**
     * visualizing sound for deck B
     */
    frameLooperB() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperB) ||
        window.webkitRequestAnimationFrame(this.frameLooperB);
      analyzerB.getByteTimeDomainData(dataArrayB);

      let barWidth = (this.canvasB.width / bufferLengthB) * 4;
      let barHeight;
      let x = 0;

      this.canvasCtxB.fillStyle = 'rgb(185,175,245)';
      this.canvasCtxB.fillRect(0, 0, this.canvasB.width, this.canvasB.height);

      for (let i = 0; i < bufferLengthB; i++) {
        barHeight = Math.floor(dataArrayB[i] / 2);

        this.canvasCtxB.fillStyle = 'rgb(150,140,' + (barHeight + 165) + ')';
        this.canvasCtxB.fillRect(x, this.canvasB.height - barHeight, barWidth, barHeight);

        x += barWidth + 3; // Gives 1px space between each bar
      }
    },
    /**
     * for manipulating Gain in player A and B
     */
    setVolumeA(value) {
      playerA.setVolume(value);
    },
    setVolumeB(value) {
      playerB.setVolume(value);
    },
    setMaster(value) {
      masterGain.gain.value = value;
    },
    /**
     * set non-linear Crossfader
     */
    setCrossfader(value) {
      crossfader.setBalance(value);
    },
    /**
     * set Tempo in player A and B
     */
    setTempoA(value) {
      this.speedA = -500 * value + 1500;
      playerA.setTempo(value);

    },
    setTempoB(value) {
      playerB.setTempo(value);
    },
    /**
     * seek a song at a certain point
     */
    setSeekA(time) {
      playerA.seek(time);
    },
    setSeekB(time) {
      playerB.seek(time);
    },
    /**
     * sets the equalizer of a certain frequency and Q value
     */
    setEqA(index, value) {
      playerA.setEq(index, value);
    },
    setEqB(index, value) {
      playerB.setEq(index, value);
    },
    /**
     * toogle an effect
     */
    setFXA(name) {
      playerA.effects.toggle(name);
    },
    setFXB(name) {
      playerB.effects.toggle(name);
    },
    initCanvas() {
      this.canvasA = this.$refs['canvasA'];
      this.canvasCtxA = this.$refs['canvasA'].getContext('2d');
      this.canvasB = this.$refs['canvasB'];
      this.canvasCtxB = this.$refs['canvasB'].getContext('2d');

      this.canvasCtxA.clearRect(0, 0, this.canvasA.width, this.canvasA.height);
      this.canvasCtxB.clearRect(0, 0, this.canvasB.width, this.canvasB.height);
    },
    /**
     * style Tab Buttons
     */
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-secondary', 'text-light', 'm-2'];
      } else {
        return ['bg-light', 'text-dark', 'm-2'];
      }
    },
  },
  mounted() {
    this.handleInitButton();
    this.playingA = false;
    this.playingB = false;
    this.mutedStringA = 'not muted';
    this.mutedStringB = 'not muted';
  },
  computed: {},
  watch: {
    // whenever question changes, this function will run
    currentIdA: function () {
      this.insertMetadataA();
    },
    currentIdB: function () {
      this.insertMetadataB();
    },
    speed: function () {
      // this.resumeTimerA();
      // this.resumeTimerB();
    },
  },
};
</script>

<style scoped>
#loading-state {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #84e8ca, #a498ee);
}

#dj-app {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, rgba(170, 239, 216, 0.8), rgba(179, 168, 236, 0.8));
}

.container-fluid {
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

h1 {
  margin-top: 5em;
  color: whitesmoke;
}

h6, h4 {
  margin-bottom: 0.5em;
  text-align: center;
}
</style>
