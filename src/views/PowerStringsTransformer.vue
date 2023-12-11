<script setup lang="ts">
import { reactive, watch, type PropType } from 'vue';
import { cloneDeep } from 'lodash';
import { type PSTransformer } from './Transform';

const props = defineProps({
  transformer: {
    required: true,
    type: Object as PropType<PSTransformer>,
  },

  /**
   * applied define this transformer is already applied. This allow us to show
   * edit and delete interfaces when opening a applied transformer.
   */
  applied: {
    type: Boolean,
    default: false,
  },

  /**
   * arguments define the arguments of the transformer, if any. Should only be
   * present on applied transformers.
   */
  arguments: {
    type: Array as PropType<string[]>,
    default: () => ([]),
  },
});

const emit = defineEmits<{
  /**
   * AddTransformer emits the intention of adding the given transformer on the
   * end of the chain.
   */
  AddTransformer: [t: PSTransformer, args: string[]],

  /**
   * UpdateTransformer emits the intention of updating the passed transform args.
   */
  UpdateTransformer: [args: string[]],

  /**
   * DeleteTransformer emits the intention of deleting the passed transform.
   */
  DeleteTransformer: [],
}>();

/**
 * state hold the current state of the component.
 */
const state = reactive({
  /**
   * ArgValues is an array holding the value of the arguments.
   */
  ArgValues: [] as string[],
});

watch(() => props.arguments, () => {
  if (!props.applied) {
    let ret = [];
    for (let i = 0; i < props.transformer.Args.length; i += 1) ret.push('');
    state.ArgValues = ret;
    return;
  }
  state.ArgValues = cloneDeep(props.arguments);
}, { immediate: true });

/**
 * resetArgValues reset the value of all args.
 */
function resetArgValues() {
  state.ArgValues = state.ArgValues.map(() => (''));
}

/**
 * handleTransformerBtnClick handles a click on the transformer button. If this
 * is an applying operation and the given transformer don't need argumemnts,
 * the func will add the transformer directly. Otherwise, the dropdown will be
 * open to allow the user to fill the arguments and add manually.
 */
function handleTransformerBtnClick() {
  if (!props.applied && props.transformer.Args.length === 0) {
    emit('AddTransformer', props.transformer, []);
    resetArgValues();
  }
}
</script>

<template>
  <!--
    Disable the dropdown popper if this is an applying operation and this
    transformer don't need arguments. The transformer will be added directly
    with handleTransformerBtnClick.
  -->
  <VDropdown
    :disabled="!props.applied && props.transformer.Args.length === 0"
    :distance="8"
    :hide-triggers="['click']"
  >
    <div
      class="btn size-sm"
      @click.prevent="handleTransformerBtnClick"
    >
      <span class="material-symbols-outlined">{{ transformer.Icon }}</span>
      {{ transformer.Name }}
    </div>

    <template #popper="{ hide }">
      <div id="transformer-add-container">
        <template v-if="props.applied">
          <div class="transformer-add-header mb-20">
            Remove
          </div>
          <div
            class="btn size-sm"
            @click="$emit('DeleteTransformer'), hide()"
          >
            <span class="material-symbols-outlined">delete</span>
            Remove
          </div>
          <div class="mt-20" />
        </template>
        <template v-if="transformer.Args.length > 0">
          <div class="transformer-add-header">
            Arguments
          </div>
          <div
            v-for="(arg, i) in transformer.Args"
            :key="arg.Name"
            class="form-group"
          >
            <div class="label">
              {{ arg.Name }}
            </div>
            <textarea
              v-model="state.ArgValues[i]"
              class="form-control"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="none"
              spellcheck="false"
              :placeholder="arg.Placeholder"
            />
          </div>
          <template v-if="!props.applied">
            <div
              class="btn size-sm"
              @click="$emit('AddTransformer', props.transformer, state.ArgValues), hide(), resetArgValues()"
            >
              <span class="material-symbols-outlined">add</span>
              Add
            </div>
          </template>
          <template v-else>
            <div
              class="btn size-sm"
              @click="$emit('UpdateTransformer', state.ArgValues), hide()"
            >
              <span class="material-symbols-outlined">save</span>
              Update
            </div>
          </template>
        </template>
      </div>
    </template>
  </VDropdown>
</template>

<style lang="scss">
#transformer-add-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;

  .transformer-add-header {
    display: flex;
    justify-content: center;
    font-size: 1.1rem;
    color: #ffffff;
  }

  textarea {
    min-width: 300px;
    &::placeholder {
      font-size: 0.85rem;
    }
  }

  .mt-20 {
    margin-top: 20px;
  }

  .btn {
    margin-top: 10px;
  }
}
</style>
