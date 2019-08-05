import React, {Component} from 'react';
import Head from 'next/head'
import TransactionRow from './transactionRow'
import {Icon, Table, Button, Segment, Label} from 'semantic-ui-react';
import donationCampaign from '../ethereum/donationCampaign';
import web3 from '../ethereum/web3';
import getCreatedTime from '../libraries/createdTime'
import calculatePercentage from '../libraries/calculatePercentage'
import calculateDaysDiff from '../libraries/calculateDaysDiff'
const causes = ["Animal Welfare", "Arts & Heritage", "Children & Youth", "Community", "Disability", "Education", "Elderly", "Environment", "Families", "Health", "Humanitarian", "Social Service", "Sports", "Women & Girls"]
class CampaignInfo extends Component{
  constructor(props){
    super(props);
    this.state={
      finalizeBtnLoading: false
    }
  }
  handleFinalize = async (event) =>{
    try{
      this.setState({"finalizeBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const result = await campaign.methods.finalizeCampaign(
        ).send({
          from: accounts[0],
        })
        window.alert("Money transfered successfully")
        this.setState({"finalizeBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);
      }
      else{
        this.setState({"finalizeBtnLoading": false});
        window.alert("No accounts found")
      }
    }catch(err){
      this.setState({"finalizeBtnLoading": false});
      window.alert(err.message)
    }
  }
  render(){
    return (
      <div style={{"fontFamily": "Muli, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>
        <h1 title='title' style={{"float": "left"}}>{this.props.campaignInfo.title}</h1>
        <Label title='duration' style={{"float": "right", "marginTop": "8px"}}>
          <Icon name='calendar alternate outline' />
          {this.props.campaignInfo.noOfDays} day(s)
        </Label>
        <br/><br/><br/>
        <p title='cause' style={{"color": "grey", "marginTop": "-15px","float": "left"}}>
          {causes[this.props.campaignInfo.cause]}
        </p>
        <br/>
        <div style={{"border": "1px solid #CCCCCC"}}>
        </div>
        <br/>
        <Segment>
          <div>
            <div>
              <h1 title='collected money' style={{"color": "#0099ff","display": "inline-block"}}>
                <strong>
                  <Icon name='ethereum' style={{"marginLeft": "-7px"}}/>
                  <span style={{"display": "inline-block","marginLeft": "-4px"}}>
                    {this.props.campaignInfo.totalCollected}
                  </span>
                </strong> <span style={{"fontSize": "10px", "color": "#999999"}}>ETH</span>
              </h1>
              <p style={{"float": "right","display": "inline-block","fontSize": "16px", "fontWeight": "bold"}}> raised from <strong>{this.props.campaignInfo.donatorsCount}</strong> donor(s)</p>
            </div>
            <div style={{"border": "1px solid #CCCCCC", "borderRadius": "4px"}}>
              <div style={{"border": "5px solid green", "borderRadius": "4px","width": `${calculatePercentage(this.props.campaignInfo.totalCollected,this.props.campaignInfo.goal)}%`, "maxWidth": "100%"}}>
              </div>
            </div>
            <div>
              <span style={{"fontSize": "15px", "fontWeight": "bold", "marginTop": "5px","float": "left"}}> {calculatePercentage(this.props.campaignInfo.totalCollected,this.props.campaignInfo.goal)}% of goal {this.props.campaignInfo.goal} ETH</span>
              {
                (!this.props.campaignInfo.closed && !this.props.campaignInfo.isDurationDone)?<span style={{"fontSize": "15px", "fontWeight": "bold", "marginTop": "5px", "float": "right"}}> {calculateDaysDiff(this.props.campaignInfo.createdTime, this.props.campaignInfo.noOfDays)}</span>
                  :null
              }
            </div>
          </div>
          <br/><br/>
          {
            (this.props.userAccount == this.props.campaignInfo.manager && !this.props.campaignInfo.closed)?(
              <div>
                <Button
                  disabled={ (this.props.campaignInfo.validCount < (this.props.campaignInfo.donatorsCount - this.props.campaignInfo.validCount)) || this.props.campaignInfo.closed || !this.props.campaignInfo.isDurationDone}
                  content='Finalize' primary size='mini'
                  loading={this.state.finalizeBtnLoading}
                  onClick={this.handleFinalize}/>
              </div>):
              (<div></div>)
          }
        </Segment>
      </div>
    );
  }
};
export default CampaignInfo;
