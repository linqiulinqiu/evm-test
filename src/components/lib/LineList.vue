<template>
  <p>
    <span>
      <p v-for="li in this.list" :key="li">
        {{ li }}
      </p>
    </span>
  </p>
</template>
<script>
export default {
  props: ["list"],
};
</script>