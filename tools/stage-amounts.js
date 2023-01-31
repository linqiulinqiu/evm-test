const ethers = require('ethers')
const pbw = require('pbwallet')
const fs = require('fs')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function load_start(bsc, ctr){
    const start = await ctr.stakeStart()
    const date = new Date(start.toNumber()*1000)
    return date
}

async function main(){
    const wallet = ethers.Wallet.createRandom()
    const bsc = await pbw.connect_rpc(false, wallet.privateKey, 'https://rpc.ankr.com/bsc') 
    const pbp = bsc.ctrs['pbp']
    var date = await load_start(bsc,pbp)
    const mintCaps = 1000*1000*1000;
    var sum = 145*1000*1000
    console.log('sum=', sum)
    for(var i=90;i<=1440;i*=2){
        const stake_amount = mintCaps*72/1000;
        const stage_amount = mintCaps*99/1000;
        sum += stake_amount+stage_amount; 
        console.log('halving=', date, 'stage_amount=', stage_amount/i, 'stake_amount =', stake_amount/i, 'sum=', sum)
        date = date.addDays(i)
    }
}

main()
