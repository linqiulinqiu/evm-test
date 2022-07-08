<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <h2>最终大奖</h2>
        <h5>谁能百里挑一？</h5>
        <h1>
          <span class="font_color">{{ bonus_pool }}</span> BNB
        </h1>
        <p>
          倒计时: <span>{{ countdown }}</span>
        </p>
        <p>
          总票证数： <span>{{ total_tickets }}</span>
        </p>
      </el-col>
    </el-col>
    <el-col>
      <GameMsg />
    </el-col>
  </el-col>
</template>
<script>
import GameMsg from "./game/GameMsg.vue";
export default {
  name: "gameMsg",
  components: {
    GameMsg,
  },
  data() {
    return {
      bonus_pool: "未开始",
      countdown: "未开始",
      total_tickets: "未开始",
    };
  },
  mounted: function () {
    this.load_data();
  },
  methods: {
    load_data: async function () {
      console.log("load all data");
    },
  },
};
</script>
<style>
.pool {
  /* text-align: center; */
  border: 1px solid #fff;
  border-radius: 20px;
  padding: 40px;
  background: rgba(55, 57, 67, 1);
}
#gamemain {
  text-align: center;
  padding-top: 75px;
}
.font_color {
  color: #38f2af;
}
</style>