import _ from 'lodash'
import factory from '../ethereum/donationCampaignFactory';
import donationCampaign from '../ethereum/donationCampaign';
import web3 from '../ethereum/web3';

import BigNumber from 'bignumber.js'
import{Link, Router} from '../routes' ;
import React, { Component } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
const initialState = { isLoading: false, results: [], value: '' }
const causes = ["Animal Welfare", "Arts & Heritage", "Children & Youth", "Community", "Disability", "Education", "Elderly", "Environment", "Families", "Health", "Humanitarian", "Social Service", "Sports", "Women & Girls"]
export default class SearchExampleStandard extends Component {
  state = initialState

  handleResultSelect = (e, { result }) =>( this.setState({value: result.title}) ,window.open(`http://localhost:8000/campaigns/show?address=${result.description}`))

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      const filteredResults = _.reduce(
        this.state.source,
        (memo, data, name) => {
          const results = _.filter(data.results, isMatch)
          if (results.length) memo[name] = { name, results } // eslint-disable-line no-param-reassign

          return memo
        },
        {},
      )

      this.setState({
        isLoading: false,
        results: filteredResults,
      })
    }, 300)
  }
  async componentWillReceiveProps(){
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    var source = {};
    for(var i=0;i< campaigns.length ; i++){
      const campaign = donationCampaign(campaigns[i]);
      const summary = await campaign.methods.getSummary().call();
      const isDurationDone = await campaign.methods.isDurationcompleted().call()
      source[(i+1)+". "+causes[summary[9]]] = {
          name: summary[3],
          results: [{
            title: `${summary[3]} (${isDurationDone?"Closed":"Running"})`,
            price: new BigNumber(web3.utils.fromWei(summary[4], 'ether')).toFormat(2)+"ETH",
            description: campaigns[i]
        }]
      }
    }
    this.setState({source})
  }
  render() {
    const { isLoading, value, results } = this.state
    return (
        <Search
          noResultsMessage='No campaigns found.'
          category
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
          {...this.props}
        />
    )
  }
}
