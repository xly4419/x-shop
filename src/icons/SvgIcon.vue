<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
import { ref, computed } from "@vue/composition-api";
export default {
  name: "svgIcon",
  props: {
    iconClass: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    // console.log(props.iconClass);
    //计算属性 得出最终结果
    const iconName = computed(() => `#icon-${props.iconClass}`);
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      } else {
        return `svg-icon`;
      }
    });
    return {
      iconName,
      svgClass
    };
  }
};
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  fill: currentColor;
}
</style>