<template>
  <div id="deckRoot">
    <b-card
      style="padding: 1em; background-color: #a498ee"
    >
      <b-card-text>
        <b-icon icon="music-note-list"></b-icon>
        <p id="songTitle" class="font-weight-bold">{{ currentTitle }}</p>
        <p id="interpretName" class="font-weight-medium">{{ currentArtist }}</p>
      </b-card-text>
    </b-card>
    <div style="padding: 1em" align="center">
      <b-button
        variant="success"
        @click="buttonClickedPlay"
      :disabled.sync="isPlaying">
        <b-icon font-scale="2" icon="play-fill"></b-icon>
      </b-button>
      <b-button
        variant="success"
        @click="buttonClickedPause"
        :disabled.sync="isPausing">
        <b-icon font-scale="2" icon="pause-fill"></b-icon>
      </b-button>
      <b-button
        variant="danger"
        @click="buttonClickedStop">
        <b-icon font-scale="2" icon="stop-fill"></b-icon>
      </b-button>
      <b-button
        variant="outline-secondary">
        <b-icon font-scale="2" icon="skip-start-fill" @click="buttonClickedPrev"></b-icon>
      </b-button>
      <b-button
        variant="outline-secondary">
        <b-icon font-scale="2" icon="skip-end-fill" @click="buttonClickedNext"></b-icon>
      </b-button>
    </div>
    <b-tabs pills fill card>
      <b-tab title="Playlist" active>
        <b-card-text>
          <div style="overflow-y: auto ; max-height: 60vh">
            <Playlist
              :array-playlist="playListA"
              @playlistChanged="updatePlaylist"
              :songId.sync="currentSongId"
            ></Playlist>
          </div>
          <div align="center">
            <b-button variant="secondary" id="modalBtn" @click="togglePlaylistModal">Bibliothek
              <b-icon icon="Box-arrow-up-right"></b-icon>
            </b-button>
          </div>

        </b-card-text>
      </b-tab>
      <b-tab title="EQ">
        <b-card-text>
          <b-col>
            <b-row>
              <b-checkbox
                v-model="eqStatus"
              >Ein
              </b-checkbox>
              <eq-slider
                v-for="el in equalizerList"
                :key="el.name"
                :value="el.label"
                :on=eqStatus
                @changeEq="changeEqSlider"
              ></eq-slider>
            </b-row>
          </b-col>
        </b-card-text>
      </b-tab>
      <b-tab title="FX">
        <b-card-text>
          <div>
            <f-x-button
              v-for="el in effectsList"
              :key="el.name"
              :label="el.name"
              @toggleFXButton="toggleFXButton"></f-x-button>
          </div>
        </b-card-text>
      </b-tab>
    </b-tabs>

  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Playlist from './PlayList';
import EqSlider from './EqSlider';
import FXButton from './FXButton';

export default {
  name: 'deck',
  components: {
    FXButton,
    EqSlider,
    Playlist,
    draggable,
  },
  data() {
    return {
      eqStatus: false,
      equalizerList: [
        { name: '32', label: '32' },
        { name: '64', label: '64' },
        { name: '125', label: '125' },
        { name: '250', label: '250' },
        { name: '500', label: '500' },
        { name: '1k', label: '1000' },
        { name: '2k', label: '2000' },
        { name: '4k', label: '4000' },
        { name: '8k', label: '8000' },
        { name: '16k', label: '16000' },

      ],
      effectsList: [
        { name: 'Verzerrer' },
        { name: 'Telefon' },
        { name: 'Hall' },
      ],
      isReady: false,
      isPlaying: this.playing,
      isPausing: this.pausing,
      playListA: this.arrayPlaylist,
      timeLeftMin: this.min,
      timeLeftSec:this.sec,
    };
  },
  props: {
    arrayPlaylist: Array,
    title: {
      type: String,
    },
    artist: {
      type: String,
    },
    songId: Number,
    playing:Boolean,
    pausing:Boolean,
  },
  methods: {

    onEdit(song) {
      alert(`Editing ${song.name}`);
    },
    onDelete(song) {
      alert(`Deleting ${song.name}`);
    },
    add() {
      this.list.push({ name: 'Juan' });
    },
    replace() {
      this.list = [{ name: 'Edgard' }];
    },
    clone(el) {
      return {
        name: `${el.name} cloned`,
      };
    },
    log(evt) {
      window.console.log(evt);
    },
    togglePlaylistModal() {
      //this.$refs.playlistModal.show();
      this.$emit('openLibraryClicked');
    },
    buttonClickedPlay() {
      this.$emit('play');
      this.isPlaying = true;
      this.isPausing = false;
    }
    ,
    buttonClickedPause() {
      this.$emit('pause');
      this.isPlaying = false;
      this.isPausing = true;
    },
    buttonClickedStop() {
      this.$emit('stop');
      this.isPlaying = false;
      this.isPausing = false;
    },
    buttonClickedNext() {
      this.$emit('next');
      this.isPlaying = true;
      this.isPausing = false;
    },
    buttonClickedPrev() {
      this.$emit('prev');
      this.isPlaying = true;
      this.isPausing = false;
    },
    updatePlaylist(){
      this.$emit("playlistChanged")
    },
    changeEqSlider(index, value){
      this.$emit('changeEqDeck', index, value);
      console.log(index + ", " + value);
    },
    toggleFXButton(name){
      this.$emit('toggleFX', name);
    }

  },
  computed: {
    currentArtist: function () {
      return this.artist;
    },
    currentTitle: function () {
      return this.title;
    },
    currentSongId:function (){
      return this.songId;
    }

  }
};
</script>

<style scoped>
</style>
