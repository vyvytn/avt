<template>
  <div id="deckRoot">
    <!--    <div>
          <av-media
            :media="audioExample"
          ></av-media>
        </div>-->
    <div>
      <b-button variant="success" @click="playAudio">
        <b-icon icon="play-fill"></b-icon>
      </b-button>
      <b-button variant="danger" @click="stopAudio">
        <b-icon icon="stop-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-start-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-end-fill"></b-icon>
      </b-button>
    </div>
    <b-tabs pills card>
      <b-tab title="Playlist" active>
        <b-card-text>
          <Playlist></Playlist>
          <b-button block variant="primary" id="modalBtn" @click="togglePlaylistModal">Bibliothek
            <b-icon icon="Box-arrow-up-right"></b-icon>
          </b-button>

          <!--MENU FOR PLAYLIST EDITING BEGIN-->
          <b-modal ref="playlistModal" title="Playlist bearbeiten">
            <b-tabs pills card>
              <b-tab title="Bibliothek" active>
                <b-card-text>
                  <edit-play-list></edit-play-list>
                </b-card-text>
              </b-tab>
              <b-tab title="Musik importieren">
                <b-card-text>
                </b-card-text>
              </b-tab>
              <b-tab title="Freesound">
                <b-card-text>
                </b-card-text>
              </b-tab>
            </b-tabs>
          </b-modal>
          <!--MENU FOR PLAYLIST EDITING END-->

        </b-card-text>
      </b-tab>
      <b-tab title="EQ">
        <b-card-text>
          <b-col>
            <b-row>
              <eq-slider
                v-for="el in equalizerList"
                :key="el.name"
                :value="el.label"
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
      <b-tab title="Scratch">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
      <b-tab title="Beats">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
    </b-tabs>

  </div>
</template>

<script>
import draggable from 'vuedraggable';
import EditPlayList from './EditPlayList';
import Playlist from './PlayList';
import EqSlider from './EqSlider';
import FXButton from './FXButton';
export default {
  name: 'deck',
  components: {
    FXButton,
    EqSlider,
    EditPlayList,
    Playlist,
    draggable,
  },
  data() {
    return {
      audioExample: Audio,
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
    };
  },
  methods: {
    onEdit(song) {
      alert(`Editing ${song.name}`);
    },
    onDelete(song) {
      alert(`Deleting ${song.name}`);
    },
    add: function () {
      this.list.push({ name: 'Juan' });
    }
    ,
    replace: function () {
      this.list = [{ name: 'Edgard' }];
    }
    ,
    clone: function (el) {
      return {
        name: el.name + ' cloned'
      };
    }
    ,
    log: function (evt) {
      window.console.log(evt);
    }
    ,
    togglePlaylistModal() {
      this.$refs['playlistModal'].show();
    }
    ,
    playAudio: function () {
      if (!this.isReady) return;
      this.bufferSource.start();
    }
    ,
    stopAudio: function () {
      this.bufferSource.stop();
    },
  },
  beforeCreate() {
    /*-----WEB AUDIO API BEGIN-----*/
   let path= './assets/example.mp3'

    if (!window.AudioContext) { // window.webkitAudioContext
      alert ("Web Audio API not supported!");
      return;
    }

    this.audioCtx = new window.AudioContext();

    // Prepare Gain Node
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
    this.gainNode.gain.value = 1.0;

    this.request = new XMLHttpRequest();
    this.request.open('GET', path, true);
    this.request.responseType = 'arraybuffer';

    this.request.onload = () => {
      receiveAudio();
    };
    this.request.send();

   function receiveAudio() {
      this.buffer = this.request.response;
      this.audioCtx.decodeAudioData(this.buffer).then(
        setBuffer.bind(this)
      );
    }

    function setBuffer(decodedBuffer) {
      this.buffer = decodedBuffer;
      this.isReady = true;
      this.bufferSource = this.audioCtx.createBufferSource();
      this.bufferSource.buffer = this.buffer;
      this.bufferSource.connect(this.gainNode);
      this.bufferSource.start();
    }
    /*-----WEB AUDIO API END-----*/
  }
  ,
};
</script>

<style scoped>
</style>
