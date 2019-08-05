const closedCampaigns = (campaigns) =>{
  return campaigns.find(item => {
     return campaign.closed == false;
  })
}
module.exports = closedCampaigns;
