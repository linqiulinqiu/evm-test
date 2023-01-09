<template>
  <el-container>
    <el-main>
      <el-col>
        <h3>About PBP</h3>
        <p>在这里对PBP进行简单的介绍：</p>
        <p>PBP的作用</p>
        <p>PBP的发行规则</p>
        <p>PBP的价值保障，包括回购和销毁规则以及锁定规则</p>
      </el-col>
      <hr>
      <el-col v-if="bsc.addr">
        <p>PBP当前发行状态</p>
        <PBPInfoMain />
      </el-col>
      <el-col v-else>
          Connect wallet for a list of PBP buy-back and burn history.
      </el-col>
    </el-main>
  </el-container>
</template>
<script>
import PBPInfoMain from "../components/PBPInfoMain.vue";
import { mapState } from "vuex";
export default {
  name: "PBPToken",
  components: {
    PBPInfoMain,
  },
  computed: mapState({
    bsc: "bsc",
  }),
};
</script>
<style>
</style>