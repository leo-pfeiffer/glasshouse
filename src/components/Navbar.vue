<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="../">
          <img :src="require('@/assets/' + logo + '')" alt="Logo">
        </a>
        <span class="navbar-burger burger" data-target="navbarMenu" role="button" aria-label="menu"
          :class="{'is-active': navbarBurgerActive}" v-on:click="toggleNavbar"
        >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
        </span>
      </div>
      <div id="navbarMenu" class="navbar-menu"
           :class="{'is-active': navbarMenuActive}">
        <div class="navbar-end">
          <a class="navbar-item is-active" href="https://leopold.page">
            Home
          </a>
          <a class="navbar-item" href="https://github.com/leo-pfeiffer">
            GitHub
          </a>
          <a class="navbar-item" href="https://linkedin.com/in/leopoldpfeiffer">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    logo: String
  },
  data() {
    return {
      navbarBurgerActive: false,
      navbarMenuActive: false
    }
  },
  methods: {
    toggleNavbar: function() {
      this.navbarMenuActive = !this.navbarMenuActive;
      this.navbarBurgerActive = !this.navbarBurgerActive;
    }
  }
}
</script>

<style scoped>
.navbar.is-white {
  background: #F0F2F4;
}
.navbar-brand .brand-text {
  font-size: 1.11rem;
  font-weight: bold;
}
</style>