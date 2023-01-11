<template>
  <el-container>
    <el-main class="pbptoken">
      <el-col class="token-info" :span="20" :offset="2">
        <el-col :span="5" :offset="1" :xs="{ offset: 0 }">
          <h1>PBP</h1>
          <h3>PlotBridge Point</h3>
        </el-col>
        <el-col :span="18">
          <p>在这里对PBP进行简单的介绍：</p>
          <p>PBP的作用</p>
          <p>PBP的发行规则</p>
          <p>PBP的价值保障，包括回购和销毁规则以及锁定规则</p></el-col
        >
      </el-col>
      <el-col v-if="bsc.addr" :span="20" :offset="2">
        <PBPInfoMain />
      </el-col>
      <el-col class="text-center" v-else>
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
<style scoped>
.el-main {
  font-size: 14px;
}
.token-info {
  margin-top: 20px;
  background-color: #373943d5;
  border-radius: 10px;
  padding: 20px 5px;
}
.line {
  margin: 15px auto;
}
.text-center {
  text-align: center;
}
</style>>
</style>