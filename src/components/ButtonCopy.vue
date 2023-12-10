<script setup lang="ts">
import { defineProps, reactive } from 'vue';

const props = defineProps({
  content: {
    required: true,
    type: String,
  },
});

/**
 * state hold the current state of the component.
 */
const state = reactive({
  /**
   * CopiedHint indicate that a sucessful copying to the clipboard had been made
   * recently. The interface should display some hint to the user.
   */
  CopiedHint: false,
});

/**
 * copyContentToClipboard copy the content prop to the navigator clipboard.
 */
function copyContentToClipboard() {
  navigator.clipboard.writeText(props.content);
  state.CopiedHint = true;
  setTimeout(() => { state.CopiedHint = false; }, 2000);
}
</script>

<template>
  <div
    v-tooltip="{
      content: state.CopiedHint ? 'Copied!' : 'Copy to clipboard',
      triggers: ['hover'],
    }"
    :class="{
      'btn': true,
      'size-md': true,
      'copied': state.CopiedHint,
    }"
    @click="copyContentToClipboard"
  >
    <span class="material-symbols-outlined">content_copy</span>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  transition: all 0.5s;

  &.copied {
    color: #2ea538;
    border-color: #2ea538;
  }
}
</style>
