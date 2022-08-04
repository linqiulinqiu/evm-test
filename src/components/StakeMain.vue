<template>
  <el-col v-if="working" :span="20" :offset="2">
    <p v-if="time_msg">{{ $t("stake-start") }}：{{ time_msg }}</p>
    <ul v-if="stakeTokens.length" class="stake-list">
      <li v-for="item in this.stakeTokens" :key="item.pid">
        <el-col class="stakeitem" :sapn="20">
          <StakeItem
            :stakeAddr="item.stakeAddr"
            :pid="item.pid"
            :lpamount="item.lpamount"
            :poolreward="item.reward_speed"
            :locktime="item.locktime"
            :key="item.pid"
          />
        </el-col>
      </li>
    </ul>
    <p v-else>{{ $t("data") }}</p>
  </el-col>
  <el-col v-else class="not-work" :span="10" :offset="7">
    <h2>{{ $t("not-start") }}</h2>
  </el-col>
</template>
<script>
import StakeItem from "./stake/StakeItem.vue";
import { mapState } from "vuex";
import swap from "../swap";
import tokens from "../tokens";
import times from "../times";
export default {
  name: "StakeMain",
  components: {
    StakeItem,
  },
  computed: mapState({
    bsc: "bsc",
  }),
  mounted() {
    this.startTime();
    this.refresh();
  },
  beforeUpdate() {
    this.startTime();
  },
  data() {
    return {
      stakeTokens: [],
      time_msg: "",
      total_alloc: 1,
      working: true,
    };
  },
  methods: {
    startTime: async function () {
      const time_start = await this.bsc.ctrs.pbp.stakeStart();
      this.time_msg = times.formatRelTS(time_start);
    },
    refresh: async function () {
      const pools = await this.bsc.ctrs.staking.pools();
      const stk = [];
      let total_alloc = 0;
      const now = Math.floor(Date.now() / 1000);
      const reward_speed_a = await this.bsc.ctrs.pbp.stakeRewardIn(
        now,
        now + 1
      );
      const reward_speed = parseFloat(
        await tokens.format(this.bsc.ctrs.pbp.address, reward_speed_a)
      );
      for (let i in pools[0]) {
        const lpamount = await tokens.format(pools[0][i], pools[2][i]);
        stk.push({
          stakeAddr: pools[0][i],
          pid: i,
          alloc: pools[1][i].toNumber(),
          lpamount: lpamount,
          locktime: pools[4][i].toNumber(),
        });
        total_alloc += pools[1][i].toNumber();
      }
      for (let i in stk) {
        const price = await swap.price(this.bsc, stk[i].stakeAddr);
        stk[i].reward_speed =
          (stk[i].alloc * reward_speed) / price / total_alloc;
      }
      this.stakeTokens = stk;
    },
  },
};
</script>
<style>
/* .stake-list li {
  background-color: #373943;
  border: 1px solid #505850;
  padding: 20px;
  box-sizing: border-box;
  position: relative; 
  min-height: 170px;
}
.stake-list li:first-child {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.stake-list li:last-child {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
} */
.stakeitem {
  font-size: 16px;
}
.not-work {
  background: #373943;
  border-radius: 20px;
  text-align: center;
  margin-top: 100px;
  padding: 50px;
}
</style>
