import React,{ Component } from 'react';
import {Grid, Segment, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import DonateForm from '../../components/donateForm'
import TransactionTable from '../../components/transactionTable'
import CampaignInfo from '../../components/campaignInfo'
import ContactInfo from '../../components/contactInfo'
import SettingsForm from '../../components/settingsForm'
import CampaignCard from '../../components/campaignCard'
import ImageSlider from '../../components/imageslider'
import {Link, Router} from '../../routes'
import BigNumber from 'bignumber.js'

import factory from '../../ethereum/donationCampaignFactory';
import donationCampaign from '../../ethereum/donationCampaign';
import web3 from '../../ethereum/web3';
const causes = ["Animal Welfare", "Arts & Heritage", "Children & Youth", "Community", "Disability", "Education", "Elderly", "Environment", "Families", "Health", "Humanitarian", "Social Service", "Sports", "Women & Girls"]
class Show extends Component{
  constructor(props){
    super(props);
    this.state ={
      userAccount: "loading..",
      userAccountBalance: "loading..",
      isDonator: false,
      vote: true,
      donatedAmount: 0,
      messageHidden: false,
      messageContent: "Loading...",
      messageType: true,
      currentIndex: 0
    }
  }
  setMessage = () => {
    this.setState({
      "messageHidden": false,
      "messageContent": "Updating..."
    });
  }
  jumpCurrentIndex = (event, data)=>{
    event.preventDefault();
    this.setState({"currentIndex": data.value})
  }
  next = (event) => {
    if(this.state.currentIndex != this.props.images.length-1)
      this.setState({"currentIndex": ++this.state.currentIndex})
  }
  previous = (event) => {
    if(this.state.currentIndex != 0)
      this.setState({"currentIndex": --this.state.currentIndex})
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
      if(!this.props.notfound){
        if(typeof ethereum !== 'undefined'){
          await ethereum.enable();
          ethereum.on('accountsChanged',this.onAccountChange)
        }
        const accounts = await web3.eth.getAccounts();
        if(accounts.length != 0){
            const campaign = donationCampaign(this.props.url.query.address);
            const userAccountBalance = await web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
            const isDonor = await campaign.methods.donators(accounts[0]).call();
            const donatedAmount = await campaign.methods.donationAmount(accounts[0]).call();
            const vote = await campaign.methods.validation(accounts[0]).call();
            this.setState({"userAccount": accounts[0], userAccountBalance, isDonor, donatedAmount, vote, messageHidden: true});
        }
        else{
          this.setState({"userAccount": "no account", "userAccountBalance": "0", "messageHidden": true} );
        }
      }
      else{
        Router.pushRoute('/404NotFound')
      }
    }
    catch(err){
      this.setState({"userAccount": "unable to fetch", "userAccountBalance": "unable to fetch", "messageHidden": true} );
    }
  }
  static async  getInitialProps(props) {
    try{
      if(!props.query.address)
        throw "errror";
      const campaign = donationCampaign(props.query.address);
      try{
        const summary = await campaign.methods.getSummary().call();
        const imageLink = await campaign.methods.images(0).call();
        const contact = await campaign.methods.getContactInfo().call();
        const isDurationDone = await campaign.methods.isDurationcompleted().call();
        var campaignInfo = {
          manager: summary[0],
          closed: summary[1],
          createdTime: summary[2],
          title: summary[3],
          goal:  new BigNumber(web3.utils.fromWei(summary[4], 'ether')).toFormat(6),
          donatorsCount: summary[5],
          totalCollected: new BigNumber(web3.utils.fromWei(summary[6], 'ether')).toFormat(6),
          noOfDays: summary[7],
          validCount: summary[8],
          cause: summary[9],
          imageLink: imageLink,
          isDurationDone
        }
        var contactInfo = {
          email: contact[0],
          address: contact[1]
        }
        const transactionsLength = await campaign.methods.getTransactionsLength().call();
        var transactions = Array();
        for(var i=transactionsLength-1; i>=0; i--){
          const transaction = await campaign.methods.transactions(i).call();
          transactions.push({
            sender: transaction[0],
            amount: new BigNumber(web3.utils.fromWei(transaction[1], 'ether')).toFixed(6),
            createdTime: transaction[2],
            direction: transaction[3]
          })
        }
        const imagesLength = await campaign.methods.getImagesLength().call();
        var images = Array();
        for(var i=0; i<imagesLength; i++){
          const image = await campaign.methods.images(i).call();
          images.push(image)
        }
        return {
          campaignInfo,
          contactInfo,
          transactions,
          images,
          "notfound": false
        };
      }
      catch(err){
        console.log(err.message);
        return {"notfound": true}
      }
    }
    catch(err){
      console.log(err);
      return {"notfound": true}
    }
  }
  render(){
    return (
      (!this.props.notfound && this.props.campaignInfo)?(<Layout userAccount={this.state.userAccount} userAccountBalance={this.state.userAccountBalance}
        messageHidden={this.state.messageHidden} messageType={this.state.messageType} messageContent={this.state.messageContent}>
        <br/><br/><br/><br/><br/><br/>
          <Grid divided>
            <Grid.Row>
              <Grid.Column style={{"width": "66%"}}>
                <Grid.Row>
                   <Segment basic>
                    <ImageSlider
                      currentIndex={this.state.currentIndex}
                      jumpCurrentIndex = {this.jumpCurrentIndex}
                      images = {this.props.images}
                      next = {this.next}
                      previous = {this.previous}
                     />
                   </Segment>
                </Grid.Row>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/>
                <Grid.Row>
                  <br/>
                  <Segment basic>
                    <CampaignInfo
                      campaignInfo={this.props.campaignInfo}
                      userAccount={this.state.userAccount}
                      campaignAddress={this.props.url.query.address}
                      setMessage = {this.setMessage}
                    />
                  </Segment>
                </Grid.Row>
                <Grid.Row>
                  <br/>
                  <Segment basic>
                    <TransactionTable
                      transactions={this.props.transactions}
                      campaignAddress={this.props.url.query.address}
                      isDonor= {this.state.isDonor}
                      donatedAmount={this.state.donatedAmount}
                      campaignInfo= {this.props.campaignInfo}
                      setMessage = {this.setMessage}
                      userAccount = {this.state.userAccount}
                    />
                  </Segment>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column style={{"width": "34%"}}>
                {  (!this.props.campaignInfo.isDurationDone && this.state.userAccount != this.props.campaignInfo.manager)?<Grid.Row>
                   <Segment basic>
                      <DonateForm
                        setMessage = {this.setMessage}
                        validCount={this.props.campaignInfo.validCount}
                        donatorsCount={this.props.campaignInfo.donatorsCount}
                        campaignAddress={this.props.url.query.address}
                        isDonor={this.state.isDonor}
                        vote = {this.state.vote}
                      />
                   </Segment>
                  </Grid.Row>:<Grid.Row>
                      <Segment basic>
                        <h3>Votes polled</h3>
                        <div className='ui two buttons'>
                          <Button basic color='green'>
                            Legitimate({this.props.campaignInfo.validCount})
                          </Button>
                          <Button basic color='red'>
                            Fraud({this.props.campaignInfo.donatorsCount-this.props.campaignInfo.validCount})
                          </Button>
                      </div>
                    </Segment>
                  </Grid.Row>
                }
                <Grid.Row>
                 <Segment basic>
                  <br/>
                  <ContactInfo
                    contactInfo={this.props.contactInfo}
                    campaignInfo={this.props.campaignInfo}
                    campaignAddress={this.props.url.query.address}
                  />
                 </Segment>
                </Grid.Row>
                {
                    ((this.state.userAccount == this.props.campaignInfo.manager) && !this.props.campaignInfo.isDurationDone)?<Grid.Row>
                     <Segment basic>
                      <br/>
                      <SettingsForm
                        setMessage={this.setMessage}
                        campaignAddress={this.props.url.query.address}
                      />
                     </Segment>
                    </Grid.Row>: <div></div>
                }
              </Grid.Column>
             </Grid.Row>
           </Grid>
           <br/><br/><br/>
      </Layout>):(<div></div>)
  );
  }
}
export default Show;
