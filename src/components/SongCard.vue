<template>
  <div>
    <div v-if="current">
      <li
        class="p-2 mb-3 list-group-item bg-primary shadow rounded-lg cursor-move border border-white "
      >
        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">
          <b-icon icon="grip-horizontal"></b-icon>
        </i>
        <div>
          <b-avatar badge=""></b-avatar>
          <p class="text-white font-weight-bold font-sans">{{ s.artist }}</p>
          <p class="text-white font-weight-medium font-sans">{{ s.title }}</p>
        </div>
      </li>
    </div>
    <div v-if="!current">
      <li
        class="p-2 mb-3 list-group-item bg-white shadow rounded-lg cursor-move border border-white"
      >
        <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">
          <b-icon icon="grip-horizontal"></b-icon>
        </i>
        <div>
          <b-avatar badge=""></b-avatar>
          <p class="text-gray-700 font-weight-bold font-sans">{{ s.artist }}</p>
          <p class="font-weight-medium font-sans">{{ s.title }}</p>
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
.current {
}
</style>
