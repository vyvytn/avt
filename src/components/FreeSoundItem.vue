<template>
  <div>
    <b-col>
      <b-row>
        <b-col cols="6">
          <p><b>Künstler: </b>{{ artist }}</p>
          <p><b>Titel: </b>{{ title }}</p>
          <p><b>Dauer: </b>{{ durationMin }}:{{ durationSec }} min</p>
        </b-col>
        <b-col cols="4">
          <img :src=imgurl>
        </b-col>
        <b-col cols="2">
          <b-button @click="downloadSong(idx)">Add</b-button>
        </b-col>
      </b-row>
    </b-col>


  </div>
</template>

<script>
export default {
  name: 'FreeSoundItem',
  props: {
    artist: null,
    title: null,
    imgurl: '',
    durationMin: null,
    durationSec: null,
    idx: null
  },
  methods: {
    downloadSong(i) {
      this.$emit('freeSound', i);
    },
  },
  mounted() {
    this.durationSec = Math.round(this.durationSec);
  }
};

</script>

<style scoped>

</style>
