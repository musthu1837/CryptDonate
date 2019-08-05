import React,{ Component } from 'react';
import {Card, Icon, Button, Image} from 'semantic-ui-react'

import getCreatedTime from '../libraries/createdTime'
import calculatePercentage from '../libraries/calculatePercentage'
import calculateDaysDiff from '../libraries/calculateDaysDiff'
import stylesheet from '../css/campaignsCSS'

class CampaignCard extends React.Component {
  render(){
    return(
      <Card.Group itemsPerRow={3}>
      {
        this.props.items.map((item)=>{
              return(<Card key={item.address} link href={`http://localhost:8000/campaigns/show?address=${item.address}`} raised style={{"width": "280px"}} target='_blank' fluid>
                <Image src={item.imageLink} style={{"height": "200px"}}/>
                <Card.Content>
                  <Card.Header style={stylesheet.cardImage}>
                    {item.title}
                  </Card.Header>
                  <Card.Meta>
                     created {getCreatedTime(item.createdTime)}
                     <Icon name='time' size='small'/>
                  </Card.Meta>
                  <Card.Description>
                    <div style={stylesheet.cardLine}>
                    </div>
                    <br/>
                    <div style={stylesheet.cardInfo}>
                      <h1 style={{"color": "#0099ff","display": "inline-block"}}>
                        <strong>
                          <Icon name='ethereum' style={{"marginLeft": "-7px"}}/>
                          <span style={{"display": "inline-block","marginLeft": "-4px"}}>
                            {item.totalCollected}
                          </span>
                        </strong> <span style={{"fontSize": "10px", "color": "#999999"}}>ETH</span>
                      </h1>
                      <div style={stylesheet.cardPercentageOutline}>
                        <div style={{"border": "5px solid green", "borderRadius": "4px","width": `${calculatePercentage(item.totalCollected,item.goal)}%` , "maxWidth": "100%"}}>
                        </div>
                      </div>
                      <div>
                        <span style={stylesheet.cardCollectedDes}> {calculatePercentage(item.totalCollected,item.goal)}%</span>
                        <span style={stylesheet.cardTime}> {item.isDurationDone?"":calculateDaysDiff(item.createdTime, item.noOfDays)}</span>
                      </div>
                    </div>
                  </Card.Description>
                  <Card.Content extra title="polled votes">
                    <br/><br/><br/>
                    <div className='ui two buttons' disabled>
                      <Button basic color='green'>
                        Legitimate({item.validCount})
                      </Button>
                      <Button basic color='red'>
                        Fraud({item.donatorsCount-item.validCount})
                      </Button>
                    </div>
                  </Card.Content>
                </Card.Content>
              </Card>)

          })
      }
      </Card.Group>
    )
  }
}
export default CampaignCard;
