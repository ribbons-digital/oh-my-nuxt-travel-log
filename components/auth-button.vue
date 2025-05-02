<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn m-1"
    >
      <div v-if="authStore.user?.image" class="avatar">
        <div class="w-8 rounded-xl">
          <img :src="authStore.user?.image" :alt="authStore.user?.name">
        </div>
      </div>
      {{ authStore.user?.name }}
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-200  rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <NuxtLink to="/sign-out">
          <Icon name="tabler:logout-2" size="24" />
          Sign Out
        </NuxtLink>
      </li>
    </ul>
  </div>
  <button
    v-else
    class="btn btn-accent"
    :disabled="authStore.loading"
    @click="authStore.signIn"
  >
    Sign In with Github
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="24"
    />
  </button>
</template>
