import web3 from './web3';
const DonationCampaignFactory = require('./build/DonationCampaignFactory.json');
const instance = new web3.eth.Contract(
  JSON.parse(DonationCampaignFactory.interface),
'0x46c3b69e86aa32a54945FF26CfB9c265914474F7'
);
export default instance;
//0x9664eC21ab446e802AdC52A4a81c8F6Dc10fE370
//0xc94DC958f2f714C1c935EdEbb4097Cb7eeedC216
//version1 0x579fa877d3B51421a5C8D627F65cc1c804CE315A
//version2 0x265209Fc16166224B8BD2d446d4F7e3b402Ed1C3
