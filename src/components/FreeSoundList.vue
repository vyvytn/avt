<template>
  <div id="freesoundList" @keyup.enter="getSoundList">
    <b-col>
      <b-row>
        <b-col class="col-10">
          <b-form-input placeholder="Search for free Sounds" v-model="searchword">{{ searchword }}
          </b-form-input>
        </b-col>
        <b-col>
        </b-col>
        <b-button @click="getSoundList">
          <b-icon icon="search"></b-icon>
        </b-button>

      </b-row>
    </b-col>
    <div class="overflow-auto">

      <b-list-group>
        <b-list-group-item v-for="(element, index) in freeSoundList">
          <free-sound-item :imgurl="element.imgUrl"
                           :title="element.title"
                           :artist="element.artist"
                           :duration="element.duration"
                           :idx="index"
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
import Song from '../logic/Song';
import MP3 from '../logic/MP3';

export default {
  name: 'FreeSoundList',
  components: {
    FreeSoundItem
  },
  data() {
    return {
      freeSoundList: [],
      dismissSecs: 1,
      dismissCountDown: 0,
      searchword: '',
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
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    getSoundList() {
      let songUrl = 'https://dj.jneidel.com/search/' + this.searchword;
      axios.get(songUrl)
        .then(res => {
          // const bb = new Song(new MP3(res.data));
          // await bb.prepareForPlayback(ctx);
          // let index = lib.insert(bb);
          // playlistA.add(index);
          // playlistA.add(index);
          // playlistA.add(index);
          // playlistB.add(index);
          console.log(res.data);
          this.freeSoundList = res.data;
        });

    }
  },
  props: {
    duplicate: Boolean
  },
};
</script>

<style scoped>

</style>
