<script setup lang="ts">
import { useLoadingOverlayStore } from '../stores/loadingOverlayStore';
import LoadingOverlay from './components/LoadingOverlay.vue';

const loadingOverlayStore = useLoadingOverlayStore();
</script>

<template>
  <LoadingOverlay :is-show="loadingOverlayStore.isLoading" />
  <router-view />
</template>

<style scoped lang="scss"></style>

<style module lang="scss"></style>
