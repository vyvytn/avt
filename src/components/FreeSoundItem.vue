<template>
  <div>
    <b-col>
      <b-row>
        <b-col>
          <p><b>Künstler: </b>{{artist}}</p>
          <p><b>Titel: </b>{{title}}</p>
          <p><b>Dauer: </b>{{duration}} sec</p>
        </b-col><b-col>          <img :src=imgurl>
      </b-col>
        <b-button @click="downloadSong(idx)">Add</b-button>
      </b-row>
    </b-col>


  </div>
</template>

<script>
  export default {
    name: 'FreeSoundItem',
    props: {
      artist: null,
      title:null,
      imgurl:'',
      duration:null,
      idx:null
    },
    methods:{
      downloadSong(i){
        this.$emit('freeSound', i)
      }

    }
  };

</script>

<style scoped>

</style>
