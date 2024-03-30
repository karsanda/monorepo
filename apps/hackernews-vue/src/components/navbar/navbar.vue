<template>
  <nav class="navbar">
    <router-link to="/" data-page="topstories">
      <h1 class="title">Hacker News - Vue</h1>
    </router-link>
    <router-link to="/newstories" class="navlink" data-page="newstories">
      New
    </router-link>
    <router-link to="/beststories" class="navlink" data-page="beststories">
      Best
    </router-link>
    <router-link to="/askstories" class="navlink" data-page="askstories">
      Ask
    </router-link>
    <router-link to="/showstories" class="navlink" data-page="showstories">
      Show
    </router-link>
    <router-link to="/jobstories" class="navlink" data-page="jobstories">
      Jobs
    </router-link>
  </nav>
</template>

<style scoped>
  .navbar {
    display: flex;
    align-items: center;
    line-height: 1em;
  }

  .title {
    color: var(--primary-color);
    font-size: 14px;
    margin-right: 10px;
    font-weight: 600;
  }

  .navlink {
    color: var(--white);
    padding: 0 8px;
    font-weight: 400;
    height: 14px;
  }

  .navlink.router-link-exact-active {
    font-weight: 600;
  }

  @media only screen and (max-width: 400px) {
    .title {
      font-size: 14px;
    }

    .navlink {
      font-size: 12px;
      padding: 0 7px;
      height: 12px;
    }
  }

  @media only screen and (max-width: 360px) {
    .title {
      font-size: 13px;
      margin-right: 7px;
    }
  }
</style>
