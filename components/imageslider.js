  import React,{ Component } from 'react';
import {Label, Icon} from 'semantic-ui-react';
const ImageSlider = (props) =>{
  const stylesheet = {
    "cardsContainer": {
      "position": "absolute",
      "borderRadius": "5px",
      "overflow": "hidden",
      "width":"750px",
      "height": "470px"
    },
    "cardsSlider": {
      "position": "relative",
      "margin": "0px",
      "height": "500px",
      "borderRadius":"5px",
      "transition":"transform 300ms cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      "transform":"translateX("+(-1*props.currentIndex*750)+"px)",
      "width": props.images.length*750+"px"
    },
    "cardsSliderButtons": {
      "position": "relative",
      "top": "-70px"
    },
    "card": {
      "display": "inline-block",
      "width": "750px",
      "height": "500px",
      "margin": "0px",
      "padding": "0px"
    },
    "buttonGroup": {
      "marginLeft":"10px",
      "cursor":"pointer",
      "border": "1px solid orange"
    }
  }
  //onMouseEnter={(event) => clearInterval(props.interval)} onMouseLeave={(event) => props.setStateInterval()}
  return (
    <div>
      <div style={stylesheet.cardsContainer}>
        <div style={stylesheet.cardsSlider}>
          {
            props.images.map((image, index) => {;
              return(
                <div style={stylesheet.card} key={index}>
                  <img src={image} height={500} width={750}/>
                </div>
              )
            })
          }
        </div>
        <center>
          <div style={stylesheet.cardsSliderButtons}>
            {
              props.images.map((image, index) => {
                return (
                  <Label circular empty color={(props.currentIndex == index)?"orange":null} style = {stylesheet.buttonGroup} key={index} value={index} onClick={props.jumpCurrentIndex}/>
                )
              })
            }
          </div>
        </center>
        <div style={{"position": "relative", "top": "-310px"}}>
          <Icon
            color='orange'
            style={{"float": "left", "cursor": "pointer"}}
            name='angle left'
            size='huge'
            onClick={props.previous}
            disabled={props.currentIndex==0}
          />
          <Icon
            style={{"float": "right", "cursor": "pointer"}}
            color='orange'
            name='angle right'
            size='huge'
            onClick={props.next}
            disabled={props.currentIndex==props.images.length-1}
          />
        </div>
      </div>
    </div>

  )
}
export default ImageSlider;
