import React,{ Component } from 'react';
import {Card, Form, Checkbox, Button,} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import BigNumber from "bignumber.js"

import web3 from '../../ethereum/web3';
import factory from '../../ethereum/donationCampaignFactory';
import stylesheet from '../../css/createCSS'
const options = [
  { key: '0', text: 'Animal Welfare', value: 0 },
  { key: '1', text: 'Arts & Heritage', value: 1 },
  { key: '2', text: 'Children & Youth', value: 2 },
  { key: '3', text: 'Community', value: 3 },
  { key: '4', text: 'Disability', value: 4 },
  { key: '5', text: 'Education', value: 5 },
  { key: '6', text: 'Elderly', value: 6 },
  { key: '7', text: 'Environment', value: 7 },
  { key: '8', text: 'Families', value: 8 },
  { key: '9', text: 'Health', value: 9 },
  { key: '10', text: 'Humanitarian', value: 10 },
  { key: '11', text: 'Social Service', value: 11 },
  { key: '12', text: 'Sports', value: 12 },
  { key: '13', text: 'Women & Girls', value: 13 },
]
const causes = ["Animal Welfare", "Arts & Heritage", "Children & Youth", "Community", "Disability", "Education", "Elderly", "Environment", "Families", "Health", "Humanitarian", "Social Service", "Sports", "Women & Girls"]
class CampaignIndex extends Component{
  constructor(props){
    super(props);
    this.state ={
      userAccount: "Loading...",
      userAccountBalance: "Loading..",
      title: "",
      campaignGoal:"",
      duration: "",
      cause: "0",
      imageLink: "",
      email: "",
      pageLink: "",
      loading: false,
      messageHidden: false,
      messageContent: "Loading...",
      messageType: true,
      value: "us"
    }
  }
  onAccountChange = (accounts) => {
    this.setState({
      "messageHidden": false,
      "messageContent": "Updating..."
    })
    document.location.reload(true);
  }
  async componentWillMount() {
    try{
      if(typeof ethereum !== 'undefined'){
        await ethereum.enable();
        ethereum.on('accountsChanged', this.onAccountChange)
      }
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
          const balance = await web3.utils.fromWei( await web3.eth.getBalance(accounts[0]));
          this.setState({"userAccount": accounts[0], "userAccountBalance":  balance, "messageHidden": true} );
      }
      else
        this.setState({"userAccount": "no accounts", "userAccountBalance": "0", "messageHidden": true} );
    }catch(err){
          this.setState({"userAccount": "unable to fetch", "userAccountBalance": "unable to fetch","messageHidden": true } );
    }
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    try{
      if(window.confirm("Make sure everything is correct, You can only update email and page link after creating")){
        this.setState({"loading": true});
        const accounts = await web3.eth.getAccounts();
        if(accounts.length != 0){
          const wei = web3.utils.toWei(new BigNumber(this.state.campaignGoal).toFixed(18), 'ether')
          console.log(wei);
          if( wei == '0') throw { message: "Too small amount"};
          const result = await factory.methods.createCampaign(
              this.state.title,
              this.state.imageLink,
              this.state.email,
              this.state.pageLink,
              this.state.duration,
              this.state.cause,
              wei
          ).send({
            from: accounts[0]
          })
          window.alert("Campaign created successfully")
          this.setState({"loading": false});
          window.location.href = '/campaigns/';
        }
        else{
          window.alert("No accounts found")
          this.setState({"loading": false});
        }
      }
    }catch(err){
      this.setState({"loading": false});
      window.alert(err.message)
    }
  }
  render(){
    return (
    <Layout userAccount={this.state.userAccount} userAccountBalance={this.state.userAccountBalance}
      messageHidden={this.state.messageHidden} messageType={this.state.messageType} messageContent={this.state.messageContent}>
      <br/><br/><br/><br/>
      <div style={stylesheet.formHeader}>
        <br/><br/><br/>
        <center>
          <div style={stylesheet.formContent}>
            Start your campaign in one step
          </div>
        </center>
      </div>
      <div style={stylesheet.line}></div>
      <div style={stylesheet.form }>
        <Card style={{"width": "600px"}} color='blue'>
          <Card.Content>
            <Form onSubmit= {this.handleSubmit}>
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='Campaign Title'
                  placeholder='Enter your title (Only letters and spaces in middle)'
                  action={{ icon: 'pencil', iconPosition: 'right', type: 'button'}}
                  value={this.state.title}
                  onChange={ event => this.setState({"title": event.target.value})}
                  pattern='(?! )^[a-zA-Z\s]*(?<! )$'
                  />
              </Form.Field>
              <Form.Field>
                <Form.Group widths='equal'>
                  <Form.Input required fluid label='Campaign Goal' placeholder='In ether'
                    action={{ icon: 'ethereum', iconPosition: 'right', type: 'button'}}
                    value={this.state.campaignGoal}
                    onChange={ event => {
                      var value = new BigNumber(event.target.value)
                      if(!value.isNaN() || event.target.value == "")
                        this.setState({"campaignGoal": event.target.value})
                    }}
                    pattern = '^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$'
                    />
                  <Form.Input type='number' required fluid label='Duration (days)' placeholder='minimum 1 day'
                    value={this.state.duration}
                    onChange={ event => this.setState({"duration": Math.floor(event.target.value)})}
                    min={1}
                    action={{ icon: 'calendar alternate', iconPosition: 'right', type: 'button'}}
                    />
                  <Form.Select required fluid label='Cause' options={options} placeholder='Animal Welfare'
                    selected
                    onChange={ (event, data) => this.setState({"cause": data.value})}
                    />
                </Form.Group>
              </Form.Field>
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='E-mail'
                  placeholder='Enter your email address'
                  value={this.state.email}
                  onChange={ event => this.setState({"email": event.target.value})}
                  type='email'
                  action={{ icon: 'mail', iconPosition: 'right', type: 'button'}}
                  />
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='Image Link'
                  placeholder='Ex. GoogleDrive image link'
                  value={this.state.imageLink}
                  onChange={ event => this.setState({"imageLink": event.target.value})}
                  pattern='^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$'
                  action={{ content: 'Verify', onClick: (event) => window.open(this.state.imageLink), type: 'button' }}
                  />
              </Form.Field>
              </Form.Field>
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='Social Media page link'
                  placeholder='paste your link'
                  value={this.state.pageLink}
                  onChange={ event => this.setState({"pageLink": event.target.value})}
                  pattern='^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$'
                  action={{ content: 'Verify', onClick: (event) => window.open(this.state.pageLink), type: 'button' }}
                  />
              </Form.Field>
              <Button fluid type='submit' primary loading={this.state.loading}>Start</Button>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
  }
}
export default CampaignIndex;
