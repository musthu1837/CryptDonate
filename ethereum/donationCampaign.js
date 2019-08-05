import web3 from './web3';
const DonationCampaign = require('./build/DonationCampaign.json');
export default (address) => {
  const instance = new web3.eth.Contract(
    JSON.parse(DonationCampaign.interface),
    address
  );
  return instance;
}
