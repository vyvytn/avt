<template>
  <div>
    <div v-if="!isClicked">
      <b-spinner v-if="!initReady" type="grow" label="Loading..."></b-spinner>
      <b-button :disabled="!initReady" @click="initialize()" variant="danger">start the dj tool</b-button>
    </div>
    <b-container fluid="">
      <b-row>
        <b-col col>
          <canvas ref="canvasA" width="346" height="50" style="border-radius: 5px"></canvas>
        </b-col>
        <b-col cols="12" md="auto" width="343 px">
        </b-col>
        <b-col col>
          <canvas ref="canvasB" width="346" height="50" style="border-radius: 5px"></canvas>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="isClicked">
      <b-container fluid="">
        <b-row>
          <b-col col>
            <vue-slider
              :max="timeA"
              v-model="timeA"
              :hide-label=true
              :tooltip=" 'none' "
              direction="ltr"
              :contained=true
              :drag-on-click=true
              style="display: block; width: 18em;"
              @change="setSeekA(timeA)"></vue-slider>
            <!--            <b-form-checkbox-->
            <!--              v-model="mutedA"-->
            <!--              name="check-button"-->
            <!--              switch-->
            <!--            >{{ mutedStringA }}-->
            <!--            </b-form-checkbox>-->
            <!--            <p>{{ minA }}:{{ secA }}</p>-->
            <P id="timeLeftA"></P>
            <deck @openLibraryClicked="togglePlaylistModal"
                  id="deckA" :array-playlist="listA"
                  @play="playA"
                  @pause="pauseA"
                  @stop="stopA"
                  @next="nextA"
                  @prev="prevA"
                  :artist.sync="currentArtistA"
                  :title.sync="currentTitleA"
                  :songId.sync="currentIdA"
                  @playlistChanged="changePlaylistOrder('A')"
                  @changeEqDeck="setEqA"
            ></deck>
          </b-col>
          <b-col cols="12" md="auto">
            <h4>Volume</h4>
            <b-row>
              <b-col cols="auto">
                <VolumeSlider id="gainLeftDeckSlider" :horizontal="false" :tempo="false"
                              @valueChanged="setVolumeA"></VolumeSlider>
                <h6>L</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="gainMasterSlider" :horizontal="false" :tempo="false"
                              @valueChanged="setMaster"></VolumeSlider>
                <h6>M</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="gainRightDeckSlider" :horizontal="false" :tempo="false"
                              @valueChanged="setVolumeB"></VolumeSlider>
                <h6>R</h6>
              </b-col>
            </b-row>
            <h4>Tempo</h4>
            <b-row>
              <b-col cols="auto">
                <VolumeSlider id="tempoLeftDeckSlider" :horizontal="false" :tempo="true"
                              @valueChanged="setTempoA" :value3="defaultTempoA"></VolumeSlider>
                <h6>L</h6>
              </b-col>
              <b-col cols="auto">
                <VolumeSlider id="tempoRightDeckSlider" :horizontal="false" :tempo="true"
                              @valueChanged="setTempoB" :value3="defaultTempoB"></VolumeSlider>
                <h6>R</h6>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="auto">
                <h4>Fading</h4>
                <VolumeSlider id="crossfadeSlider" :horizontal="true" :tempo="false"
                              @valueChanged="setCrossfader"></VolumeSlider>
              </b-col>
            </b-row>
          </b-col>
          <b-col col>
            <vue-slider
              :max="100"
              v-model="timeB"
              :interval="10"
              :hide-label=true
              :tooltip=" 'none' "
              direction="ltr"
              :contained=true
              :drag-on-click=true
              style="display: block; width: 18em;"
              @change="setSeekB(timeB)"></vue-slider>
            <!--            <b-form-checkbox-->
            <!--              v-model="mutedB"-->
            <!--              name="check-button"-->
            <!--              switch-->
            <!--            >{{ mutedStringB }}-->
            <!--            </b-form-checkbox>-->
            <!--            <p>{{ minB }}:{{ secB }}</p>-->
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
                  @playlistChanged="changePlaylistOrder('B')"
                  :playing="this.playingB"
                  :pausing.sync="this.pausingB"
                  @changeEqDeck="setEqB"
            >
            </deck>
          </b-col>
        </b-row>

        <!--MENU FOR PLAYLIST EDITING BEGIN-->
        <b-modal ok-only scrollable ref="playlistModal" title="Playlist bearbeiten" size="lg">
          <b-tabs pills card fill>
            <b-tab title="Bibliothek" active>
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
            <b-tab title="Musik importieren">
              <b-card-text>
                <FileExplorer @upload="updateLibraryFile"></FileExplorer>
              </b-card-text>
            </b-tab>
            <b-tab title="Freesound">
              <FreeSoundList @update="updateLibraryFree" @upload="handleFreesound"
                             :duplicate="duplicateFreesound"></FreeSoundList>
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
import VueSlider from 'vue-slider-component';
import { search } from '../logic/Freesound';

/**
 * Web Audio Api
 * creating audio context and mastergain
 */
const ctx = new AudioContext(); // shared context
const masterGain = ctx.createGain(); // gain shared accross players
masterGain.connect(ctx.destination);
masterGain.gain.value = 1;

const crossfader = new Crossfader(ctx);
const [leftOutNode, rightOutNode] = crossfader.generateOutputNodes(masterGain);

/**create analyzer for player A
 */
const analyzerA = ctx.createAnalyser();
analyzerA.fftSize = 2048;
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

/**
 * creating player and playlists for deck a and b
 */
const lib = new MusicLibrary();
const playlistA = new Playlist(lib);
const playerA = new AudioPlayer(ctx, leftOutNode, playlistA);
const playlistB = new Playlist(lib);
const playerB = new AudioPlayer(ctx, rightOutNode, playlistB);
/**
 * get song and connect to mastergain
 */
let songUrl = 'http://localhost:8080/static/example.mp3';
axios.get(songUrl, { responseType: 'arraybuffer' })
  .then(async res => {
    const bb = new Song(new MP3(res.data));
    await bb.prepareForPlayback(ctx);
    let index = lib.insert(bb);
    playlistA.add(index);
    playlistA.add(index);
    playlistA.add(index);
    playlistB.add(index);
  })
  .then(() => axios.get('http://localhost:8080/static/Black Muffin - Die and Retry.mp3', { responseType: 'arraybuffer' }))
  .then(async res => {
    const bm = new Song(new MP3(res.data));
    await bm.prepareForPlayback(ctx);
    let index = lib.insert(bm);
    playlistA.add(index);
    playlistA.add(index);
    playlistB.add(index);
  })
  .then(() => axios.get('http://localhost:8080/static/Bosshafte Beats - Sunglass Evo.mp3', { responseType: 'arraybuffer' }))
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
      minA: 0,
      secA: 0,
      minB: 0,
      secB: 0,
      timeA: playerA.currentPosition(),
      timeB: playerB.currentPosition(),
      timerA: null,
      durationA: 0,
      pausedTimerA: true,
      speed: 1000,
      defaultTempoA: 1,
      defaultTempoB: 1

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
      this.playingA = false;
      this.pausingA = false;
      this.playingB = false;
      this.pausingB = false;
      this.$nextTick(function () {
        document.getElementById('timeLeftA').innerHTML = Math.round(lib.list[this.listA[this.currentIdA].songId].metaData.length.total)
          .toString();
      });
      this.canvasCtxB.fillRect(0, 0, this.canvasB.width, this.canvasB.height);
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
      // for (let i = 0; i < this.songLibrary.length; i++) {
      //   if (this.songLibrary[i].name === value.name) {
      //     console.log('Duplikat ' + this.songLibrary[i].name);
      //     return;
      //   }
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
            console.log(lib.list[newSongIndex]);
          }
        );
    },
    updateLibraryFree(value) {/*
      for (let i = 0; i < this.songLibrary.length; i++) {
        if (this.songLibrary[i].name === value.name) {
          console.log('Duplikat' + this.songLibrary[i].name);
          this.duplicateFreesound = true;
          return;
        }
        ;
      }*/
      this.duplicateFreesound = false;
      this.songLibrary.push(value);
      console.log('kein Duplikat');
    },
    handleFreesound(value) {
      value.prepareForPlayback(ctx);
      let newSongIdx = lib.insert(value);
      console.log(lib.list[newSongIdx].metaData.artist);
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


    },
    startTimer() {
      this.durationA = Math.round(lib.list[this.listA[this.currentIdA].songId].metaData.length.total);
      this.timerA = setInterval(this.timer, this.speed);
    },
    resumeTimer() {
      clearInterval(this.timerA);
      this.timerA = setInterval(this.timer, this.speed);
    },
    timer() {
      var minutes = Math.floor(this.durationA / 60);
      var seconds = this.durationA - minutes * 60;
      if (!this.pausedTimerA) {
        this.durationA--;
        if (this.durationA < 0.5) {
          this.stopTimer();
          this.stopA();
          this.currentIdA = this.getCurrentIdA();
          this.speed = 1000;
          this.defaultTempoA = 1;
          this.playA();
        }
      }
      document.getElementById('timeLeftA').innerHTML = minutes + ':' + seconds;
    },
    stopTimer() {
      clearInterval(this.timerA);
    },

    /**
     * play pause stop previous next song functions for player A and B
     **/
    playA() {
      this.playingA = true;
      this.pausingA = false;
      playerA.addNode(analyzerA);
      playerA.play();
      // this.minA = lib.list[this.listA[this.currentIdA].songId].metaData.length.minutes;
      // this.secA = lib.list[this.listA[this.currentIdA].songId].metaData.length.seconds;
      this.pausedTimerA = false;
      this.resumeTimer();
      this.insertMetadataA();
      console.log('Deck A sollte spielen.');
    },
    pauseA() {
      this.playingA = false;
      this.pausingA = true;
      this.pausedTimerA = true;
      this.stopTimer();
      playerA.pause();
      playerA.resetAllNodes();
      console.log('Deck A sollte pausieren.');
    },
    stopA() {
      this.playingA = false;
      this.pausingA = false;
      playerA.stop();
      this.stopTimer();
      this.speed = 1000;
      playerA.resetAllNodes();
      this.insertMetadataA();
      console.log('Deck A sollte stoppen.');
    },
    nextA() {
      playerA.stop();
      playerA.resetAllNodes();
      playerA.next();
      this.stopTimer();
      this.insertMetadataA();
      if (this.playingA) {
        this.playA();
      }
    },
    prevA() {
      playerA.stop();
      playerA.resetAllNodes();
      playerA.prev();
      this.stopTimer();
      this.speed = 1000;
      this.insertMetadataA();
      if (this.playingA) {
        this.playA();
      }
    },
    playB() {
      this.playingB = true;
      this.pausingB = false;
      playerB.addNode(analyzerB);
      playerB.play();
      this.minB = lib.list[this.listB[this.currentIdB].songId].metaData.length.minutes;
      this.secB = lib.list[this.listB[this.currentIdB].songId].metaData.length.seconds;
      this.insertMetadataB();
      console.log('Deck B sollte spielen.');
    },
    pauseB() {
      this.playingB = false;
      this.pausingB = true;
      playerB.pause();
      playerB.resetAllNodes();
      console.log('Deck B sollte pausieren.');
    },
    stopB() {
      this.playingB = false;
      this.pausingB = false;
      playerB.stop();
      playerB.resetAllNodes();
      this.insertMetadataB();
      console.log('Deck B sollte stoppen.');
    },
    nextB() {
      playerB.stop();
      playerB.resetAllNodes();
      playerB.next();
      this.insertMetadataB();
      if (this.playingB) {
        this.playB();
      }
    },
    prevB() {
      playerB.stop();
      playerB.resetAllNodes();
      playerB.prev();
      this.insertMetadataB();
      if (this.playingB) {
        this.playB();
      }
    },

    printTest(val) {
      console.log('test print ' + val);
    },

    getCurrentIdA() {
      this.currentIdA = playerA.currentIndex;
      this.printTest('aktuelle id Deck A: ' + this.currentIdA);
    },
    getCurrentIdB() {
      this.currentIdB = playerB.currentIndex;
      this.printTest('aktuelle id Deck A: ' + this.currentIdB);
    },
    /**
     * refreshes shown metadata of a song
     */
    insertMetadataA() {
      var artist = playerA.current.metaData.artist;
      var title = playerA.current.metaData.title;
      this.currentArtistA = artist;
      this.currentTitleA = title;
      this.getCurrentIdA();
    },
    insertMetadataB() {
      var artist = playerB.current.metaData.artist.toString();
      var title = playerB.current.metaData.title.toString();
      this.currentArtistB = artist;
      this.currentTitleB = title;
      this.getCurrentIdB();
    },
    createPlaylistUI() {
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
    refreshPlaylistA() {
      this.listA.forEach((el, index) => playlistA.list[index] = this.listA[index].songId);
      this.getCurrentIdA();
      if (this.playingA) {
        if (playlistA.musicLibrary.list[playerA.currentIndex].metaData.artist !== this.listA[this.currentIdA].artist) {
          playerA.resetAllNodes();
          playerA.stop();
          playerA.addNode(analyzerA);
          playerA.play();
        }
      } else {
        playerA.resetAllNodes();
        playerA.stop();
      }
    },
    refreshPlaylistB() {
      this.listB.forEach((el, index) => playlistB.list[index] = this.listB[index].songId);
      if (this.playingB) {
        if (playlistB.musicLibrary.list[playerB.currentIndex].metaData.artist !== this.listB[this.currentIdB].artist) {
          playerB.resetAllNodes();
          playerB.stop();
          playerB.addNode(analyzerB);
          playerB.play();
        }
      } else {
        playerB.resetAllNodes();
        playerB.stop();
      }
    },
    changePlaylistOrder(deck) {
      if (deck === 'A') {
        this.refreshPlaylistA();
        // console.log(playerA.currentIndex)
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
          this.pauseA();
          this.stopA();
        } else {
          playlistA.delete(sId);
          this.refreshPlaylistA();
          this.insertMetadataA();
        }
      } else {
        if (playlistB.list.length < 2) {
          playlistB.delete(sId);
          this.currentArtistB = 'no artist';
          this.currentTitleB = 'no title';
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
     * for visualizing the sound in player A and B
     */
    frameLooperA() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperA) ||
        window.webkitRequestAnimationFrame(this.frameLooperA);
      analyzerA.getByteTimeDomainData(dataArrayA);

      this.canvasCtxA.fillStyle = 'rgb(132,232,202)';
      this.canvasCtxA.fillRect(0, 0, this.canvasA.width, this.canvasA.height);

      this.canvasCtxA.lineWidth = 2;
      this.canvasCtxA.strokeStyle = 'rgb(32,55,47)';
      this.canvasCtxA.beginPath();

      let sliceWidth = this.canvasA.width * 1.0 / bufferLengthA;
      let x = 0;

      for (let i = 0; i < bufferLengthA; i++) {
        let v = dataArrayA[i] / 128.0;
        let y = v * this.canvasA.height / 2;

        if (i == 0) {
          this.canvasCtxA.moveTo(x, y);
        } else {
          this.canvasCtxA.lineTo(x, y);
        }
        x += sliceWidth;
      }
      this.canvasCtxA.lineTo(this.canvasA.width, this.canvasA.height / 2);
      this.canvasCtxA.stroke();
    },
    /**
     * visualizing sound for deck a & b
     */
    frameLooperB() {
      window.RequestAnimationFrame =
        window.requestAnimationFrame(this.frameLooperB) ||
        window.webkitRequestAnimationFrame(this.frameLooperB);
      analyzerB.getByteTimeDomainData(dataArrayB);

      this.canvasCtxB.fillStyle = 'rgb(0,0,0)';
      this.canvasCtxB.fillRect(0, 0, this.canvasB.width, this.canvasB.height);


      let barWidth = (this.canvasB.width / bufferLengthB) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLengthB; i++) {
        barHeight = dataArrayB[i] / 2;

        this.canvasCtxB.fillStyle = 'rbg(' + (barHeight + 100) + ',50,50)';
        this.canvasCtxB.fillRect(x, this.canvasB.height - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    },

    /**
     * for manipulating Gain in player A and B
     */
    setVolumeA(value) {
      playerA.setVolume(value);
      console.log('Player A Gain: ' + playerA.gain.gain.value);
    },
    setVolumeB(value) {
      playerB.setVolume(value);
      console.log('Player B Gain: ' + playerB.gain.gain.value);
    },
    setMaster(value) {
      masterGain.gain.value = value;
      console.log('Master Gain: ' + masterGain.value);
    },
    setCrossfader(value) {
      crossfader.setBalance(value);
      console.log('Crossfader Balance: ' + value);
    },
    setTempoA(value) {
      this.speed = -500 * value + 1500;
      playerA.setTempo(value);
      console.log('Player A Tempo: ' + playerA.playingSpeed);

    },
    setTempoB(value) {
      playerB.setTempo(value);
      console.log('Player B Tempo: ' + playerB.playingSpeed);
    },
    setSeekA(time) {
      playerA.seek(time);
      console.log(time);
    },
    setSeekB(time) {
      playerB.seek(time);
      console.log(time);
    },
    setEqA(index, value) {
      playerA.setEq(index, value);
    },
    setEqB(index, value) {
      playerB.setEq(index, value);
    },
  },
  mounted() {
    //this.insertMetadata(playerA.current.metaData.artist.toString(), playerA.current.metaData.title.toString());
    this.handleInitButton();
    this.canvasA = this.$refs['canvasA'];
    this.canvasCtxA = this.$refs['canvasA'].getContext('2d');
    this.canvasB = this.$refs['canvasB'];
    this.canvasCtxB = this.$refs['canvasB'].getContext('2d');
    this.playingA = false;
    this.playingB = false;
    this.mutedStringA = 'not muted';
    this.mutedStringB = 'not muted';
  }
  ,
  computed: {}
  ,
  watch: {
    // whenever question changes, this function will run
    currentIdA: function () {
      this.speed = 1000;
      this.startTimer();
      this.insertMetadataA();
    },
    currentIdB: function () {
      this.insertMetadataB();
      this.defaultTempoB = 1;
    }
    ,
    speed: function () {
      this.resumeTimer();
      console.log('speed ist: ' + this.speed);
    },
    mutedA: function () {
      if (this.mutedA) {
        this.mutedStringA = 'muted';
        this.setVolumeA(0);
      } else {
        this.mutedStringA = 'not muted';
      }
    }
    ,
    mutedB: function () {
      if (this.mutedB) {
        this.mutedStringB = 'muted';
        this.setVolumeB(0);
      } else {
        this.mutedStringB = 'not muted';
      }
    }
  }
}
;
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
