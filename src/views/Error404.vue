<script setup lang="ts">
import { onMounted } from 'vue';
import error404Image from '../assets/images/error404.png';

onMounted(() => {
  document.title = 'Page Not Found';
});
</script>

<template>
  <div>
    <div :class="$style.wrap">
      <div :class="$style.left">
        <div>ERROR 404</div>
        <h1 :class="$style.status">Page Not Found</h1>
        <div :class="$style.message">
          We can't show the page you wanted to see here. We're sorry about that.
        </div>
        <router-link to="/" :class="$style.link">
          Go to our home page
        </router-link>
      </div>
      <div :class="$style.right">
        <img :src="error404Image" alt="error404" />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.wrap {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.left {
  max-width: 475px;
  padding: 20px;
}

.right {
  padding: 20px;
}

.status {
  margin: 16px 0;
  font-size: 3rem;
  font-weight: 300;
  line-height: 3.5rem;
}

.message {
  margin-bottom: 40px;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 2.25rem;
}

.link {
  text-decoration: none;
  color: #0063b8;
}
</style>
