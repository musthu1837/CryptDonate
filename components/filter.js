import React,{ Component } from 'react';
import {Card, Button, Grid, Image, Radio, Segment, Label, Icon, Divider, Checkbox,Input} from 'semantic-ui-react';
import _ from 'lodash'
import stylesheet from '../css/campaignsCSS'
const causes = [{ cause: "Animal Welfare",
      value: "0"
    },
    {
      cause: "Arts & Heritage",
      value: "1"
    },
    {
      cause: "Children & Youth",
      value: "2"
    },
    {
      cause: "Community",
      value: "3"
    },
    {
      cause: "Disability",
      value: "4"
    },
    { cause: "Education",
      value: "5"
    },
    {
      cause: "Elderly",
      value: "6"
    },
    { cause: "Environment",
      value: "7"
    },
    {
      cause: "Families",
      value: "8"
    },
    {
      cause: "Health",
      value: "9"
    },
    {
      cause: "Humanitarian",
      value: "10"
    },
    {
      cause: "Social Service",
      value: "11"
    },
    { cause: "Sports",
      value: "12"
    },
    { cause: "Women & Girls",
      value: "13"
    }
]
var causeState = {}
class Filter extends Component{
  constructor(props){
    super(props);
    this.state ={
      categoriesToggle: false,
      causeToggle: false,
      categoryState: true,
      causeState: causeState,
      filterToggle: true
    }
  }
  closeLoading = (filter) => {
    this.props.setMessage({
      messageHidden: true,
      data: filter
    })
  }
  handleCauseToggle = (event, { value }) => {
    if(typeof causeState[value] == "undefined"){
      causeState[value] = value
      this.setState({causeState: causeState})
    }
    else{
      delete causeState[value]
      this.setState({causeState: causeState})
    }
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    var filter = Array()
    const t = this.props.campaignsInfo
    for(var i=0;i < t.length ;i++){
      if(_.isEmpty(this.state.causeState)){
        if(t[i].isDurationDone == !this.state.categoryState){
          filter.push(t[i])
        }
      }
      else{
        if((t[i].cause in this.state.causeState) && (t[i].isDurationDone == !this.state.categoryState)){
          filter.push(t[i])
        }
      }
    }
    setTimeout(this.closeLoading, 500, filter)
  }
  handleCategoriesToggle = (event) =>{
    this.setState({"categoryState": !this.state.categoryState})
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    var filter = Array()
    const t = this.props.campaignsInfo
    for(var i=0;i < t.length ;i++){
      if(_.isEmpty(this.state.causeState)){
        if(t[i].isDurationDone == this.state.categoryState){
          filter.push(t[i])
        }
      }
      else{
        if((t[i].cause in this.state.causeState) && (t[i].isDurationDone == this.state.categoryState)){
          filter.push(t[i])
        }
      }
    }
    setTimeout(this.closeLoading, 500, filter)
  }
  handleFilterToggle = (event) => {
    this.setState({"filterToggle": !this.state.filterToggle})
    this.props.setMessage({
      messageHidden: false,
      data: this.props.filter
    })
    if(!this.state.filterToggle){
      var filter = Array()
      const t = this.props.campaignsInfo
      for(var i=0;i < t.length ;i++){
        if(_.isEmpty(this.state.causeState)){
          if(t[i].closed == !this.state.categoryState){
            filter.push(t[i])
          }
        }
        else{
          if((t[i].cause in this.state.causeState) && (t[i].closed == !this.state.categoryState)){
            filter.push(t[i])
          }
        }
      }
      setTimeout(this.closeLoading, 500, filter)
    }
    else{
      setTimeout(this.closeLoading, 500, this.props.campaignsInfo)
    }

  }
  render(){
    return (
     <Segment basic>
        <div style={stylesheet.filterHeader}>
          Filter
          <div style={stylesheet.filterHeaderClear}>
            <Checkbox toggle
              onChange={this.handleFilterToggle}
              checked={this.state.filterToggle}
            />
          </div>
        </div>
        <br/><br/>
        <div>
          <div onClick={(event) => this.setState({"categoriesToggle": this.state.categoriesToggle? false : true})} style={stylesheet.filterContentHeader}>
            CATEGORIES
            <Icon style={{"float": "right"}} name={ this.state.categoriesToggle ? "caret up" : "caret down"}/>
          </div>
          <Divider/>
          <div style={{"display":this.state.categoriesToggle ? "none" : "block"}}>
            <div style={stylesheet.filterContentCheckbox}>
              <Radio
                label="Open Campaigns"
                checked={this.state.categoryState==true}
                onChange={this.handleCategoriesToggle}
                disabled={!this.state.filterToggle}
              />
            </div>
            <br/>
            <div style={stylesheet.filterContentCheckbox}>
              <Radio
                label="Closed Campaigns"
                checked={this.state.categoryState==false}
                onChange={this.handleCategoriesToggle}
                disabled={!this.state.filterToggle}
              />
            </div>
          </div>
          <br/><br/>

          <div onClick={(event) => this.setState({"causeToggle": this.state.causeToggle? false : true})} style={stylesheet.filterContentHeader}>
            CAUSES
            <Icon style={{"float": "right"}} name={ this.state.causeToggle ? "caret up" : "caret down"}/>
          </div>
          <Divider/>
          <div style={{"display":this.state.causeToggle ? "none" : "block"}}>
            { causes.map((item, index) => {
                return(
                  <div key={index}>
                    <div style={stylesheet.filterContentCheckbox}>
                      <Checkbox
                        value={item.value}
                        label={item.cause}
                        checked={typeof causeState[item.value] !== "undefined"}
                        onChange={ this.handleCauseToggle }
                        disabled={!this.state.filterToggle}
                      />
                    </div>
                    <br/>
                  </div>
                )
            })
            }
          </div>
        </div>
     </Segment>
   );
  }
}
export default Filter;
