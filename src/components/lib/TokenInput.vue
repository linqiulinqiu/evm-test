<template>
  <el-col>
    <p>
      {{ title }}
      <span class="clearfix"> {{ $t("balance") }}: {{ balance }} </span>
    </p>
    <el-input type="text" v-model="amount" maxlength="20" class="amount-ipt">
      <el-button slot="append" @click="max">
        {{ $t("all") }}
      </el-button>
    </el-input>
    <el-select
      v-model="addr"
      @change="selChanged"
      :placeholder="this.$t('select')"
    >
      <el-option
        v-for="w in coinList"
        :key="w.address"
        :label="w.bsymbol"
        :value="w.address"
        :disabled="w.address == banCoin"
      >
      </el-option>
    </el-select>
  </el-col>
</template>
<script>
import debounce from "lodash/debounce";
import tokens from "../../tokens";

export default {
  name: "TokenInput",
  props: ["title", "coinList", "banCoin", "value"],
  data() {
    return {
      balance: "",
      addr: this.value.addr,
      amount: "",
    };
  },
  watch: {
    addr: async function (newa, olda) {
      if (newa && newa != olda) {
        await this.updateBalance();
      }
    },
    amount: debounce(async function (newa, olda) {
      const num = await tokens.format(this.value.addr, this.value.amount);
      if (newa != num) {
        // input change, not by set from upper level
        await this.inputChanged();
      }
    }, 1000),
    value: async function (newv, oldv) {
      this.addr = newv.addr;
      if (newv.lastEdit < newv.lastSet) {
        if (newv.amount.gt(0)) {
          this.amount = await tokens.format(newv.addr, newv.amount);
        } else {
          this.amount = "";
        }
      }
      if (newv.isSwap) {
        await this.updateBalance();
      }
    },
    deep: true,
  },
  methods: {
    inputChanged: async function () {
      const info = Object.assign({}, this.value);
      info.amount = await this.updateAmount();
      info.lastEdit = Date.now();
      info.isSwap = false;
      this.$emit("input", info);
    },
    selChanged: async function () {
      const info = Object.assign({}, this.value);
      info.addr = this.addr;
      if (info.lastEdit > info.lastSet) {
        // for active bar, estimate the other side
        info.lastEdit = Date.now();
      } else {
        // else: for passive bar, estimate this side
        this.amount = "";
        info.lastSet = 0;
      }
      info.amount = await this.updateAmount();
      this.$emit("input", info);
    },
    updateAmount: async function () {
      if (isNaN(this.amount)) {
        return false;
      } else if (this.addr) {
        return await tokens.parse(this.addr, this.amount);
      } else {
        return false;
      }
    },
    updateBalance: async function () {
      const coinBalance = await tokens.balance(this.addr);
      this.balance = await tokens.format(this.addr, coinBalance);
    },
    max: function () {
      this.amount = this.balance;
    },
  },
};
</script>
<style>
.clearfix {
  margin-left: 10px;
}
.amount-ipt.el-input {
  width: 70%;
  margin-right: 5px;
  margin-bottom: 5px;
  min-width: 200px;
}
#swapmain .el-select {
  width: 160px;
}
.swap-input {
  padding: 30px 30px;
  border-radius: 20px;
  margin-top: 25px;
  background-color: rgba(43, 44, 51, 0.8);
}
</style>
