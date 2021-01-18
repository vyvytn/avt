<template>
  <li
    class="p-2 mb-3 list-group-item bg-white shadow rounded-lg cursor-move border border-white"
  >
    <i class="p-1 text-teal-500 focus:outline-none focus:shadow-outline hover:text-teal-600">
      <b-icon icon="grip-horizontal"></b-icon>
    </i>
    <div class="">
      <b-avatar badge=""></b-avatar>
      <p class="text-gray-700 font-weight-bold font-sans">{{ s.name }}</p>
      <p class="font-weight-medium font-sans">{{s.interpret}}</p>
      <p class="font-weight-medium font-sans">{{ s.album }}</p>
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
