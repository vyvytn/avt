<template>
  <div>
    <div v-if="current">
      <li
        class="p-4 mb-3 list-group-item shadow rounded-lg cursor-move border-0"
      >
        <!--        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">-->
        <!--          <b-icon icon="grip-horizontal"></b-icon>-->
        <!--        </i>-->
        <b-row>
          <!--          <b-avatar></b-avatar>-->
          <b-col cols="2">
            <p class="h2">
              <b-icon icon="music-note-beamed"></b-icon>
            </p>
          </b-col>
          <b-col cols="3">
            <p class="font-weight-lighter">Titel: </p>
            <p class="font-weight-lighter">Künstler: </p>
          </b-col>
          <b-col cols="7">
            <p class="text-dark font-weight-normal font-sans">{{ s.title }}</p>
            <p class="text-dark font-weight-bold font-sans">{{ s.artist }}</p>
          </b-col>
        </b-row>
      </li>
    </div>
    <div v-if="!current" style="opacity: 0.6;">
      <li
        class="p-4 mb-3 list-group-item shadow blur bg-light rounded-lg cursor-move border-0"
      >
        <!--        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">-->
        <!--          <b-icon icon="grip-horizontal"></b-icon>-->
        <!--        </i>-->
        <b-row>
          <b-col cols="2">
            <p class="h2">
              <b-icon icon="music-note-list"></b-icon>
            </p>
          </b-col>
          <b-col cols="3">
            <p class="font-weight-lighter">Titel: </p>
            <p class="font-weight-lighter">Künstler: </p>
          </b-col>
          <b-col cols="7">
            <p class="text-gray-700 font-weight-bolder font-sans">{{ s.title }}</p>
            <p class="text-gray-700 font-weight-medium font-sans">{{ s.artist }}</p>
          </b-col>
        </b-row>
      </li>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // current: Boolean
    };
  },
  props: {
    s: {
      type: Object,
      default: () => ({})
    },
    sId: Number,
    idx: Number
  },
  computed: {
    current: function () {
      return this.idx === this.sId;
    }
  }
};
</script>

<style scoped>
</style>
