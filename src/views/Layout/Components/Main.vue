<template>
  <div id="main-wrap">
    <div class="mian-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "main-wrap"
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
  height: 100vh;
  // position: fixed;
  // top: 75px;
  // left: $navMenu;
  // right: 0;
  // bottom: 0;
  // border: 30px solid #f7f7f7;
  // border-bottom: none;
  // -webkit-box-sizing: border;
}
.mian-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  background-color: #f7f7f7;
  @include webkit(transition, all 0.3s ease 0s);
  @include webkit(box-sizing, border-box);
}
.open {
  .mian-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .mian-content {
    padding-left: $navMenuMin + 30;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-left: 30px;
  @include webkit(box-sizing, border-box);
  background-color: #fff;
}
</style>