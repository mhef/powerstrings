<script setup lang="ts">
import {
  reactive,
  computed,
  watch,
  ref,
  onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import Encoding from 'encoding-japanese';
import {
  PSTransformers,
  applyTransformer,
  encodeATL,
  decodeATL,
  type PSTransformer,
  type PSTransformerWithArguments,
} from './Transform';
import ButtonCopy from '@/components/ButtonCopy.vue';
import PowerStringsTransformer from './PowerStringsTransformer.vue';
import PowerStringsDownload from './PowerStringsDownload.vue';
import PowerStringsShare from './PowerStringsShare.vue';

const route = useRoute();

/**
 * state hold the current state of the component.
 */
const state = reactive({
  /**
   * InputValue hold the current input value content.
   */
  InputValue: '' as string,

  /**
   * AppliedTransformers hold the current applied transformers.
   */
  AppliedTransformers: [] as PSTransformerWithArguments[],
});

/**
 * fileInput hold the referente to the file input.
 */
const fileInput = ref(null);

onMounted(() => {
  if (route.query.t !== undefined) {
    try {
      state.AppliedTransformers = decodeATL(route.query.t as string);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`Failed to load transformers from URL: ${e}`);
    }
  }
});

/**
 * outputValue return the output value of the transformations applied on the
 * input. The value will be computed executing the applied transformers in chain.
 */
const outputValue = computed(() => {
  let v = state.InputValue as string | string[]; // actually, can be a arbitrary level of nested arrays....
  if (v.length === 0) return '';
  state.AppliedTransformers.forEach((t) => {
    try {
      v = applyTransformer(v, t);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`Failed to apply transformer ${t.Transformer.Name}. Maybe it previous transformer is bugged - try to remove it.\n\n${e}`);
    }
  });
  return v;
});

/**
 * outputValueFormated return the outputValue formated as a string. It will
 * convert it to json in the case of it be an array.
 */
const outputValueFormated = computed(() => {
  if (outputValue.value instanceof Array) {
    return JSON.stringify(outputValue.value, null, 4);
  }
  return outputValue.value as unknown as string;
});

/**
 * inputInfo return some cool info about the input content.
 */
const inputStats = computed(() => {
  // detect line break control
  let lineBreakControl = '';
  let controls = state.InputValue.match(/\r\n|\n/g);

  if (controls) {
    let lfLen = controls.filter((c) => c === '\n').length;
    let crlfLen = controls.length - lfLen;

    if (lfLen >= crlfLen) lineBreakControl = 'LF';
    else lineBreakControl = 'CRLF';
  }

  let encoding = '';
  try {
    let r = Encoding.detect(state.InputValue);
    if (typeof r === 'string') {
      encoding = r;
    }
  } catch (_) { console.error('failed to determine input encoding'); }

  return {
    lineBreakControl: lineBreakControl,
    charCount: state.InputValue.length,
    encoding: encoding,
    linesCount: state.InputValue.split('\n').length,
  };
});

/**
 * outputStats return some cool info about the output content.
 */
const outputStats = computed(() => {
  let elementsCount = 0;
  let elementsTotalCount = 0;

  if (outputValue.value instanceof Array) {
    elementsCount = outputValue.value.length;

    let reduceFunc = (count: number, cur: any): any => {
      if ((cur instanceof Array)) {
        return count + cur.reduce(reduceFunc, 0);
      }
      return count + 1;
    };
    elementsTotalCount = outputValue.value.reduce(reduceFunc, 0);
  }

  let lineBreakControl = '';
  let encoding = '';
  if (typeof outputValue.value === 'string') {
    // detect line break control
    let controls = (outputValue.value as string).match(/\r\n|\n/g);
    if (controls) {
      let lfLen = controls.filter((c) => c === '\n').length;
      let crlfLen = controls.length - lfLen;

      if (lfLen >= crlfLen) lineBreakControl = 'LF';
      else lineBreakControl = 'CRLF';
    }

    // detect enconding
    try {
      let r = Encoding.detect(outputValue.value as string);
      if (typeof r === 'string') {
        encoding = r;
      }
    } catch (_) { console.error('failed to determine input encoding'); }
  }

  return {
    elementsCount: elementsCount,
    elementsTotalCount: elementsTotalCount,
    lineBreakControl: lineBreakControl,
    encoding: encoding,
    charCount: outputValueFormated.value.length,
    linesCount: outputValueFormated.value.split('\n').length,
  };
});

/**
 * Watch the AppliedTransformers and when it changes, update the URL query.
 */
watch(
  () => state.AppliedTransformers,
  () => {
    // We do not use vue-router because it does not use encodeURI but a private
    // URI-enconding, causing inconsistencies.
    let url = new URL(window.location.href);
    if (state.AppliedTransformers.length === 0) {
      url.searchParams.delete('t');
    } else {
      url.searchParams.set('t', encodeATL(state.AppliedTransformers));
    }
    window.history.pushState({}, '', url);
  },
  { deep: true },
);

/**
 * addTransformer adds the given transformer to the end of the applied transforms
 * list.
 */
function addTransformer(t: PSTransformer, args: string[]) {
  state.AppliedTransformers.push({
    Transformer: t,
    Arguments: args,
  });
}

/**
 * updateTransformer update the args of the given transformer.
 */
function updateTransformer(appliedIndex: number, args: string[]) {
  state.AppliedTransformers[appliedIndex].Arguments = args;
}

/**
 * deleteTransformer deletes the args of the given transformer.
 */
function deleteTransformer(appliedIndex: number) {
  state.AppliedTransformers = state.AppliedTransformers.filter((_, i) => (i !== appliedIndex));
}

/**
 * fileSelected handles when a file is selected for the input content. It will load
 * the file content to the input var.
 */
function fileSelected() {
  let fi = fileInput.value as unknown as HTMLInputElement;
  if (fi.files === null || fi.files.length !== 1) {
    return;
  }
  let reader = new FileReader();
  reader.onerror = function (e) {
    console.log(e);
  };
  reader.onload = function (e) {
    if (typeof e?.target?.result !== 'string') return;
    state.InputValue = e?.target?.result;
  };
  reader.readAsText(fi.files[0]);
}
</script>

<template>
  <div class="power-strings">
    <div class="input-string form-group">
      <div class="form-header">
        <div class="title">
          <h2>Input</h2>
        </div>
        <div class="actions">
          <input
            ref="fileInput"
            type="file"
            hidden
            @change="fileSelected"
          >
          <div
            class="btn size-md"
            @click="(fileInput as any).click()"
          >
            <span class="material-symbols-outlined">upload_file</span>
            From a file
          </div>
        </div>
      </div>
      <textarea
        v-model="state.InputValue"
        class="form-control"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
      />
      <div class="content-stats">
        <div class="stat">
          {{ inputStats.charCount.toLocaleString() }} chars
        </div>
        <div class="stat">
          {{ inputStats.linesCount.toLocaleString() }} lines
        </div>
        <template v-if="inputStats.encoding.length > 0">
          <div class="stat">
            {{ inputStats.encoding.toUpperCase() }}
          </div>
        </template>
        <template v-if="inputStats.lineBreakControl.length > 0">
          <div class="stat">
            {{ inputStats.lineBreakControl }}
          </div>
        </template>
      </div>
    </div>
    <div class="transformation">
      <div class="transformers-header">
        Apply
      </div>
      <div class="transformers">
        <div
          v-for="t in PSTransformers"
          :key="t.Name"
          class="transform"
        >
          <!--
            Always show transformers that target strigs, because these transformers
            can transform strings and arrays (they are applied recursively).

            Dont show transformers that target arrays when the value is not an array
            because, sadly, these transformers can only accept arrays.
          -->
          <template v-if="(t.Target === 'string') || (t.Target === 'array' && outputValue instanceof Array)">
            <!-- @vue-ignore -->
            <power-strings-transformer
              v-tooltip="{ content: t.Description, html: true }"
              :transformer="t"
              @add-transformer="addTransformer"
            />
          </template>
        </div>
      </div>
      <div class="transformers-header">
        Applied
        <template v-if="state.AppliedTransformers.length > 0">
          <div
            v-tooltip="'Clear all applied transformers'"
            class="btn size-xs"
            @click="state.AppliedTransformers = []"
          >
            <span class="material-symbols-outlined">restart_alt</span>
          </div>
          <power-strings-share :transformers="state.AppliedTransformers" />
        </template>
      </div>
      <template v-if="state.AppliedTransformers.length === 0">
        No transformer applied yet
      </template>
      <template v-else>
        <div class="transformers">
          <div
            v-for="(t, idx) in state.AppliedTransformers"
            :key="idx"
            class="transform"
          >
            <!-- @vue-ignore -->
            <power-strings-transformer
              :transformer="t.Transformer"
              :arguments="t.Arguments"
              :applied="true"
              @update-transformer="(av) => updateTransformer(idx, av)"
              @delete-transformer="deleteTransformer(idx)"
            />
            <template v-if="idx !== state.AppliedTransformers.length - 1">
              <span class="material-symbols-outlined">arrow_right_alt</span>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="output-string form-group">
      <div class="form-header">
        <div class="title">
          <h2>Output</h2>
        </div>
        <div class="actions">
          <button-copy :content="outputValueFormated" />
          <power-strings-download :content="outputValueFormated" />
        </div>
      </div>
      <textarea
        :value="outputValueFormated"
        class="form-control"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        disabled
      />
      <div class="content-stats">
        <template v-if="outputStats.elementsCount > 0">
          <div class="stat">
            {{ outputStats.elementsCount.toLocaleString() }} elements
          </div>
          <div class="stat">
            {{ outputStats.elementsTotalCount.toLocaleString() }} nested elements
          </div>
        </template>
        <template v-else>
          <div class="stat">
            {{ outputStats.charCount.toLocaleString() }} chars
          </div>
          <div class="stat">
            {{ outputStats.linesCount.toLocaleString() }} lines
          </div>
        </template>
        <template v-if="outputStats.encoding.length > 0">
          <div class="stat">
            {{ outputStats.encoding.toUpperCase() }}
          </div>
        </template>
        <template v-if="outputStats.lineBreakControl.length > 0">
          <div class="stat">
            {{ outputStats.lineBreakControl }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/abstracts/theme.scss";
@import "@/assets/css/abstracts/variables.scss";

.power-strings {
  width: 100%;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: map-get($breakpoints, "lg")) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 10px 15px;
  }

  .form-group {
    flex: 1;
    padding: 25px;
    border-radius: 15px;
    background-color: $onyx;

    .form-header {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
      }
    }

    textarea {
      width: 100%;
      height: 50vh;
      resize: none;
      white-space: pre;

      &:disabled {
        cursor: text;
        background-color: $charcoal;
      }
    }

    .content-stats {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;

      .stat {
        border: thin solid rgba(255, 255, 255, 0.4);
        border-radius: 9px;
        padding: 5px 10px;
        font-size: 0.85rem;
        font-weight: 700;
        line-height: 1;
      }
    }
  }

  .input-string {
    flex-grow: 1;
  }

  .output-string {
    flex-grow: 1;
  }

  .transformation {
    flex-basis: 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;

    .transformers-header {
      color: $platinum;
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 1.4rem;
    }

    .transformers {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px 5px;

      .transform {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        gap: 5px;
      }
    }
  }
}
</style>
