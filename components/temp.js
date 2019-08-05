/*
******* index.js *******
*/
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
/*
********filter.js*******
*/
import React,{ Component } from 'react';
import {Card, Button, Grid, Image, Radio, Segment, Label, Icon, Divider, Checkbox,Input} from 'semantic-ui-react';
import _ from 'lodash'
import stylesheet from '../css/campaignsCSS'
const causes = [{ cause: "Animal Welfare",
      value: "0"
    },
    {
      cause: "Arts & Heritage",
      value: "1"
    },
    {
      cause: "Children & Youth",
      value: "2"
    },
    {
      cause: "Community",
      value: "3"
    },
    {
      cause: "Disability",
      value: "4"
    },
    { cause: "Education",
      value: "5"
    },
    {
      cause: "Elderly",
      value: "6"
    },
    { cause: "Environment",
      value: "7"
    },
    {
      cause: "Families",
      value: "8"
    },
    {
      cause: "Health",
      value: "9"
    },
    {
      cause: "Humanitarian",
      value: "10"
    },
    {
      cause: "Social Service",
      value: "11"
    },
    { cause: "Sports",
      value: "12"
    },
    { cause: "Women & Girls",
      value: "13"
    }
]
var causeState = {}
class Filter extends Component{
  constructor(props){
    super(props);
    this.state ={
      categoriesToggle: false,
      causeToggle: false,
      categoryState: true,
      causeState: causeState,
      filterToggle: true
    }
  }
  closeLoading = (filter) => {
    this.props.setMessage({
      messageHidden: true,
      data: filter
    })
  }
  handleCauseToggle = (event, { value }) => {
    if(typeof causeState[value] == "undefined"){
      causeState[value] = value
      this.setState({causeState: causeState})
    }
    else{
      delete causeState[value]
      this.setState({causeState: causeState})
    }
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    var filter = Array()
    const t = this.props.campaignsInfo
    for(var i=0;i < t.length ;i++){
      if(_.isEmpty(this.state.causeState)){
        if(t[i].isDurationDone == !this.state.categoryState){
          filter.push(t[i])
        }
      }
      else{
        if((t[i].cause in this.state.causeState) && (t[i].isDurationDone == !this.state.categoryState)){
          filter.push(t[i])
        }
      }
    }
    setTimeout(this.closeLoading, 500, filter)
  }
  handleCategoriesToggle = (event) =>{
    this.setState({"categoryState": !this.state.categoryState})
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    var filter = Array()
    const t = this.props.campaignsInfo
    for(var i=0;i < t.length ;i++){
      if(_.isEmpty(this.state.causeState)){
        if(t[i].isDurationDone == this.state.categoryState){
          filter.push(t[i])
        }
      }
      else{
        if((t[i].cause in this.state.causeState) && (t[i].isDurationDone == this.state.categoryState)){
          filter.push(t[i])
        }
      }
    }
    setTimeout(this.closeLoading, 500, filter)
  }
  handleFilterToggle = (event) => {
    this.setState({"filterToggle": !this.state.filterToggle})
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    if(!this.state.filterToggle){
      var filter = Array()
      const t = this.props.campaignsInfo
      for(var i=0;i < t.length ;i++){
        if(_.isEmpty(this.state.causeState)){
          if(t[i].closed == !this.state.categoryState){
            filter.push(t[i])
          }
        }
        else{
          if((t[i].cause in this.state.causeState) && (t[i].closed == !this.state.categoryState)){
            filter.push(t[i])
          }
        }
      }
      setTimeout(this.closeLoading, 500, filter)
    }
    else{
      setTimeout(this.closeLoading, 500, this.props.campaignsInfo)
    }

  }
  render(){
    return (
     <Segment basic>
        <div style={stylesheet.filterHeader}>
          Filter
          <div style={stylesheet.filterHeaderClear}>
            <Checkbox toggle
              onChange={this.handleFilterToggle}
              checked={this.state.filterToggle}
            />
          </div>
        </div>
        <br/><br/>
        <div>
          <div onClick={(event) => this.setState({"categoriesToggle": this.state.categoriesToggle? false : true})} style={stylesheet.filterContentHeader}>
            CATEGORIES
            <Icon style={{"float": "right"}} name={ this.state.categoriesToggle ? "caret up" : "caret down"}/>
          </div>
          <Divider/>
          <div style={{"display":this.state.categoriesToggle ? "none" : "block"}}>
            <div style={stylesheet.filterContentCheckbox}>
              <Radio
                label="Open Campaigns"
                checked={this.state.categoryState==true}
                onChange={this.handleCategoriesToggle}
                disabled={!this.state.filterToggle}
              />
            </div>
            <br/>
            <div style={stylesheet.filterContentCheckbox}>
              <Radio
                label="Closed Campaigns"
                checked={this.state.categoryState==false}
                onChange={this.handleCategoriesToggle}
                disabled={!this.state.filterToggle}
              />
            </div>
          </div>
          <br/><br/>

          <div onClick={(event) => this.setState({"causeToggle": this.state.causeToggle? false : true})} style={stylesheet.filterContentHeader}>
            CAUSES
            <Icon style={{"float": "right"}} name={ this.state.causeToggle ? "caret up" : "caret down"}/>
          </div>
          <Divider/>
          <div style={{"display":this.state.causeToggle ? "none" : "block"}}>
            { causes.map((item, index) => {
                return(
                  <div key={index}>
                    <div style={stylesheet.filterContentCheckbox}>
                      <Checkbox
                        value={item.value}
                        label={item.cause}
                        checked={typeof causeState[item.value] !== "undefined"}
                        onChange={ this.handleCauseToggle }
                        disabled={!this.state.filterToggle}
                      />
                    </div>
                    <br/>
                  </div>
                )
            })
            }
          </div>
        </div>
     </Segment>
   );
  }
}
export default Filter;
