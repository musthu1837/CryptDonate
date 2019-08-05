import React from 'react';
import {Card, Icon, Message} from 'semantic-ui-react';
import getCreatedTime from '../libraries/createdTime'
export default (props) => {
  return (
    <Card fluid>
      <Message attached header='Campaign Details' color='blue'/>
      <Card.Content title='manager details'>
        <Card.Description>
          <a href='#'> {props.campaignInfo.manager}</a>
          <Card.Meta><Icon name='user circle'/> manager</Card.Meta>
        </Card.Description>
        <Card.Description title='click to mail manager'>
          <br/>
          <Icon name='mail' />
          <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${props.contactInfo.email}`} target='_blank'>
            {props.contactInfo.email}
          </a>
        </Card.Description>
        <Card.Description title={props.contactInfo.address}>
          <br/>
          <Icon name='question circle outline' />
          <a target='_blank' href={props.contactInfo.address}>About campaign</a>
        </Card.Description>
        <Card.Description title='created time'>
          <br/>
          <Icon name='clock outline'/>
            <a href='#'>
              created {getCreatedTime(props.campaignInfo.createdTime)}
            </a>
        </Card.Description>
        <Card.Description title={`https://rinkeby.etherscan.io/address/${props.campaignAddress}`}>
          <br/>
          <Icon name='globe' />
          <a target='_blank' href={`https://rinkeby.etherscan.io/address/${props.campaignAddress}`}>
            view on EtherScan
          </a>
        </Card.Description>
        <Card.Description title='status'>
          <br/>
          <Icon name='dot circle' color={props.campaignInfo.isDurationDone?'red':'green'}/>
            <a href="#">
              {props.campaignInfo.isDurationDone?'Closed':'Running'}
            </a>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
