import React,{ Component } from 'react';
import {Button, Image, Icon} from 'semantic-ui-react';
import Layout from '../components/Layout';
import ModelViewer from 'metamask-logo'

import web3 from '../ethereum/web3';
import stylesheet from '../css/indexCSS'
//#f0ffff
class Home extends Component{
  constructor(props){
    super(props);
    this.state ={
      userAccount: "loading...",
      userAccountBalance: "loading...",
      messageHidden: false,
      messageContent: "Loading...",
      messageType: true
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
      this.setState({"userAccount": "unable to fetch", "userAccountBalance": "unable to fetch","messageHidden": true} );
    }
  }
  async componentDidMount(){
    var ModelViewer = require('metamask-logo')
    var viewer = ModelViewer({
      pxNotRatio: true,
      width: 300,
      height: 200,
      followMouse: false,
      slowDrift: false,
    })
    var container = document.getElementById('logo-container')
    container.appendChild(viewer.container)
    viewer.lookAt({
      x: 100,
      y: 100,
    })
    viewer.setFollowMouse(true)
    viewer.stopAnimation()
  }
  render(){
    return (
    <div>
      <br/><br/><br/><br/>
      <div style={stylesheet.imageContainer}>
        <img src="/static/image.jpg" style={stylesheet.image}/>
        <div style={stylesheet.imageContent}>
          Giving is the Greatest<br/><br/><br/><br/>
          Act of Grace<br/><br/><br/><br/>
          <a href='/campaigns/'>
          <Button content='Start giving' primary size='large' />
          </a>
        </div>
      </div>
      <div style={{"marginTop": "550px","backgroundColor": "#f0ffff", "height": "100%"}}>
        <br/><br/><br/>
        <div style={{"margin": "100px 150px"}}>
          <Image src='/static/decentralized.png' size='large' style={{"display": "inline-block"}}/>
          <div style={{
            "display": "inline-block",
            "fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif",
            "fontSize": "14px",
            "letterSpacing": "0.2px",
            "fontWeight": "300", "color": "#777","marginLeft": "60px", "maxWidth": "500px"}}>
              <div>
                <h3 style={{"letterSpacing": "3px", "color": "#333333"}}>DECENTRALIZED</h3>
                <p>
                  The decentralized nature  means that it doesn’t rely on a central point of control.
                  A lack of a single authority makes the system fairer and considerably more
                  <span style={{"fontWeight": "bold"}}> secure </span>.
                </p>
                <a href='https://medium.com/@VitalikButerin/the-meaning-of-decentralization-a0c92b76a274' target='_blank'><Button content='more' primary basic/></a>
              </div>
          </div>
        </div>
        <br/>
        <div style={{"margin": "100px 150px"}}>
          <div style={{
            "display": "inline-block",
            "fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif",
            "fontSize": "14px",
            "letterSpacing": "0.2px",
            "fontWeight": "300", "color": "#777", "maxWidth": "500px"}}>
              <div>
                <h3 style={{"letterSpacing": "3px", "color": "#333333"}}>TRUSTLESS</h3>
                <p>
                  Based on Ethereum Smart Contracts it does guarantee the
                  <span style={{"fontWeight": "bold"}}> immutability </span>
                   of campaigns.
                </p>
                <a href='https://medium.com/pactum/what-is-a-smart-contract-10312f4aa7de' target='_blank'><Button content='more' primary basic/></a>
              </div>
          </div>
          <Image src='/static/smartcontract.jpg' size='large' style={{"display": "inline-block", "height": "300px", "width": "250px","marginLeft": "200px"}}/>
        </div>
      </div>
      <div style={{"backgroundColor": "#ffffff", "height":"500px", "width": "100%"}}>
        <br/><br/><br/><br/>
        <center>
          <h1 style={{"fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif", "color": "#333333", "letterSpacing": "3px"}}>How to get Ethereum Wallet?</h1>
          <br/><br/>
          <div id='logo-container'>
          </div>
          <h2 style={{"fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif", "color": "#999999", "letterSpacing": "1px"}}>METAMASK</h2>
          <p style={{"letterSpacing": "0.3px", "fontWeight": "300", "color": "#777", "marginLeft": "50px", "marginRight": "50px"}}>
            MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your browser without running a full Ethereum node.
            MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
          </p>
          <br/>
          <Button type='button'basic color='brown' onClick={(event) => {window.open("https://metamask.io/")}}>
            <span style={{"letterSpacing": "2px", "fontWeight": "bold"}}>
              Install Now
            </span>
          </Button>
        </center>
      </div>
      <div style={{"backgroundColor": "#ffffff", "height":"500px", "width": "100%"}}>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <center>
          <h1 style={{"fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif", "color": "#333333", "letterSpacing": "3px"}}>How to get Ether?</h1>
          <br/><br/>
          <Icon size='massive' name='ethereum' color='blue'/>
          <h2 style={{"fontFamily": "Open Sans, Helvetica Neue, Helvetica, sans-serif", "color": "#999999", "letterSpacing": "1px"}}>ETHEREUM</h2>
          <p style={{"letterSpacing": "0.3px", "fontWeight": "300", "color": "#777", "marginLeft": "50px", "marginRight": "50px"}}>
            Ether is the currency of the Ethereum platform.
            Ether will be required by anyone wishing to build upon or use the Ethereum platform.
            Just like Bitcoin, Ether can be traded around the web and mined.
            Most people use the term Ethereum to refer to the currency instead of Ether and that’s why it can get a bit confusing.
          </p>
          <br/>
          <Button type='button'basic primary onClick={(event) => {window.open("https://www.coinmama.com/ethereum")}}>
            <span style={{"letterSpacing": "2px", "fontWeight": "bold"}}>
              Buy Now
            </span>
          </Button>
        </center>
      </div>
      <br/><br/><br/><br/><br/><br/>
      <Layout userAccount={this.state.userAccount} userAccountBalance={this.state.userAccountBalance}
        messageHidden={this.state.messageHidden} messageType={this.state.messageType} messageContent={this.state.messageContent}
        close={this.close}>
      </Layout>
    </div>
  );
  }
}
export default Home;
