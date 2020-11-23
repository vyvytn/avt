<template>
  <li
    class="p-4 mb-3 flex justify-between items-center bg-white shadow rounded-lg cursor-move border border-white"
  >
    <div class="flex items-center">
      <img class="w-10 h-10 rounded-full" :src="s.img">
      <p class="ml-2 text-gray-700 font-semibold font-sans tracking-wide">{{ s.name }}</p>
    </div>
    <div class="flex">
      <b-button
        class="action-button p-1 focus:outline-none focus:shadow-outline text-teal-500 hover:text-teal-600"
        @click="$emit('on-delete', s)"
      >
        <b-icon icon="trash-fill"></b-icon>
      </b-button>
      <b-icon icon="grip-horizontal"></b-icon>
    </div>
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
