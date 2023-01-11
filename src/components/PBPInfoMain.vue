<template>
  <el-col>
    <el-col>
      <ul>
        <li>
          合约地址：<a target="_blank" :href="tokenUrl()">{{ pbpAddress }}</a>
        </li>
        <li>当前发行总量：<RichNumber :data="totalSupply"></RichNumber></li>
        <li>官方销毁总量：<RichNumber :data="totalBurnt"></RichNumber></li>
      </ul>
    </el-col>
    <el-col>
      <p v-if="burns.length == 0">Loading</p>
      <el-table strip v-else :data="burns" style="width: 100%">
        <el-table-column label="withdraw history">
          <el-table-column
            width="120"
            prop="time"
            label="Burn Time"
          ></el-table-column>
          <el-table-column label="PBP Amount">
            <template slot-scope="scope">
              <RichNumber :data="scope.row.amount"></RichNumber>
            </template>
          </el-table-column>
          <el-table-column label="TX">
            <template slot-scope="scope">
              <p>{{ scope.row.txid }} <LinkIcon :url="scope.row.url" /></p>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import { ethers } from "ethers";
import tokens from "../tokens";
import recBurns from "../rec-burns.json";
import RichNumber from "./lib/RichNumber.vue";
import LinkIcon from "./lib/LinIcon.vue";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  name: "PBPInfoMain",
  components: {
    RichNumber,
    LinkIcon,
  },
  computed: mapState({
    bsc: "bsc",
    burns: function () {
      const res = [];
      for (var i in recBurns.burns) {
        const burn = recBurns.burns[i];
        console.log("burn=", burn);
        res.push({
          amount: ethers.utils.formatUnits(burn.args[2], "gwei"), // TODO: gwei 刚好对应PBP的decimals，不可用于其它Token
          time: new Date(burn.timestamp * 1000).toLocaleDateString("zh-CN"), // TODO: 应从系统locale读取
          txid: burn.transactionHash,
          url: `https://bscscan.com/tx/${burn.transactionHash}`,
        });
      }
      return res;
    },
  }),
  mounted() {
    this.loadInfo();
  },
  data() {
    return {
      pbpAddress: "-",
      totalSupply: "-",
      totalBurnt: "-",
    };
  },
  methods: {
    tokenUrl: function () {
      if (this.pbpAddress.length > 1) {
        return "https://bscscan.com/token/" + this.pbpAddress;
      }
      return "#";
    },
    loadInfo: async function () {
      const ctr = this.bsc.ctrs["pbp"];
      this.pbpAddress = ctr.address;
      this.totalSupply = await tokens.format(
        this.pbpAddress,
        await tokens.supply(this.pbpAddress)
      );
      var totalBurnt = ethers.BigNumber.from(0);
      for (var i in recBurns.burns) {
        const burn = recBurns.burns[i];
        totalBurnt = totalBurnt.add(burn.args[2]);
      }
      this.totalBurnt = ethers.utils.formatUnits(totalBurnt, "gwei");
    },
  },
};
</script>
<style scoped>
.el-table {
  text-align: center;
}
</style>>
</style>
