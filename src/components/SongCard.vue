<template>
  <li
    class="p-2 mb-3 list-group-item bg-white shadow rounded-lg cursor-move border border-white"
  >
    <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">
      <b-icon icon="grip-horizontal"></b-icon>
    </i>
    <div class="">
      <img class="w-20 h-20 rounded-full" :src="s.img">
      <p class="text-gray-700 font-semibold font-sans font-weight-bold ">{{ s.name }}</p>
    </div>
    <i
      class="action-button p-1 focus:outline-none focus:shadow-outline text-teal-500 hover:text-teal-600"
      @click="$emit('on-delete', s)"
    >
      <b-icon icon="trash-fill"></b-icon>
    </i>
  </li>
</template>
<script>
export default {
  components: {},
  props: {
    s: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
</style>
