import React, {Component} from 'react';
import Head from 'next/head'
import TransactionRow from './transactionRow'
import {Table, Button} from 'semantic-ui-react';
import donationCampaign from '../ethereum/donationCampaign';
import web3 from '../ethereum/web3';
export default class TransactionTable extends Component{
  constructor(props){
    super(props)
    this.state={
      withdrawBtnLoading: false
    }
  }
  handleWithdraw = async (event) =>{
    try{
      this.setState({"withdrawBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const result = await campaign.methods.withdrawAmount(
        ).send({
          from: accounts[0],
        })
        window.alert("Money transfered successfully")
        this.setState({"withdrawBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);

      }
      else{
        this.setState({"withdrawBtnLoading": false});
        window.alert("No accounts found")
      }
    }catch(err){
      this.setState({"withdrawBtnLoading": false});
      window.alert(err.message)
    }
  }
  render(){
    return (
      <div>
        <div style={{"fontFamily": "Muli, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>
          <span style={{"fontSize": "1.5em","fontWeight": "bold","float":"left"}}>Transactions</span>
          {  (!this.props.campaignInfo.closed && this.props.isDonor)?(
              <div style={{"float":"right"}}>
               <Button
                disabled={!this.props.campaignInfo.isDurationDone || this.props.donatedAmount == 0 || this.props.campaignInfo.closed || (this.props.campaignInfo.validCount >= (this.props.campaignInfo.donatorsCount - this.props.campaignInfo.validCount))}
                content='Withdraw' size='mini' primary
                loading={this.state.withdrawBtnLoading}
                onClick={this.handleWithdraw}/>
              </div>):
              <div></div>
          }
        </div>
        <br/>
        <Table size='small'>
           <Table.Header>
             <Table.Row>
               <Table.HeaderCell>Account</Table.HeaderCell>
               <Table.HeaderCell>Amount</Table.HeaderCell>
               <Table.HeaderCell>When</Table.HeaderCell>
               <Table.HeaderCell>Direction</Table.HeaderCell>
             </Table.Row>
           </Table.Header>
           <Table.Body>
              { this.props.transactions.length != 0 ?(
                  this.props.transactions.map((transaction, index) => {
                      return <TransactionRow userAccount={this.props.userAccount} key={index} transaction={transaction}/>
                  })):
                  (<Table.Row>
                      <Table.Cell/>
                      <Table.Cell/>
                      <Table.Cell/>
                      <Table.Cell/>
                    </Table.Row>)
              }
           </Table.Body>
           <Table.Footer>
             <Table.Row>
               <Table.HeaderCell>total {this.props.transactions.length} transaction(s) found.</Table.HeaderCell>
               <Table.HeaderCell />
               <Table.HeaderCell />
               <Table.HeaderCell />
             </Table.Row>
           </Table.Footer>
         </Table>
      </div>
    );
  }
};
