<template>
  <el-row type="flex" justify="space-bewteen">
    <el-col :sapn="8">
      <el-empty :description="this.$t('img')"></el-empty>
    </el-col>
    <el-col :span="13">
      <p>
        {{ $t("price") }} :&nbsp;
        <span>{{ this.mintFee.price }}</span>
        &nbsp;
        <span>{{ this.mintFee.token }}</span>
      </p>
      <p>
        <span>{{ $t("mintable") }} &nbsp;{{ mintAbles }}</span>
      </p>
      <p>
        <ApproveButton
          :bsc="bsc"
          :token="mintFee.tokenAddr"
          :spender="bsc.ctrs.pbp.address"
          :minReq="balance"
        >
          <el-button
            @click="mintNFT"
            type="primary"
            v-if="this.mintAbles > 0"
            :loading="mint_loading"
            >{{ $t("mintPBT") }}</el-button
          >
          <span v-else>{{ $t("none") }}</span>
        </ApproveButton>
      </p>
    </el-col>
  </el-row>
</template>
<script>
import market from "../../market";
import ApproveButton from "../lib/ApproveButton.vue";
import { mapState } from "vuex";
import tokens from "../../tokens";
export default {
  name: "MintPBT",
  props: ["mintAbles", "mintFee", "showMint"],
  components: {
    ApproveButton,
  },
  computed: mapState({
    bsc: "bsc",
  }),
  data() {
    return {
      mint_loading: false,
      balance: "",
    };
  },
  mounted() {
    this.getBalance();
  },
  methods: {
    getBalance: async function () {
      this.balance = await tokens.balance(this.mintFee.tokenAddr);
    },
    mintNFT: async function () {
      this.mint_loading = true;
      try {
        const obj = this;
        const res = await market.mintPBT();
        await market.waitEventDone(res, async function (evt) {
          obj.mint_loading = false;
          obj.showMint();
        });
      } catch (e) {
        if('code' in e){
            this.mint_loading = false;
            if(e.code==-32603){
                this.$message.error(this.$t('insufficient-mint-balance',this.mintFee))
            }
        }
        console.log('mint err', e)
      }
    },
  },
};
</script>
