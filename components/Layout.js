import React from 'react';
import Header from './Header';
import Head from 'next/head'
import {Container, Message, Segment} from 'semantic-ui-react';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share'
import { WhatsappShareButton ,FacebookShareButton, TwitterShareButton } from 'react-share'
export default (props) => {
  return (
    <div>
      <div style={{"marginLeft": "60px","marginRight": "60px"}}>
          <Head>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
            <link rel='stylesheet' media='screen and (min-width: 701px) and (max-width: 900px)' href='/static/1.css' />

          </Head>
          {props.children}
      </div>
      <Segment style={{"height": "100px", "marginBottom": "0px"}}>
        <center>
          <p><b>&nbsp;&nbsp;Share this page</b></p>
          <div title="share">
            <FacebookShareButton style={{ "cursor": "pointer", "display": "inline-block", "marginLeft": "10px"}}
              url={(typeof window !== 'undefined')? window.location.href: ""} hashtag='#Helpus'>
              <FacebookIcon size={40} round={true} />
            </FacebookShareButton>
            <TwitterShareButton style={{ "cursor": "pointer", "display": "inline-block", "marginLeft": "10px"}}
              url={(typeof window !== 'undefined')? window.location.href: ""} hashtags={["Helpus","Dapp","Donation"]}>
              <TwitterIcon size={40} round={true} />
            </TwitterShareButton>
            <WhatsappShareButton style={{ "cursor": "pointer", "display": "inline-block", "marginLeft": "10px"}}
              url={(typeof window !== 'undefined')? window.location.href: ""}>
              <WhatsappIcon size={40} round={true} />
            </WhatsappShareButton>
          </div>
        </center>
      </Segment>
      <Header userAccount={props.userAccount} userAccountBalance={props.userAccountBalance}/>
      <div style={{"width": "230px","position": "fixed", "top": "100px","left": "40%","cursor": "pointer"}}>
        <Message
          positive ={props.messageType}
          hidden={props.messageHidden}
          error = {props.messageType == false}>
          <p>
            {props.messageContent}
          </p>
        </Message>
      </div>
    </div>
  );
};
