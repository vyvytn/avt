<template>
  <div id="freesoundList">
    <b-form-input placeholder="Search for free Sounds"></b-form-input>
    <b-list-group>
      <b-list-group-item v-for="element in freeSoundList">
        <free-sound-item :name="element.name" @addSong="updateLibrary(element)"></free-sound-item>
      </b-list-group-item>
    </b-list-group>
    <b-alert
      variant="success"
      :show="dismissCountDown"
      dismissible
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >Song has been added to library</b-alert>

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
export default {
  name: 'FreeSoundList',
  components:{
    FreeSoundItem
  },
  data(){
    return{
      freeSoundList: [
        { name: 'Song 1'},
        { name: 'Song 2'},
        { name: 'song 3'},
      ],
      dismissSecs: 1,
      dismissCountDown: 0,
    }
  },
  methods:{
    updateLibrary(e){
      this.$emit('update',e);
      this.showAlert()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    }
  },
  props:{
    duplicate:Boolean
  },
};
</script>

<style scoped>

</style>
