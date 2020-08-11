<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuStatus">
      <svg-icon iconClass="menu" class="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">{{ username }}</div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" class="exit"></svg-icon>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
  name: "Header",
  setup(props, { root }) {
    //数据区
    /**
     * 函数区
     */
    const navMenuStatus = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    const username = computed(() => root.$store.state.app.username);
    const exit = () => {
      root.$store.dispatch("app/exit").then(() => {
        root.$router.push({
          name: "Login",
        })
      });
    };
    return {
      navMenuStatus,
      username,
      exit
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  height: 75px;
  left: $navMenu;
  right: 0;
  top: 0;
  background-color: #fff;
  line-height: 75px;
  @include webkit(transition, all 0.3s ease 0s);
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
}
</style>