<template>
  <el-col>
    <el-col>
      Plan of PBP burn
    </el-col>
    <el-col>
      History of PBP burn
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "BurnMain",
  components: {
  },
  computed: mapState({
    bsc: "bsc",
  }),
  mounted() {
  },
  data() {
    return {
      burns: [],
    };
  },
  methods: {
    loadEvents: async function () {
      const events = [];
    },
  },
};
</script>
<style>

</style>
