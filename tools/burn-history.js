const ethers = require('ethers')
const pbw = require('pbwallet')
const fs = require('fs')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function load_burns(bsc, ctr, recs){
    const teamAddr = '0xfeea9cd0da8279ce0f208fdeee2355062621254f'
    var burnBegin = Math.max(recs.checkedBlockNumber, 18134388)  // first burn at this block height
    const burnEnd = recs.chainBlockHeight
    const burns = recs.burns
    const filterBurn = ctr.filters.Transfer(teamAddr,ethers.constants.AddressZero)
    const checkStep = 3000
    try {
        while(burnBegin<burnEnd){
          const stepEnd = Math.min(burnEnd, burnBegin+checkStep-1)
          console.log('burn-begin,end=', burnBegin, stepEnd, burnEnd)
          const events = await ctr.queryFilter(filterBurn, burnBegin, stepEnd)
          //TODO: make sure events are in older-first order
          for(var i in events){
            burns.push(events[i])
          }
          recs.checkedBlockNumber = stepEnd
          await sleep(500)
          burnBegin = stepEnd+1
        }
    }catch(e){
        return recs 
    }
    console.log('burns=', burns)
    return recs 
}

async function main(){
    const burnPath = 'rec-burns.json'
    const key = 'c15767834bf5d0f990a36f8dcd45290fb0c43e25ad90c189b5bd3d88226be14a'
    const bsc = await pbw.connect_rpc(false, key,'https://bscrpc.com') 
    const pbp = bsc.ctrs['pbp']
    var recs = {
        checkedBlockNumber: 18134380,
        burns: []
    }
    if(fs.existsSync(burnPath)){
        recs = JSON.parse(fs.readFileSync(burnPath))
    }
    recs.chainBlockHeight = await bsc.provider.getBlockNumber()
    console.log('current chain height', recs.chainBlockHeight, recs.checkedBlockNumber)
    while(recs.chainBlockHeight>recs.checkedBlockNumber){
        await load_burns(bsc, pbp, recs)
        if(recs.chainBlockHeight>recs.checkedBlockNumber){
            console.log('seems check failed, wait and try again')
            await sleep(3000)
        }
        fs.writeFileSync(burnPath, JSON.stringify(recs, null, 2))
    }
}

main()
