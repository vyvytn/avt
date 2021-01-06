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
  >
    <song-card
      v-for="s in songlist"
      :key="s.id"
      :s="s"
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
  data: function (){
    return{
      songlist: [
        {
          id: 1,
          name: 'Song 1',
          interpret: 'Interpret 1',
          album: 'Album 1',
          img: '',
        },
        {
          id: 2,
          name: 'Song 2',
          interpret: 'Interpret 2',
          album: 'Album 2',
          img: '',

        },
        {
          id: 3,
          name: 'Song 3',
          interpret: 'Interpret 3',
          album: 'Album 3',
          img: '',

        },
        {
          id: 4,
          name: 'Song 4',
          interpret: 'Interpret 4',
          album: 'Album 4',
          img: '',

        },
        {
          id: 5,
          name: 'Song 5',
          interpret: 'Interpret 5',
          album: 'Album 5',
          img: '',

        }
      ],
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
    }
  }
};
</script>

<style scoped>
</style>
