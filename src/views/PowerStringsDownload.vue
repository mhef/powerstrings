<script setup lang="ts">
const props = defineProps({
  content: {
    required: true,
    type: String,
  },
});

/**
 * downloadURL download the given URL with the filename as:
 * powerstrings-{unix_ts}.{ext}.
 */
function downloadURL(url: string, ext: string) {
  let a = document.createElement('a');
  a.href = url as string;
  a.download = `powerstrings-${Math.round(Date.now() / 1000)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * downloadAsTXT downloads the ouput content as txt file.
 */
function downloadAsTXT() {
  let blob = new Blob([props.content], { type: 'text/plain' });
  downloadURL(URL.createObjectURL(blob), 'txt');
}

/**
 * downloadAsCSV downloads the ouput content as csv file.
 */
function downloadAsCSV() {
  let blob = new Blob([props.content], { type: 'text/csv' });
  downloadURL(URL.createObjectURL(blob), 'csv');
}
</script>

<template>
  <!--
    Disable the dropdown popper if this is an applying operation and this
    transformer don't need arguments. The transformer will be added directly
    with handleTransformerBtnClick.
  -->
  <VDropdown
    :disabled="content.length === 0"
    :distance="8"
    :hide-triggers="['click']"
  >
    <div
      class="btn size-md"
    >
      <span class="material-symbols-outlined">download</span>
      Download
    </div>

    <template #popper>
      <div id="download-output-popper">
        <div
          class="btn size-sm"
          @click="downloadAsTXT"
        >
          <span class="material-symbols-outlined">font_download</span>
          as .txt
        </div>
        <div
          class="btn size-sm"
          @click="downloadAsCSV"
        >
          <span class="material-symbols-outlined">csv</span>
          as .csv
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<style lang="scss">
#download-output-popper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
