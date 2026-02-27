<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :position="isMobile ? 'top' : 'standard'"
  >
    <q-card class="card-dialog">
      <q-card-section>
        <div class="text-h6">Новая карточка</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="form.title"
          label="Заголовок *"
          dense
          outlined
          autofocus
          class="q-mb-md"
          @keyup.enter="onSubmit"
        />

        <q-input v-model="form.description" label="Описание" type="textarea" dense outlined :rows="3" autogrow />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Отмена" color="grey-7" @click="$emit('update:modelValue', false)" />
        <q-btn unelevated label="Создать" color="primary" :disable="!isValid" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { Platform } from 'quasar';

const isMobile = Platform.is.mobile ?? false;

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: { title: string; description: string }];
}>();

const form = reactive({
  title: '',
  description: '',
});

const isValid = computed(() => form.title.trim().length > 0);

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      form.title = '';
      form.description = '';
    }
  }
);

function onSubmit(): void {
  if (!isValid.value) return;
  emit('save', {
    title: form.title.trim(),
    description: form.description.trim(),
  });
  emit('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.card-dialog {
  min-width: 380px;
  max-width: 500px;
  width: 100%;

  @media (max-width: 599px) {
    min-width: unset;
    max-width: unset;
  }
}
</style>
