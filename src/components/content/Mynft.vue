<template>
  <el-aside :width="asideStyle.width" id="mynft">
    <FoldButton
      v-model="asideStyle"
      :openWidth="'290px'"
      @fold="fold($event)"
      style="top: 0px"
      class="f-btn"
    />
    <el-col v-if="!this.asideStyle.isFold">
      <el-col class="my-title">
        {{ $t("my-nfts") }}
        <el-button
          @click="getMintfee"
          size="small"
          class="btn"
          v-if="bsc.addr"
          type="primary"
          :loading="open_loading"
          >{{ $t("mintPBT") }}
        </el-button>
      </el-col>
      <el-col>
        <el-col v-if="Object.keys(this.myList).length > 0" class="nftarea">
          <el-col class="nftlist">
            <MylistPage
              v-bind:nftlist="nftlist"
              v-bind:open="openNFT"
              v-bind:current="current"
            />
          </el-col>
          <el-col class="btn-bar">
            <el-pagination
              background
              small
              :total="Object.keys(this.myList).length"
              layout="prev,pager,next"
              @current-change="handleCurrentChange"
              :current-page="this.pageNum"
              :page-size="this.pageSize"
              :pager-count="5"
            ></el-pagination>
          </el-col>
        </el-col>
        <el-col v-else-if="loadDone.includes('p')" class="content">
          <el-col>
            {{ $t("no-nft") }}
          </el-col>
        </el-col>
        <el-col v-else>
          {{ $t("data") }}
        </el-col>
      </el-col>
      <el-col class="bottom-box" v-if="isMarket">
        <router-link class="bottom" :to="this.market"
          >{{ $t("to-market") }}
        </router-link>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="mintVisible">
      <el-card>
        <MintPBT
          :mintAbles="this.mintNumber"
          :mintFee="this.mintFee"
          :showMint="this.showMint"
        />
      </el-card>
    </el-dialog>
  </el-aside>
</template>

<script>
import { mapState } from "vuex";
import NFTinfo from "./nftpanel/NFTinfo.vue";
import MintPBT from "../market/MintPBT.vue";
import market from "../../market";
import FoldButton from "../lib/FoldButton.vue";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
    MintPBT,
    FoldButton,
  },
  props: ["myList", "pageSize", "curNFT"],
  computed: mapState({
    bsc: "bsc",
    current: "current",
    loadDone: "loadDone",
    nftlist(state) {
      let pageSize = this.pageSize;
      const start = this.pageNum * pageSize - pageSize;
      const down = this.pageNum * pageSize;
      const listPage = Object.fromEntries(
        Object.entries(state.myList).slice(start, down)
      );
      return listPage;
    },
    isMarket() {
      if (this.$route.path == "/Market") {
        return false;
      } else {
        return true;
      }
    },
  }),
  data() {
    return {
      asideStyle: { width: "290px", isFold: false },
      pageNum: 1,
      open_loading: false,
      market: "/Market",
      mintNumber: "--",
      mintVisible: false,
      mintFee: {
        price: 0,
        token: "BNB",
        tokenAddr: "",
      },
    };
  },
  methods: {
    showMint: function () {
      this.mintVisible = !this.mintVisible;
    },
    openNFT: async function (id) {
      this.$store.commit("setCurrentPbtId", id);
    },
    getMintfee: async function () {
      this.open_loading = true;
      const fee = await market.getmintfee();
      this.mintFee.price = fee.price;
      this.mintFee.token = fee.ptName;
      this.mintFee.tokenAddr = fee.tokenAddr;
      const number = await market.getMintAbles();
      this.mintNumber = number;
      this.mintVisible = true;
      this.open_loading = false;
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
    },
    fold: function ($event) {
      // console.log("fold function", $event);
    },
  },
};
</script>

<style scoped>
#mynft {
  background-color: #25272e;
  min-height: 650px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  position: relative;
}
#mynft .f-btn {
  left: 0px;
}
.load {
  padding: 50px;
}
i {
  margin-right: 8px;
}
.my-title {
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  text-align: center;
}
.btn {
  position: relative;
  top: -5px;
}
.nftarea {
  margin-top: 5px;
  min-height: 500px;
}
.nftlist {
  height: 600px;
  padding: 0px 15px;
}
.content {
  min-height: 400px;
  line-height: 36px;
  padding: 40px;
}
.bottom-box {
  padding: 0 10px;
}
.bottom {
  width: 132px;
  font-size: 16px;
  color: #38f2af;
}
.btn-bar {
  margin: 20px 0;
  /* padding: 0 0px; */
}
.btn-bar .el-pagination {
  background-color: #25272e;
}
.addclass {
  background: rgb(173, 195, 235);
  width: 150px;
  height: 150px;
  transform: all 0.3 linear 0.2;
}
</style>
