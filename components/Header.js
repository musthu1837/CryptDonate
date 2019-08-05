import React from 'react';
import {Menu, Dropdown, Icon} from 'semantic-ui-react';
import{Link} from '../routes' ;
import Searching from './search'
import BigNumber from 'bignumber.js'
const stylesheet = {
  "span2":{
    "letterSpacing":"2px",
    "fontSize":"20px"
  },
  "span1":{
    "fontSize":"15px"
  },
  "menu":{
    "position":"fixed",
    "top":"-14px",
    "width":"100%"
  }
}
export default (props) =>{
  return (
    <Menu size='large' borderless style={stylesheet.menu} stackable>
          <Menu.Item></Menu.Item>
          &nbsp;
          <Menu.Item>
            <a className="item" href='/'>
              <b><Icon color='red' name='heartbeat'/></b>
              &nbsp;
              <span style={stylesheet.span2}><b>Helpus</b></span>
              &nbsp;
            </a>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Searching/>
            </Menu.Item>
            <Menu.Item title='create a campaign'>
              <a href='/campaigns/new' className='item'>
                <b><Icon color='blue' name='add circle'/></b>
                &nbsp;
                <span style={stylesheet.span1}><b>Start Campaign</b></span>
                &nbsp;
              </a>
            </Menu.Item>
            <Menu.Item title='start donating'>
              <a className='item' href='/campaigns/'>
                <b><Icon color='blue' name='handshake outline'/></b>
                &nbsp;
                <span style={stylesheet.span1}><b>Donate Today</b></span>
                &nbsp;
              </a>
            </Menu.Item>
            <Menu.Item title='Metamask Account'>
                <Icon color='blue' name='user circle'/>
                <Dropdown style={stylesheet.span1} item text="Account" style={{"fontWeight": "bold", "marginLeft": "-15px"}}>
                  <Dropdown.Menu style={{"marginTop": "20px"}}>
                    <Dropdown.Item title='Account Number'>
                      <Icon color='blue' name='user'/>
                      <span style={stylesheet.span1}><b>{props.userAccount}</b></span>
                    </Dropdown.Item>
                    <Dropdown.Item title='Balance'>
                      <Icon color='blue' name='ethereum'/>
                      <span style={stylesheet.span1}><b>{(new BigNumber(props.userAccountBalance).isNaN())?props.userAccountBalance:new BigNumber(props.userAccountBalance).toFixed(3)} ETH</b></span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
          </Menu.Menu>
          &nbsp;
          <Menu.Item></Menu.Item>
        </Menu>
  );
};
