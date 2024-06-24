<template>
  <div class="home-container">
    <h1>This is Home Page</h1>
  </div>
  <router-link :to="{ name: 'About'}">about</router-link>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      loading: false,
    };
  },
  created() {
    // 注册home页物理返回键
  },
  methods: {
   
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: #ddd;
}
</style>
