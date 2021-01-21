<template>
  <div id="freesoundList" @keyup.enter="getSoundList">
    <b-col>
      <b-row>
        <b-col class="col-10">
          <b-form-input placeholder="Search for free Sounds" :state="state" v-model="searchword">{{ searchword }}
          </b-form-input>
        </b-col>
        <b-col>
          <b-button @click="getSoundList">
            <b-icon icon="search"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </b-col>
    <div class="overflow-auto">
      <b-list-group>
        <b-list-group-item v-for="(element, index) in this.resultList">
          <free-sound-item :imgurl="element.metaData.imgUrl"
                           :title="element.metaData.title"
                           :artist="element.metaData.artist"
                           :duration="element.metaData.duration"
                           :idx="index"
                           @freeSound="downloadSong"
                           @addSong="updateLibrary(element)"></free-sound-item>
        </b-list-group-item>
      </b-list-group>
    </div>
    <b-alert
      variant="success"
      :show="dismissCountDown"
      dismissible
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >Song has been added to library
    </b-alert>

    <!--<b-alert v-if="this.duplicate"
             variant="danger"
             :show="dismissCountDown"
             dismissible
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged"
    >{{showAlert}}Song was already added to library</b-alert>-->
  </div>
</template>

<script>
import FreeSoundItem from './FreeSoundItem';
import axios from 'axios';
import { search } from '../logic/Freesound';

export default {
  name: 'FreeSoundList',
  components: {
    FreeSoundItem
  },
  data() {
    return {
      resultList: [],
      dismissSecs: 1,
      dismissCountDown: 0,
      searchword: '',
      state: null
    };
  },
  methods: {
    updateLibrary(e) {
      this.$emit('update', e);
      this.showAlert();
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    getSoundList() {
      this.state = true;
      search(this.searchword)
        .then(result =>
          this.resultList = result
        );
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    downloadSong(value) {
      let song = this.resultList[value];
      this.$emit('upload', song)
    }
  }
  ,
  props: {
    duplicate: Boolean
  }
  ,
}
;
</script>

<style scoped>

</style>
