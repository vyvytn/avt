<template>
  <b-container>
    <b-row>
      <b-col>
        <h3>Bibliothek</h3>
        <div style="overflow-y: auto ; max-height: 100px">
          <draggable class="list-group" :list="list1" group="people" @change="log">
            <div
              class="list-group-item"
              v-for="(element, index) in list1"
              :key="element.name"
            >
              {{ element.name }} {{ index }}
            </div>
          </draggable>
        </div>

      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>Deck A</h3>
        <div style="overflow-y: auto ; max-height: 100px">
          <draggable class="list-group" :list="list2" group="people" @change="log">
            <div
              class="list-group-item"
              v-for="(element, index) in list2"
              :key="element.name"
            >
              {{ element.name }} {{ index }}
            </div>
          </draggable>
        </div>
      </b-col>
      <b-col>
        <h3>Deck B</h3>
        <div style="overflow-y: auto ; max-height: 100px">
          <draggable class="list-group" :list="list2" group="people" @change="log">
            <div
              class="list-group-item"
              v-for="(element, index) in list2"
              :key="element.name"
            >
              {{ element.name }} {{ index }}
            </div>
          </draggable>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'EditPlayList',
  components: {
    draggable,
  },
  data() {
    return {
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
      list2: [
        { name: 'Juan', id: 5 },
        { name: 'Edgard', id: 6 },
        { name: 'Johnson', id: 7 },
      ],
    };
  },
  methods: {
    log(evt) {
      window.console.log(evt);
    },
  },
};
</script>

<style scoped>

</style>
