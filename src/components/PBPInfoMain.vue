<template>
  <el-col>
    <el-col>
      <h4>PBP发行量</h4>
      <ul>
        <li>合约地址：<a target="_blank" :href="tokenUrl()">{{ pbpAddress }}</a></li>
        <li>当前发行总量：<RichNumber :data="totalSupply"></RichNumber></li>
        <li>官方销毁总量：<RichNumber :data="totalBurnt"></RichNumber></li>
      </ul>
    </el-col>
    <el-col>
      销毁历史
      <p v-if="burns.length==0">
        Loading
      </p>
      <el-table strip border v-else :data="burns">
        <el-table-column prop="time" label="Burn Time"></el-table-column>
        <el-table-column prop="amount" label="PBP Amount"></el-table-column>
        <el-table-column prop="txid" label="TX"></el-table-column> 
        <el-table-column prop="url" label="Link"></el-table-column>
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: "PBPInfoMain",
  components: {
    RichNumber
  },
  computed: mapState({
    bsc: "bsc",
    burns: function (){
      const res = []
      for(var i in recBurns.burns){
        const burn = recBurns.burns[i]
        res.push({
          amount: ethers.utils.formatUnits(burn.args[2],'gwei'),  // TODO: gwei 刚好对应PBP的decimals，不可用于其它Token
          time: (new Date(burn.timestamp*1000)).toLocaleDateString('zh-CN'),  // TODO: 应从系统locale读取
          txid: burn.transactionHash,
          url: `https://bscscan.com/tx/${burn.transactionHash}`
        })
      }
      return res
    }
  }),
  mounted() {
    this.loadInfo()
  },
  data() {
    return {
      pbpAddress: '-',
      totalSupply: '-',
      totalBurnt: '-'
    };
  },
  methods: {
    tokenUrl: function (){
      if(this.pbpAddress.length>1){
        return 'https://bscscan.com/token/'+this.pbpAddress
      }
      return '#';
    },
    loadInfo: async function () {
      const ctr = this.bsc.ctrs['pbp']
      this.pbpAddress = ctr.address
      this.totalSupply = await tokens.format(this.pbpAddress,await tokens.supply(this.pbpAddress))
      var totalBurnt = ethers.BigNumber.from(0)
      for(var i in recBurns.burns){
        const burn = recBurns.burns[i]
        totalBurnt = totalBurnt.add(burn.args[2])
      }
      this.totalBurnt = ethers.utils.formatUnits(totalBurnt,'gwei')
    },
  },
};
</script>
<style>

</style>
