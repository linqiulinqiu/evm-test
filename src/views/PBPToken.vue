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
      <hr></hr>
      <el-col>
        <p>PBP的销毁记录</p>
        <BurnMain v-if="bsc.addr" />
        <p v-else>
            Connect wallet for a list of PBP buy-back and burn history.
        </p>
      </el-col>
    </el-main>
  </el-container>
</template>
<script>
import BurnMain from "../components/BurnMain.vue";
import { mapState } from "vuex";
export default {
  name: "PBPToken",
  components: {
    BurnMain,
  },
  computed: mapState({
    bsc: "bsc",
  }),
};
</script>
<style>
</style>