const HDWalletProvider=require('truffle-hdwallet-provider');
const Web3=require('web3');
const DonationCampaignFactory = require('./build/DonationCampaignFactory.json');
const provider=new HDWalletProvider('bamboo mouse february candy cram click rare remember empower man bean banana',
'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q');
const web3=new Web3(provider);
const deploy=async ()=>{
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account',accounts[0]);
  const result=await new web3.eth.Contract(JSON.parse(DonationCampaignFactory.interface))
  .deploy({data:'0x'+DonationCampaignFactory.bytecode})
  .send({from:accounts[0],gas:'5000000'});
console.log('contract deployed to',result.options.address);
}
deploy();
