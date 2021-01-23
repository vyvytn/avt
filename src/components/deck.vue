<template>
  <div id="deckRoot">
    <b-card
      class="p-2 mb-3 shadow-sm rounded-lg border-0"
    >
      <b-card-text>
        <b-row>
          <b-col cols="2">
            <p class="h1">
              <b-icon icon="music-note-beamed" style="color: white"></b-icon>
            </p>
          </b-col>
          <b-col cols="9">
            <p id="songTitle" class="font-weight-bold text-light"><span class="font-weight-normal">Titel: </span> {{ currentTitle }}</p>
            <p id="interpretName" class="font-weight-bolder text-light"><span class="font-weight-normal">Künstler: </span> {{ currentArtist }}</p>
          </b-col>
          <b-col cols="1">
            <p id="interpretLength" class="font-weight-bold float-right text-light">{{ length }}</p>
          </b-col>
        </b-row>

      </b-card-text>
    </b-card>
    <div style="margin: 0.2em ;padding: 0.2em" align="center">
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

    <b-tabs pills fill v-model="tabIndex">
      <b-tab title="Playlist" class="mt-4" :title-link-class="linkClass(0)">
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
              <b-icon class="p-1" icon="Box-arrow-up-right"></b-icon>
            </b-button>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab title="Equalizer" class="mt-4" :title-link-class="linkClass(1)">
        <b-card-text>
          <b-col>
            <b-row>
              <b-checkbox
                v-model="eqStatus"
              >EQ Ein
              </b-checkbox>
            </b-row>
            <b-row>
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
      <b-tab title="Effekte" class="mt-4" :title-link-class="linkClass(2)">
        <b-row class="justify-content-center">
            <b-card-text>
              <div>
                <f-x-button
                  v-for="el in effectsList"
                  :key="el.name"
                  :label="el.name"
                  @toggleFXButton="toggleFXB"></f-x-button>
              </div>
            </b-card-text>
        </b-row>
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
      tabIndex: 0,
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
        { name: 'Bitcrusher' }
      ],
      isReady: false,
      isPlaying: this.playing,
      isPausing: this.pausing,
      playListA: this.arrayPlaylist,
      timeLeftMin: this.min,
      timeLeftSec: this.sec,
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
    length: String,
    playing: Boolean,
    pausing: Boolean,
  },
  methods: {
    linkClass(idx){
      if (this.tabIndex ===idx){
        return ['bg-secondary', 'text-light' , 'm-2']
      } else {
        return ['bg-light','text-dark' , 'm-2']
      }
    },

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
    updatePlaylist() {
      this.$emit('playlistChanged');
    },
    changeEqSlider(index, value) {
      this.$emit('changeEqDeck', index, value);
      console.log(index + ', ' + value);
    },
    toggleFXB(name) {
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
    currentSongId: function () {
      return this.songId;
    },

  }
};
</script>

<style scoped>

#deckA .card {
  background:linear-gradient(135deg, #84e8ca, #b9efe0);
}

#deckB .card {
  background:linear-gradient(135deg, #a498ee, #bbb1f8);
}

</style>
