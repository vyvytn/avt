<template>
  <b-overlay :show="loading" class="rounded-sm p-2">
    <div id="freesoundList" @keyup.enter="getSoundList">
      <b-col>
        <b-row class="mb-4">
          <b-col class="col-10">
            <b-form-input placeholder="Suche nach einem Freesound..." :state="state" v-model="searchword">{{
                searchword
              }}
            </b-form-input>
          </b-col>
          <b-col>
            <b-button @click="getSoundList">
              <b-icon icon="search"></b-icon>
            </b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-alert
        v-model="noSearchword"
        variant="danger"
        dismissible>
        Bitte ein Suchbegriff eingeben
      </b-alert>
      <div class="overflow-auto">
        <b-list-group v-if="!loading">
          <b-overlay :show="!uploadSuccess">
            <b-list-group-item v-for="(element, index) in this.resultList"
                               :key="index"
                               class="rounded mb-4 shadow">
              <free-sound-item :imgurl="element.metaData.imgUrl"
                               :title="element.metaData.title"
                               :artist="element.metaData.artist"
                               :durationMin="element.metaData.length.minutes"
                               :durationSec="element.metaData.length.seconds"
                               :idx="index"
                               @freeSound="downloadSong"
              ></free-sound-item>
            </b-list-group-item>
            <template #overlay>
              <div class="text-center">
                <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                <p id="cancel-label">Please wait...</p>
              </div>
            </template>
          </b-overlay>

        </b-list-group>

      </div>

      <!--<b-alert v-if="this.duplicate"
               variant="danger"
               :show="dismissCountDown"
               dismissible
               @dismissed="dismissCountDown=0"
               @dismiss-count-down="countDownChanged"
      >{{showAlert}}Song was already added to library</b-alert>-->
    </div>
  </b-overlay>
</template>

<script>
import FreeSoundItem from './FreeSoundItem';
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
      state: null,
      loading: false,
      noSearchword: false,
      showSuccessAlert: false
    };

  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    async getSoundList() {
      if (this.searchword !== '') {
        this.state = true;
        this.loading = true;
        await search(this.searchword)
          .then(result => this.resultList = result);
        console.log(this.resultList[1].metaData);
        this.loading = false;
      } else {
        this.noSearchword = true;
      }
    },
    downloadSong(value) {
      let song = this.resultList[value];
      this.$emit('upload', song);
      this.uploadSuccess = true;
    }
  }
  ,
  props: {
    duplicate: Boolean,
    uploadSuccess: Boolean

  },

}
;
</script>

<style scoped>

</style>
