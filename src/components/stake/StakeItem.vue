<template>
  <el-col id="stake" :span="24">
    <el-col class="stake-main">
      <el-col :span="4"> {{ stk_symbol }} Pool </el-col>
      <el-col :span="2" v-if="locktime > 0">
        <span class="mini-font">{{ $t("lock-time") }}</span>
        <br />
        <span class="num-font">{{ locktime_str }}</span>
      </el-col>
      <el-col :span="3">
        <span class="mini-font">{{ $t("total-staked") }}</span>
        <br />
        <span class="num-font">{{ hformat(lpamount) }}</span>
      </el-col>
      <el-col :span="3">
        <span class="mini-font">APR</span>
        <br />
        <span class="num-font">{{ apy }}%</span>
      </el-col>
      <el-col :span="3">
        <span class="mini-font"> {{ $t("staking") }}</span>
        <br />
        <span class="num-font">{{ hformat(farm_amount) }}</span>
        <span class="num-font" v-if="!isNaN(farm_amount) && farm_amount != 0">
          ({{ hformat((farm_amount * 100) / lpamount) }}%)
        </span>
      </el-col>
      <el-col :span="3">
        <span class="mini-font">{{ $t("earned") }}</span>
        <br />
        <span class="num-font">{{ hformat(earned_amount) }} PBP</span>
      </el-col>
      <el-col :span="4">
        <el-button
          @click="refresh"
          icon="el-icon-refresh"
          class="refresh-btn"
          circle
        ></el-button>
        <el-button @click="fold" :icon="fold_btn" class="fold-btn"></el-button>
      </el-col>
      <el-col v-show="this.fold_col">
        <el-col>
          <el-button
            class="stake-btn"
            v-if="can_withdraw"
            :loading="claim_loading"
            @click="claim"
            >{{ $t("claim") }}
          </el-button>
          <el-button @click="dia_set_amount = true" class="stake-btn">
            {{ $t("deposit") }}
          </el-button>
          <el-button
            v-if="can_withdraw"
            @click="dia_withdraw = true"
            class="stake-btn"
          >
            {{ $t("withdraw") }}
          </el-button>
          <LinkButton
            class="addlp stake-btn"
            v-if="this.isLp"
            :token="this.lptoken[0]"
            :btoken="this.lptoken[1]"
            :onlyLp="true"
          />
          <el-button v-else class="stake-btn">
            <router-link :to="this.toswap">{{ $t("buy") }}</router-link>
          </el-button>
        </el-col>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="dia_set_amount" width="40vw">
      <el-card class="amount-ipt">
        <h2>{{ $t("set-s-amount") }}</h2>
        <p>
          <span>{{ $t("balance") }}：{{ stk_balance }}{{ stk_symbol }}</span>
        </p>
        <el-input v-model="stake_amount" clearable maxlength="20"> </el-input>
        <el-button @click="stake_amount = stk_balance">{{
          $t("all")
        }}</el-button>

        <ApproveButton
          v-if="stk_balance"
          :bsc="bsc"
          :token="stakeAddr"
          :spender="bsc.ctrs.staking.address"
          :min-req="stk_balance_bn"
        >
          <el-button @click="deposit" :loading="dep_loading">{{
            $t("deposit")
          }}</el-button>
        </ApproveButton>
      </el-card>
    </el-dialog>
    <el-dialog :visible.sync="dia_withdraw">
      <el-card class="amount-ipt">
        <h2>{{ $t("withdraw") }}</h2>
        <p>
          <span>{{ $t("balance") }}：{{ farm_amount }} {{ stk_symbol }}</span>
        </p>
        <el-input v-model="withdraw_amount" clearable></el-input>
        <el-button @click="withdraw_amount = farm_amount">{{
          $t("all")
        }}</el-button>
        <el-button
          v-if="withdraw_wait == 0"
          @click="withdraw"
          :loading="w_loading"
          type="primary"
          >{{ $t("withdraw") }}
        </el-button>
        <el-col v-else>
          <p>{{ $t("locked", { time: this.withdraw_wait_str }) }}</p>
          <el-button @click="force_withdraw" :loading="force_w_loading">
            {{ $t("force-w") }}
          </el-button>
        </el-col>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import tokens from "../../tokens";
import { ethers } from "ethers";
import hformat from "human-format";
import ApproveButton from "../lib/ApproveButton.vue";
import { mapState } from "vuex";
import times from "../../times";
import market from "../../market";
import LinkButton from "../lib/LinkButton.vue";
export default {
  name: "Stake",
  components: {
    ApproveButton,
    LinkButton,
  },
  props: ["pid", "stakeAddr", "locktime", "lpamount", "poolreward"],
  computed: mapState({
    bsc: "bsc",
    can_withdraw: function () {
      if (!this.farm_amount) return false;
      if (this.farm_amount == "0.0") return false;
      return true;
    },
  }),
  mounted() {
    this.refresh();
    this.loadLp();
    this.loadLocktime();
    setInterval(this.refresh, 12000);
  },
  beforeUpdate() {
    this.loadLocktime();
  },
  data() {
    return {
      apy: "",
      farm_amount: "",
      earned_amount: "",
      stk_symbol: "-",
      stk_balance: "",
      locktime_str: "",
      stk_balance_bn: 0,
      stake_amount: 0,
      withdraw_amount: 0,
      withdraw_wait: 0,
      withdraw_wait_str: "",
      dia_set_amount: false,
      dia_withdraw: false,
      claim_popover: false,
      dep_loading: false,
      w_loading: false,
      force_w_loading: false,
      claim_loading: false,
      isLp: false,
      lptoken: "",
      toswap: "/Swap",
      fold_btn: "el-icon-arrow-down",
      fold_col: false,
    };
  },
  methods: {
    fold: function () {
      this.fold_col = !this.fold_col;
      if (this.fold_col) {
        this.fold_btn = "el-icon-arrow-up";
      } else {
        this.fold_btn = "el-icon-arrow-down";
      }
    },
    hformat: function (val) {
      if (isNaN(val) || val == "") {
        return "";
      } else if (typeof val == "string") {
        val = parseFloat(val);
      } else {
        val = Number(val);
      }
      if (val >= 1) {
        const value = hformat(val, { separator: "" });
        return value;
      } else if (val > 0 && val < 1) {
        const amount = Math.round(val * Math.pow(10, 6)) / Math.pow(10, 6);
        return amount;
      } else {
        return val;
      }
    },
    loadLp: async function () {
      this.isLp = await tokens.islp(this.stakeAddr);
      if (this.isLp) {
        this.lptoken = await tokens.lptokens(this.stakeAddr);
      }
    },
    loadLocktime: function () {
      this.locktime_str = times.formatD(this.locktime, false);
      this.withdraw_wait_str = times.formatD(this.withdraw_wait, false);
    },
    refresh: async function () {
      const pid = ethers.BigNumber.from(this.pid);
      const stakeAddr = this.stakeAddr;
      const rewardAddr = this.bsc.ctrs.pbp.address;
      this.stk_symbol = await tokens.symbol(stakeAddr);
      this.stk_balance_bn = await tokens.balance(stakeAddr);
      this.stk_balance = await tokens.format(stakeAddr, this.stk_balance_bn);
      const stakeds = await this.bsc.ctrs.staking.staked(pid, this.bsc.addr);
      const staked = stakeds[0];
      this.withdraw_wait = stakeds[1].toNumber();
      this.farm_amount = await tokens.format(stakeAddr, staked);
      const earnval = await this.bsc.ctrs.staking.earned(pid, this.bsc.addr);
      this.earned_amount = await tokens.format(rewardAddr, earnval);
      const ap = (this.poolreward * 365 * 86400 * 100) / this.lpamount;
      this.apy = ap.toFixed(4);
    },
    withdraw: async function () {
      this.w_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        const obj = this;
        try {
          const receipt = await this.bsc.ctrs.staking.withdraw(
            this.pid,
            amount
          );
          await market.waitEventDone(receipt, function (e) {
            obj.w_loading = false;
            obj.dia_withdraw = false;
            obj.refresh();
          });
        } catch (e) {
          this.w_loading = false;
        }
      }
    },
    force_withdraw: async function () {
      this.force_w_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        try {
          const receipt = await this.bsc.ctrs.staking.forceWithdraw(
            this.pid,
            amount
          );
          await market.waitEventDone(receipt, function (e) {
            obj.force_w_loading = false;
            obj.refresh();
          });
        } catch (e) {
          this.force_w_loading = false;
          console.log("force withdraw err", e);
        }
      }
    },
    claim: async function () {
      this.claim_loading = true;
      const obj = this;
      let receipt = false;
      try {
        const amount = ethers.BigNumber.from(0);
        if (this.withdraw_wait == 0) {
          receipt = await this.bsc.ctrs.staking.withdraw(this.pid, amount);
        } else {
          const resp = await this.$confirm(
            this.$t("locked2"),
            this.$t("locked1", { time: this.withdraw_wait_str }),
            {
              confirmButtonText: this.$t("sure"),
              cancelButtonText: this.$t("cancel"),
              type: "warning",
            }
          );
          console.log("resp", resp);
          receipt = await this.bsc.ctrs.staking.forceWithdraw(this.pid, amount);

          await market.waitEventDone(receipt, function (e) {
            obj.claim_loading = false;
          });
        }
      } catch (e) {
        this.claim_loading = false;
        if (e == "cancel") {
          // nothing need to do here
        } else if ("data" in e) {
          if ("code" in e.data) {
            if (e.data.code == 3) {
              // should be "still in lock time"
            }
          }
        }
      }
    },
    deposit: async function () {
      this.dep_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.stake_amount);
      if (amount.gt(0) && amount.lte(this.stk_balance_bn)) {
        try {
          const obj = this;
          const receipt = await this.bsc.ctrs.staking.deposit(this.pid, amount);
          await market.waitEventDone(receipt, function () {
            obj.dep_loading = false;
            obj.dia_set_amount = false;
            obj.refresh();
          });
        } catch (e) {
          this.dep_loading = false;
          console.log("deposit in stake err", e);
        }
      } else {
        console.log("Invalid amount", amount);
      }
    },
  },
};
</script>
<style scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1800deg);
  }
}
.fold-btn {
  padding: 5px;
  font-size: 24px;
  color: #38f2af;
  background: #373943;
  border: none;
}
.fold-btn:hover,
.fold-btn:focus {
  color: #68bb68;
  background: #373943;
}
.mini-font {
  font-size: 10px;
  color: #c0c2c0;
}
.stake-btn {
  width: 80px;
  margin: 10px 5px;
  color: #373943;
}
.stake-btn a {
  color: #373943;
}
.stake-btn a:hover {
  color: #686b68;
}
#stake .refresh-btn {
  color: #38f2af;
  background: #373943;
  border: none;
  font-size: 24px;
}
#stake .refresh-btn.el-button:hover {
  color: #fff;
  animation: rotate ease-in-out 1s;
}
.stake-main {
  background-color: #373943;
  border: 1px solid #505850;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 20px;
  position: relative;
}
.amount-ipt .el-input {
  width: 50%;
  min-width: 200px;
  margin: 10px;
}
h2 {
  text-align: center;
}
</style>
