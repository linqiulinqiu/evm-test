<template>
  <el-aside id="selectCoin" :width="foldStyle.width" style="padding: 10px">
    <el-col v-if="!foldStyle.isFold">
      <p>{{ $t("select-coin") }}</p>
      <ul>
        <li
          v-for="item in this.coinMap"
          :key="item.symbol"
          @click="changeCoin(item)"
          class="coinTypes"
          :class="{ isselect: item.index == addclass }"
        >
          {{ item.name }}
        </li>
      </ul>
    </el-col>
    <el-col class="b-fold">
      <FoldButton
        v-model="foldStyle"
        :openWidth="'120px'"
        @fold="fold($event)"
        style="right: 0"
      />
    </el-col>
  </el-aside>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import tokens from "../../tokens";
import pbw from "pbwallet";
import FoldButton from "../lib/FoldButton.vue";
export default {
  components: {
    FoldButton,
  },
  computed: mapState({
    bsc: "bsc",
    current: "current",
    addclass: function (state) {
      if (state.current.coinType) return state.current.coinType;
    },
  }),
  mounted() {
    this.loadcoin();
  },
  data() {
    return {
      coinMap: {},
      foldStyle: {
        width: "120px",
        isFold: false,
      },
    };
  },
  methods: {
    changeCoin: async function (item) {
      this.$store.commit("setCurrentCoinType", item.index);
      const balance = await market.loadBalance(item.index);
      const wBalance = this.$store.state.WBalance;
      wBalance[item.index] = balance;
      this.$store.commit("setWBalance", wBalance);
    },
    loadcoin: function () {
      this.coinMap = market.loadCoinlist();
    },
    fold: function ($event) {
      // console.log("fold function", $event);
    },
  },
};
</script>
<style>
#selectCoin {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  position: relative;
}
#selectCoin > p {
  color: #fff;
}
.b-fold {
  position: relative;
  margin-bottom: 30px;
  left: 10px;
}
.isselect {
  border: #38f2af 1px solid !important;
  color: #38f2af;
}
.coinTypes {
  width: 96%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 5px;
  border: #668b66 1px solid;
  margin: 10px auto;
  cursor: pointer;
}
</style>