<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink class="btn btn-ghost text-xl" to="/">
        Nuts travel log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
