<template>
  <el-col>
    <el-col>
      <h4>PBP发行量</h4>
      <ul>
        <li>合约地址：<a target="_blank" :href="tokenUrl()">{{ pbpAddress }}</a></li>
        <li>当前发行总量：{{totalSupply}}</li>
      </ul>
    </el-col>
    <el-col>
      销毁历史
      <el-table strip border>
      </el-table>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import { ethers } from "ethers";
import tokens from "../tokens";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: "PBPInfoMain",
  components: {
  },
  computed: mapState({
    bsc: "bsc",
  }),
  mounted() {
    this.loadInfo()
  },
  data() {
    return {
      pbpAddress: '-',
      totalSupply: '-',
      burns: [],
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
      console.log('loading PBP-info')
      const ctr = this.bsc.ctrs['pbp']
      this.pbpAddress = ctr.address
      await sleep(500)
      this.totalSupply = await tokens.format(this.pbpAddress,await tokens.supply(this.pbpAddress))
      const teamAddr = '0xfeea9cd0da8279ce0f208fdeee2355062621254f'
      await sleep(500)
      const burnEnd = await this.bsc.provider.getBlockNumber()
      var burnBegin = 18134388  // first burn at this block height
      const filterBurn = ctr.filters.Transfer(teamAddr,ethers.constants.AddressZero)
      const burns = []
      while(burnBegin<burnEnd){
        const events = await ctr.queryFilter(filterBurn, burnBegin, Math.min(burnEnd, burnBegin+500))
        console.log('events', events)
        burns.push(...events)
        await sleep(1000)
      }
      console.log('burns=', burns)
    },
  },
};
</script>
<style>

</style>
