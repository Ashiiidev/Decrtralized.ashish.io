const { assert } = require('chai');

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

 function tokens(n) {
 return  web3.utils.toWei(n,'ether');
 }

  contract ('TokenFarm', ([owner, investor]) =>{
   let daiToken, dappToken, tokenFarm
 
    before(async ()=> {
     daiToken = await DaiToken.new()
     dappToken = await DappToken.new()
     tokenFarm = await TokenFarm.new(dappToken.address , daiToken.address)
   
    await dappToken.transfer(tokenFarm.address,tokens('1000000'))

    await daiToken.transfer(investor, tokens('100'), {from : owner })
    })

    describe('Mock DAI deployment', async ()=>{
  it('has a name', async()=> {
   const name = await  daiToken.name()
   assert.equal(name, 'Mock DAI Token')

  })
 })

 describe('Dapp Token deployment', async ()=>{
    it('has a name', async ()=> {
     const name =  await dappToken.name()
     assert.equal(name,'DApp Token')
  
    })
   })


   describe(' Token Farm deployment', async ()=>{
    it('has a name', async ()=> {
     const name =  await tokenFarm.name()
     assert.equal(name,'Dapp Token Farm')
  
    })
  
   it('contains has tokens', async()=>{
   let balance = await dappToken.balanceOf(tokenFarm.address)
   assert.equal(balance.toString(), tokens('1000000'))
   })

 })

 describe('Farming tokens' , async () => {
  it('rewards investors for staking  mDai tokens', async () => {
   let result
 
  
   result  = await daiToken.balanceOf(investor)
   assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet ballance correct before staking')
   
   await daiToken.approve(tokenFarm.address , tokens('100') , {from : investor})
  await tokenFarm.stakeTokens(tokens('100'), {from : investor })
 
  result =  await daiToken.balanceOf(investor)
  assert.equal(result.toString(), tokens('0') , 'investor Mock DAI wallet balcne correct after staking')

  result = await daiToken.balanceOf(tokenFarm.address) 
  assert.equal(result.toString(), tokens('100'), 'Tookens Farm Mock DAI blance correct after shaking')


  result = await tokenFarm.stakingBalance(investor)
  assert.equal(result.toString() , tokens('100') , 'investor staking balance correct after shaking')

   result = await tokenFarm.isStaking(investor)
   assert.equal(result.toString(), 'true' , 'investor staking status correct after shaking')

  await tokenFarm.issueTokens({from : owner})

 result = await dappToken.balanceOf(investor)
assert.equal(result.toString(), tokens('100') , "investor DApp Token wallet balance correct affter issuance")

await tokenFarm.issueTokens({from : investor }).should.be.rejected;

await tokenFarm.unstakeTokens({from : investor})

result = await daiToken.balanceOf(investor)
assert.equal(result.toString(), tokens('100'), 'inestor Mock DAI wallet balance correct after staking')

result = await daiToken.balanceOf(tokenFarm.address)
assert.equal(result.toString(), tokens('0') , 'Tokens Farm Mock DAI balance correct after staking')

result = await tokenFarm.stakingBalance(investor)
assert.equal(result.toString(),tokens('0'), 'investor staking balance coorect after staking')


result = await tokenFarm.isStaking(investor)
assert.equal(result.toString(),'false', 'investor staking balance coorect after staking')


})
  })






})
