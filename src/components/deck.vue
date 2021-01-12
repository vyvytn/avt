<template>
  <div id="deckRoot">
    <b-card
      style="padding: 1em; background-color: #c49aef"
    >
      <b-card-text>
        <b-avatar></b-avatar>
        <p id="songTitle" class="font-weight-bold">Song Titel</p>
        <p id="interpretName" class="font-weight-medium">Interpret Name</p>
        <p id="albumName" class="font-weight-medium">Album Name</p>
        <p id="timeToLeft" class="font-weight-bold">-6:23</p>
      </b-card-text>
      <canvas id="songVisualizer" width="200" height="50"></canvas>
    </b-card>
    <div style="padding: 1em" align="center">
      <b-button
        variant="success"
        @click="buttonClickedPlay"
      :pressed.sync="isPlaying">
        <b-icon font-scale="2" icon="play-fill"></b-icon>
      </b-button>
      <b-button
        variant="success"
        @click="buttonClickedPause"
        :pressed.sync="isPausing">
        <b-icon font-scale="2" icon="pause-fill"></b-icon>
      </b-button>
      <b-button
        variant="danger"
        @click="buttonClickedStop">
        <b-icon font-scale="2" icon="stop-fill"></b-icon>
      </b-button>
      <b-button
        variant="outline-secondary">
        <b-icon font-scale="2" icon="skip-start-fill"></b-icon>
      </b-button>
      <b-button
        variant="outline-secondary">
        <b-icon font-scale="2" icon="skip-end-fill"></b-icon>
      </b-button>
    </div>
    <b-tabs pills fill card>
      <b-tab title="Playlist" active>
        <b-card-text>
          <div style="overflow-y: auto ; max-height: 60vh">
            <Playlist :array-playlist="playListA"></Playlist>
          </div>
          <div align="center">
            <b-button variant="secondary" id="modalBtn" @click="togglePlaylistModal">Bibliothek
              <b-icon icon="Box-arrow-up-right"></b-icon>
            </b-button>
          </div>

         <!-- MENU FOR PLAYLIST EDITING BEGIN
          <b-modal ref="playlistModal" title="Playlist bearbeiten">
            <b-tabs pills card fill>
              <b-tab title="Bibliothek" active>
                <b-card-text>
                  <edit-play-list></edit-play-list>
                </b-card-text>
              </b-tab>
              <b-tab title="Musik importieren">
                <b-card-text>
                  <FileExplorer></FileExplorer>
                </b-card-text>
              </b-tab>
              <b-tab title="Freesound">
                  <FreeSoundList></FreeSoundList>
              </b-tab>
            </b-tabs>
          </b-modal>
          MENU FOR PLAYLIST EDITING END-->

        </b-card-text>
      </b-tab>
      <b-tab title="EQ">
        <b-card-text>
          <b-col>
            <b-row>
              <b-checkbox
                v-model="eqStatus"
              >Ein</b-checkbox>
              <eq-slider
                v-for="el in equalizerList"
                :key="el.name"
                :value="el.label"
                :on=eqStatus
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
              :label="el.name"></f-x-button>
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
        { name: 'Panning' },
        { name: 'Echo' },
        { name: 'Chorus' },
        { name: 'Verzerrer' },
        { name: 'Hall' },
        { name: 'Delay' },
      ],
      isReady: false,
      isPlaying: false,
      isPausing:false,
      playListA: this.arrayPlaylist,
    };
  },
  props: {
    arrayPlaylist: Array,
    /*currentTitel: String,
    currentArtist:String,
    currentImg:,*/
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
      this.$emit('openLibraryClicked')
    },
    buttonClickedPlay(){
      this.$emit('play');
      this.isPlaying=true;
      this.isPausing=false;
    }
    ,
    buttonClickedPause(){
      this.$emit('pause');
      this.isPlaying=false;
      this.isPausing=true;
    },
    buttonClickedStop(){
      this.$emit('stop');
      this.isPlaying=false;
      this.isPausing=false;
    },
    playAudio() {
      if (!this.isReady) return;
      //this.bufferSource.start();
    },
    stopAudio() {
      //this.bufferSource.stop();
    },
  },
};
</script>

<style scoped>
</style>
