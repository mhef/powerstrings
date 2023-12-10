<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="logo">
      <img src="@/assets/img/logo-dark.png">
    </div>
    <div class="github">
      ⭐️   If you like PowerStrings, give it a star on
      <a
        href="https://github.com/mhef/powerstrings"
        target="_blank"
      >GitHub</a>!   ⭐️
    </div>
  </header>
  <main>
    <div class="hero-container">
      <div class="hero">
        With PowerStrings you can easily <span>manipulate</span>, <span>transform</span> and <span>format</span> texts ⚡️🛠️
      </div>
    </div>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
@import "@/assets/css/abstracts/theme.scss";
@import "@/assets/css/abstracts/variables.scss";

header {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: $jet;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px 30px;

  .logo {
    flex-shrink: 0;
    height: 65px;
    img {
      height: 65px;
    }
  }
}

main {
  padding-top: 100px;

  .hero-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;

    @media (max-width: map-get($breakpoints, "lg")) {
      margin-bottom: 10px;
    }

    .hero {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      padding: 30px 50px;
      color: $platinum;

      @media (max-width: map-get($breakpoints, "lg")) {
        font-size: 1.5rem;
      }

      span {
        color: $verdigris;
      }
    }
  }
}
</style>
