<template>
  <el-col>
    <el-col :span="5" :offset="1" :xs="{ offset: 0 }">
      <h1>PBP</h1>
      <h3>PlotBridge Point</h3>
    </el-col>
    <el-col :span="18">
      <el-tabs id="pbpInfo" tab-position="left" style="height: 200px">
        <el-tab-pane :label="$t('pbp-role')">
          <p>
            <span>
              <p v-for="line in $t('pbp-info-msgs')">
                {{ line }}
              </p>
            </span>
          </p>
        </el-tab-pane>
        <el-tab-pane :label="$t('pbp-issue-rule')">
          <p>
            <span>
              <p v-for="line in $t('pbp-issue-rule-msgs')">
                {{ line  }}
              </p>
             </span>
          </p>
        </el-tab-pane>
        <el-tab-pane :label="$t('pbp-price-support')">
          <p>
            <span>
              <p v-for="line in $t('pbp-price-support-msgs')">
                {{ line  }}
              </p>
            </span>
          </p>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-col>
</template>
<style scoped>
</style>