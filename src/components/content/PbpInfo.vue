<template>
  <el-col>
    <el-col :span="5" :offset="1" :xs="{ offset: 0 }">
      <h1>PBP</h1>
      <h3>PlotBridge Point</h3>
    </el-col>
    <el-col :span="18">
      <el-tabs id="pbpInfo" tab-position="left" style="height: 200px">
        <el-tab-pane label="作用">
          <p>
            <span>
              降低WCoin的流动性提供成本，使社区资金提供交易对流动性的积极性增加。<br />
              奖励WCoin流动性提供者，使交易对充沛，提高PlotBridge的使用方便效果。<br />
              奖励PB的使用者 <br />
              团队收入 <br />
              项目治理
            </span>
          </p>
        </el-tab-pane>
        <el-tab-pane label="发行规则">
          <p>
            <span>
              总量：1B，即10亿枚（小数点前9位），
              小数点后位数：9位，发行价格：20个BNB对30,000,000个PBP，全部在BSC上发行，<br />
              分配比例：流动性奖励36%、初始流动性提供14.5%、社区8%、团队15.5%、新项目18%、PBT和Wcion销毁j奖励各4%;
              <br />
              解锁：预售资金、社区前期奖励资金、初始流动性提供资金一次性解锁，流动性奖励资金按日解锁，团队收入及社区资金按周解锁，新项目资金按需求解锁(以不产生集中抛售为出发点)，PBT和Wcion销毁按周解锁
              <br />
              流动性奖励资金：分5个阶段，阶段发行量为72M，阶段分别为：0～90共90日的日发行量为800K，90～270共180日的日发行量为400K，270～630共360日的日发行量为200K，630～1350共720日的日发行量为100K，1350～2790共1440日的日发行量为50K
            </span>
          </p>
        </el-tab-pane>
        <el-tab-pane label="价值保障">
          <p>
            <span>
              官方提供的初始流动性，设置一个资金量为其它奖励池的1/10的和锁定期为3个月的相应流动性奖励池，<br />
              官方的流动性资金锁定在池里，社区资金也可以自由加入。<br />
              PlotBridge项目收入的30%用于回购PBP并销毁，每月执行一次。<br />
              其他新项目对PBP的消耗
            </span>
          </p>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-col>
</template>
<style scoped>
</style>