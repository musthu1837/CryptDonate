import React,{ Component } from 'react';
import {Grid, Segment} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Filter from '../../components/filter'
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
import CampaignCard from '../../components/campaignCard'
import BigNumber from 'bignumber.js'

import factory from '../../ethereum/donationCampaignFactory';
import donationCampaign from '../../ethereum/donationCampaign';
import web3 from '../../ethereum/web3';
import stylesheet from '../../css/campaignsCSS'

class CampaignIndex extends Component{
  constructor(props){
    super(props);
    this.state ={
      userAccount: "Loading...",
      userAccountBalance: "Loading...",
      messageHidden: false,
      messageContent: "Loading...",
      messageType: true,
      campaignsInfo: this.props.campaignsInfo,
      filter: this.props.filter
    }
  }
  onAccountChange = (accounts) => {
    this.setState({
      "messageHidden": false,
      "messageContent": "Updating..."
    })
    document.location.reload(true);
  }
  async componentDidMount(){
    try{
      if(typeof ethereum !== 'undefined'){
          await ethereum.enable();
          ethereum.on('accountsChanged', this.onAccountChange)
      }
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
          const balance = await web3.utils.fromWei( await web3.eth.getBalance(accounts[0]));
          this.setState({"userAccount": accounts[0], "userAccountBalance": balance, "messageHidden": true} );
      }
      else{
        this.setState({"userAccount": "no account", "userAccountBalance": "0", "messageHidden": true} );
      }
    }
    catch(err){
      this.setState({"userAccount": "unable to fetch", "userAccountBalance": "unable to fetch", "messageHidden": true } );
    }
  }
  static async getInitialProps(props){
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    var a = Array();
    var b = Array();
    for(var i=0;i< campaigns.length ; i++){
      const campaign = donationCampaign(campaigns[i]);
      const summary = await campaign.methods.getSummary().call();
      const imageLink = await campaign.methods.images(0).call();
      const isDurationDone = await campaign.methods.isDurationcompleted().call();
      const campaignInfo =  {
          address: campaigns[i],
          manager: summary[0],
          closed: summary[1],
          createdTime: summary[2],
          title: summary[3],
          goal: new BigNumber(web3.utils.fromWei(summary[4], 'ether')).toFixed(4),
          donatorsCount: summary[5],
          totalCollected: new BigNumber(web3.utils.fromWei(summary[6], 'ether')).toFixed(4),
          noOfDays: summary[7],
          validCount: summary[8],
          cause: summary[9],
          imageLink: imageLink,
          isDurationDone
      }
      b.push(campaignInfo)
      if(!isDurationDone)
        a.push(campaignInfo);
    }
    return {"campaignsInfo": b , "filter": a}
  }
  setMessage = (data) => {
    this.setState({
      messageHidden: data.messageHidden,
      filter: data.data
    })
  }
  render(){
    return (
      <Layout
        userAccount={this.state.userAccount}
        userAccountBalance={this.state.userAccountBalance}
        messageHidden={this.state.messageHidden}
        messageType={this.state.messageType}
        messageContent={this.state.messageContent}
      >
        <br/><br/><br/><br/><br/><br/>
          <Grid divided>
             <Grid.Row>
              <Grid.Column style={{"width": "20%"}}>
                  <Filter
                    campaignsInfo={this.state.campaignsInfo}
                    setMessage = {this.setMessage}
                    filter = {this.state.filter}
                  />
               </Grid.Column>
               <Grid.Column style={{"width": "80%"}}>
                 <div style={stylesheet.resultHeader}>
                   Found {this.state.filter.length} Results
                 </div>
                 <Segment basic>
                    <CampaignCard items = {this.state.filter}/>
                  </Segment>
               </Grid.Column>
             </Grid.Row>
           </Grid>
      </Layout>
    );
  }
}
export default CampaignIndex;
