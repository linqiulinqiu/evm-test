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
      <p v-if="burns.length==0">
        Loading
      </p>
      <el-table strip border v-else>
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
      const checkStep = 2000
      while(burnBegin<burnEnd){
        const stepEnd = Math.min(burnEnd, burnBegin+checkStep-1)
        console.log('burn-begin,end=', burnBegin, stepEnd, burnEnd)
        const events = await ctr.queryFilter(filterBurn, burnBegin, stepEnd)
        //TODO: make sure events are in older-first order
        console.log('events=', burnBegin, burnEnd, events)
        for(var i in events){
          burns.push(events[i].args)
        }
        await sleep(500)
        burnBegin += checkStep
      }
      console.log('burns=', burns)
    },
  },
};
</script>
<style>

</style>
