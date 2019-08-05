import React,{ Component } from 'react';
import donationCampaign from '../ethereum/donationCampaign';
import {Message, Card, Button, Form, Icon, Input} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import axios from 'axios'
const stylesheet = {

}
class SettingsForm extends Component{
  constructor(props){
    super(props);
    this.state ={
      updateBtnLoading: false,
      uploadBtnLoading: false,
      email: "",
      pageLink: "",
      imageLink: ""
    }
  }
  handleUpdate = async (event) => {
    try{
      this.setState({"updateBtnLoading": true});
      const accounts = await web3.eth.getAccounts();
      if(accounts.length != 0){
        const campaign = donationCampaign(this.props.campaignAddress);
        const result = await campaign.methods.updateContactInfo(
          this.state.email,
          this.state.pageLink
        ).send({
          from: accounts[0],
        })
        window.alert("Details updated successfully")
        this.setState({"updateBtnLoading": false});
        this.props.setMessage();
        document.location.reload(true);
      }
      else{
        this.setState({"updateBtnLoading": false});
        window.alert("No accounts found")
      }
    }catch(err){
      this.setState({"updateBtnLoading": false});
      window.alert(err.message)
    }
  }
  handleUpload = async (event) => {
    try{
      if(window.confirm("Make sure link is correct, there is no way to correct it once it uploaded")){
        this.setState({"uploadBtnLoading": true});
        const accounts = await web3.eth.getAccounts();
        if(accounts.length != 0){
          const campaign = donationCampaign(this.props.campaignAddress);
          const result = await campaign.methods.uploadImage(
            this.state.imageLink
          ).send({
            from: accounts[0],
          })
          window.alert("Image uploaded successfully")
          this.setState({"updateBtnLoading": false});
          this.props.setMessage();
          document.location.reload(true);
        }
        else{
          this.setState({"uploadBtnLoading": false});
          window.alert("No accounts found")
        }
      }
    }catch(err){
      this.setState({"uploadBtnLoading": false});
      window.alert(err.message)
    }
  }
  render(){
    return (
      <Card fluid>
        <Message attached header='Settings' color='blue'/>
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.handleUpdate}>
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='E-mail'
                  placeholder='Enter your email address'
                  action={{ icon: 'mail', type: 'button' }}
                  value={this.state.email}
                  onChange={ event => this.setState({"email": event.target.value})}
                  type='email'
                  />
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
              <Button style={{"borderRadius": "20px"}} content='Update' type='submit' primary fluid loading={this.state.updateBtnLoading}/>
            </Form>
            <br/><hr/><br/>
            <Form onSubmit={this.handleUpload}>
              <Form.Field required>
                <Form.Input
                  required fluid
                  label='Image Link'
                  placeholder='Ex. GoogleDrive image link'
                  value={this.state.imageLink}
                  onChange={ event => this.setState({"imageLink": event.target.value})}
                  pattern='^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$'
                  action={{ content: 'Verify', onClick: (event) => window.open(this.state.imageLink) , type: 'button'}}
                  />
              </Form.Field>
              <Button style={{"borderRadius": "20px"}} content='Upload' type='submit' primary fluid loading={this.state.uploadBtnLoading}/>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
export default SettingsForm;
