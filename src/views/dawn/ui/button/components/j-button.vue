<template>
  <button class="j-button" 
    :class="[{'is-plain': plain}, typeClass, sizeClass]">
    <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    plain: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {

    };
  },
  computed: {
    typeClass () {
      if (this.type !== 'default') {
        return 'j-button--' + this.type;
      } else {
        return '';
      }
    },
    sizeClass () {
      return 'j-button--' + this.size;
    }
  }
};
</script>

<style lang="scss" scoped>
  @mixin btn-fake-base($color: red, $width: 6px, $height: 6px) {
    content: '';
    display: block;
    width: $width;
    height: $height;
    position: absolute;
    border: 1px solid transparent;
    transition: width 0.5s ease-in .1s, height 0.5s ease-in .1s;
  }
  $base: #ffffff;
  $primary: #1890ff;
  $warning: orange;
  $danger: red;
  .j-button {
    position: relative;
    margin-right: 10px;
    font-size: 14px;
    height: 32px;
    padding: 0 15px;
    // border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
    background: #fff;
    color: #fff;
    border: 1px solid #d9d9d9;
    outline: none;
    &::before {
      @include btn-fake-base();
      top: 2px;
      left: 2px;
      border-top: 1px solid #0939c1;
      border-left: 1px solid #0939c1;
    }
    &::after {
      @include btn-fake-base();
      right: 2px;
      bottom: 2px;
      border-right: 1px solid #0939c1;
      border-bottom: 1px solid #0939c1;
    }
    &:hover {
      border: 1px solid #0939c1 !important;
      &::before {
        @include btn-fake-base(#0939c1, calc(100% - 4px), calc(100% - 4px));
        border-top: 1px solid #0939c1;
        border-left: 1px solid #0939c1;
      }
      &::after {
        @include btn-fake-base(#0939c1, calc(100% - 4px), calc(100% - 4px));
        border-right: 1px solid #0939c1;
        border-bottom: 1px solid #0939c1;
        border-radius: inherit;
      }
    }
    &:focus {
      
    }
    &--small {
      height: 24px;
    }
    &--primary {
      background: $primary;
    }
    &--primary.is-plain {
      color: $primary;
      background: transparent;
      border-color: #b3d8ff;
    }
    &--warning {
      background: $warning;
    }
    &--warning.is-plain {
      color: $warning;
      background: transparent;
      border-color: #f5dab1;
    }
    &--danger {
      background: $danger;
    }
    &--danger.is-plain {
      color: $danger;
      background: transparent;
      border-color: #fbc4c4;
    }
  }
  .button-3d-1{
    position: relative;
    background: orangered;
    border: none;
    color: white;
    padding: 15px 24px;
    font-size: 1.4rem;
    outline: none;
    box-shadow: -6px 6px 0 hsl(16, 100%, 30%);
    &::before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      top: 0;
      left: -6px;
      border: 6px solid transparent;
      border-right: 6px solid hsl(16, 100%, 30%);
      border-left-width: 0px;
    }
    &::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      bottom: -6px;
      right: 0;
      border: 6px solid transparent;
      border-top: 6px solid hsl(16, 100%, 30%);
      border-bottom-width: 0px;
    }
    &:active {
      background: hsl(16, 100%, 40%);
      top: 3px;
      left: -3px;
      box-shadow: -3px 3px 0 hsl(16, 100%, 30%);
    }
  }
</style>