<template>
  <draggable
    :list="songlist"
    :animation="100"
    ghost-class="moving-card"
    group="songs"
    filter=".action-button"
    class="w-full max-w-md list-group"
    tag="ol"
    :scroll-sensitivity="200"
    forceFallback="true"
    style="list-style: none"
    @change="updatePlaylist"
  >
    <song-card
      v-for="s in songlist"
      :s="s"
    >{{printStatus}}</song-card>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import SongCard from './SongCard';

export default {
  name: 'SongList',
  components: {
    draggable,
    SongCard,

  },
  data: function (){
    return{
      songlist: this.arrayPlaylist,
    }
  },
  props:{
    arrayPlaylist: Array,
  },
  methods: {
    printStatus(){
      console.log(this.songlist);
    },
    updatePlaylist(){
      this.$emit('playlistChanged');
    }
  }
};
</script>

<style scoped>
</style>
