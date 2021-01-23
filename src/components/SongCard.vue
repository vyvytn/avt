<template>
  <div>
    <div v-if="current">
      <li
        class="p-4 mb-3 list-group-item shadow-sm rounded-lg cursor-move border-0"
        style="background-color: #cdcdcd;"
      >
<!--        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">-->
<!--          <b-icon icon="grip-horizontal"></b-icon>-->
<!--        </i>-->
        <div >
<!--          <b-avatar></b-avatar>-->
          <b-icon icon="music-note-list"></b-icon>
          <div>
            <p class="text-white font-weight-normal font-sans">{{ s.title }}</p>
            <p class="text-white font-weight-bold font-sans">{{ s.artist }}</p>
          </div>
        </div>
      </li>
    </div>
    <div v-if="!current">
      <li
        class="p-4 mb-3 list-group-item shadow-sm bg-light rounded-lg cursor-move border-0"
      >
<!--        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">-->
<!--          <b-icon icon="grip-horizontal"></b-icon>-->
<!--        </i>-->
        <div>
          <b-icon icon="music-note-list"></b-icon>
          <p class="text-gray-700 font-weight-medium font-sans">{{ s.artist }}</p>
          <p class="font-weight-bolder font-sans">{{ s.title }}</p>
        </div>
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
