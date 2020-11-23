<template>
  <div id="deckRoot">
    <div>
      <b-button variant="success">
        <b-icon icon="play-fill"></b-icon>
      </b-button>
      <b-button variant="danger">
        <b-icon icon="stop-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-start-fill"></b-icon>
      </b-button>
      <b-button>
        <b-icon icon="skip-end-fill"></b-icon>
      </b-button>
    </div>
    <b-tabs pills card>
      <b-tab title="Playlist" active>
        <b-card-text>
          <draggable
            :list="songlist"
            :animation="100"
            ghost-class="moving-card"
            group="songs"
            filter=".action-button"
            class="w-full max-w-md"
            tag="ol"
          >
            <user-card
              v-for="s in songlist"
              :key="s.id"
              :s="s"
            ></user-card>
          </draggable>
        </b-card-text>
      </b-tab>
      <b-tab title="EQ">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
      <b-tab title="FX">
        <b-card-text>
          <div>
            <b-button :pressed.sync="effect1On" variant="outline-dark">FX 1</b-button>
            <b-button :pressed.sync="effect2On" variant="outline-dark">FX 2</b-button>
            <b-button :pressed.sync="effect3On" variant="outline-dark">FX 3</b-button>
            <b-button :pressed.sync="effect4On" variant="outline-dark">FX 4</b-button>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab title="Scratch">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
      <b-tab title="Beats">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import UserCard from './UserCard';

export default {
  name: 'deck',
  data() {
    return {
      effect1On: false,
      effect2On: false,
      effect3On: false,
      effect4On: false,
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
      ]
    };
  },
  methods: {
    onEdit(user) {
      alert(`Editing ${user.name}`);
    },
    onDelete(user) {
      alert(`Deleting ${user.name}`);
    }
  },
  mounted() {
  },
  /*methods: {
  },
   */
  components: {
    draggable,
    UserCard,
  },
};

</script>

<style scoped>
</style>
