<script setup lang="ts">
const props = defineProps<{
  label: string;
  error?: string;
  type?: "text" | "textarea";
  name: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="props.type || 'input'"
      :name="props.name"
      class="w-full"
      :type="props.label === 'Latitude' || props.label === 'Longitude' ? 'number' : 'text'"
      :class="{
        'input-error': props.error,
        'input': !type || type === 'text',
        'textarea': props.type === 'textarea',
      }"
      :disabled="props.disabled"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
