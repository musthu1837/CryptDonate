import React,{ Component } from 'react';
import donationCampaign from '../ethereum/donationCampaign';
import {Message, Card, Button, Form, Icon, Input} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import BigNumber from "bignumber.js"
class DonateForm extends Component{
  constructor(props){
    super(props);
    this.state ={
      currency: null,
      donationAmount: "",
      donateBtnLoading: false,
      fraudBtnLoading: false,
      legitimateBtnLoading: false,
    }
  }
  handleLegitimate = async (event) => {
    try{
      this.setState({"legitimateBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const result = await campaign.methods.voteValidCampaign(
        ).send({
          from: accounts[0],
        })
        window.alert("Vote was successful")
        this.setState({"legitimateBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);
      }
      else{
        this.setState({"legitimateBtnLoading": false});
        window.alert("Vote was successful")
      }
    }catch(err){
      this.setState({"legitimateBtnLoading": false});
      window.alert("Vote was successful")
    }
  }
  handleFraud = async (event) => {
    try{
      this.setState({"fraudBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const result = await campaign.methods.voteInvalidCampaign(
        ).send({
          from: accounts[0],
        })
        window.alert("Vote was successful")
        this.setState({"fraudBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);
      }
      else{
        this.setState({"fraudBtnLoading": false});
        window.alert(err.message)
      }
    }catch(err){
      this.setState({"fraudBtnLoading": false});
      window.alert(err.message)
    }
  }
  handleDonate = async (event) => {
    event.preventDefault();
    try{
      this.setState({"donateBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const wei = web3.utils.toWei(new BigNumber(this.state.donationAmount).toFixed(18), 'ether')
        if( wei == '0') throw { message: "Too small amount"};
        const result = await campaign.methods.donate(
        ).send({
          from: accounts[0],
          value: wei
        })
        window.alert("Transaction was successful")
        this.setState({"donateBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);
      }
      else{
        this.setState({"donateBtnLoading": false});
        window.alert("No accounts found")
      }
    }catch(err){
      this.setState({"donateBtnLoading": false});
      window.alert(err.message)
    }
  }
  render(){
    return (
      <Card fluid>
        <Message attached header='Donate & Vote Today' color='blue' content='Every bit counts'/>
        <Card.Content>
          <Card.Description>
            <br/>
            <Form onSubmit={this.handleDonate}>
              <Form.Input required fluid label='Amount' placeholder='Enter the amount in ether' icon='ethereum'
                value={this.state.donationAmount}
                icon='ethereum'
                onChange={ event => {
                  var value = new BigNumber(event.target.value)
                  if(!value.isNaN() || event.target.value == "")
                    this.setState({"donationAmount": event.target.value})
                }}
                pattern = '^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$'
              />
              <Button style={{"borderRadius": "20px"}} content='Donate' type='submit' primary fluid loading={this.state.donateBtnLoading}/>
            </Form>
          </Card.Description>
          {
              (this.props.isDonor)?
                (<div>
                  <br/><hr/><br/>
                  <Card.Header>
                    <b>Vote Here</b>
                  </Card.Header>
                  <Card.Description>
                    <br/>
                    <div className='ui two buttons'>
                      <Button disabled={this.props.vote==true} basic color='green' loading={this.state.legitimateBtnLoading} onClick={this.handleLegitimate}>
                        Legitimate({this.props.validCount})
                      </Button>
                      <Button disabled={this.props.vote==false} basic color='red' onClick={this.handleFraud} loading={this.state.fraudBtnLoading}>
                        Fraud({this.props.donatorsCount-this.props.validCount})
                      </Button>
                    </div>
                  </Card.Description>
                </div>):
                (<div>
                  <br/><hr/><br/>
                  <Card.Header>
                    <b>Votes</b>
                  </Card.Header>
                  <Card.Description>
                    <br/>
                    <div className='ui two buttons'>
                      <Button basic color='green'>
                        Legitimate({this.props.validCount})
                      </Button>
                      <Button basic color='red'>
                        Fraud({this.props.donatorsCount-this.props.validCount})
                      </Button>
                    </div>
                  </Card.Description>
                </div>)
          }
        </Card.Content>
      </Card>
    );
  }
}
export default DonateForm;
