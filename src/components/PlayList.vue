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
      style="padding: 0.3em"
      v-for="(s,index) in songlist"
      :s="s"
      :key="index"
      :sId.sync="songId"
      :idx.sync="index"
    ></song-card>
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
  data: function () {
    return {
      songlist: this.arrayPlaylist,
      currentSongId: this.songId
    };
  },
  props: {
    arrayPlaylist: Array,
    songId: Number
  },
  methods: {
    updatePlaylist() {
      this.$emit('playlistChanged');
    }
  }
};
</script>

<style scoped>
</style>
