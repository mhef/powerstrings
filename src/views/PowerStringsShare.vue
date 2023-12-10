<script setup lang="ts">
import { defineProps, computed, type PropType } from 'vue';
import { encodeATL, type PSTransformerWithArguments } from './Transform';
import ButtonCopy from '@/components/ButtonCopy.vue';

const props = defineProps({
  transformers: {
    required: true,
    type: Array as PropType<Array<PSTransformerWithArguments>>,
  },
});

/**
 * sharingURL hold the sharing URL with the current applied transformers.
 */
const sharingURL = computed(() => {
  let url = new URL('https://powerstrings.mhef.com.br');
  url.searchParams.set('t', encodeATL(props.transformers));
  return url.toString();
});
</script>

<template>
  <VDropdown
    :distance="8"
    :hide-triggers="['click']"
  >
    <div
      v-tooltip="'Share or save the applied transformers!'"
      class="btn size-xs"
    >
      <span class="material-symbols-outlined">share</span>
    </div>

    <template #popper>
      <div id="share-popper">
        <div class="header">
          <b>Share the applied transformers!</b>
        </div>
        <div class="form-group">
          <div class="url">
            <input
              class="form-control"
              :value="sharingURL"
              @input.prevent
            >
          </div>
          <button-copy :content="sharingURL" />
        </div>
        <div class="disclaimer">
          Only the applied transformers are shared.<br>
          The input content is never saved or shared.
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<style lang="scss">
#share-popper {
  .header {
    width: 100%;
    text-align: center;
    margin-bottom: 5px;
  }

  .disclaimer {
    margin-top: 8px;
    width: 100%;
    text-align: center;
    font-size: 0.85rem;
  }

  .form-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 10px;

    input {
      flex-grow: 1;
      min-width: 320px;
    }
  }
}
</style>
