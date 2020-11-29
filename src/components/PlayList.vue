<template>
  <draggable
    :list="songlist"
    :animation="100"
    ghost-class="moving-card"
    group="songs"
    filter=".action-button"
    class="w-full max-w-md"
    tag="ol"
    :scroll-sensitivity="200"
    :force-fallback="true"
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
          img: ''
        },
        {
          id: 2,
          name: 'Song 2',
          img: ''

        },
        {
          id: 3,
          name: 'Song 3',
          img: ''

        },
        {
          id: 4,
          name: 'Song 4',
          img: ''

        },
        {
          id: 5,
          name: 'Song 5',
          img: ''

        }
      ],
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 }
      ],
    }
  }
};
</script>

<style scoped>

</style>
