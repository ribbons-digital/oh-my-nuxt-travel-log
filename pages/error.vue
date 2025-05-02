<script lang="ts" setup>
const route = useRoute();
const error = route.query.error as string || "An unknown error occurred";
</script>

<template>
  <div class="container bg-base-300 card mt-4 min-h-72 text-center mx-auto flex flex-col items-center gap-4">
    <div role="alert" class="alert alert-error min-w-1/2 text-center">
      <span>Oh no! {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Back to home
      <Icon name="tabler:arrow-left" size="32" />
    </NuxtLink>
  </div>
</template>
