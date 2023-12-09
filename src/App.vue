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
    <div class="hero">
      With PowerStrings you can easily&nbsp;<span>manipulate</span>,&nbsp;<span>transform</span>&nbsp;and&nbsp;<span>format</span>&nbsp;texts 🛠️
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
  height: 75px;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    height: 100%;
    img {
      height: 100%;
    }
  }
}

main {
  padding-top: 100px;

  .hero {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    padding: 30px 50px;
    color: $platinum;
    margin-bottom: 25px;

    span {
      color: $verdigris;
    }
  }
}
</style>
