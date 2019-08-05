import React, { Component } from 'react';
import { Table, Icon} from 'semantic-ui-react';
import getCreatedTime from '../libraries/createdTime'
import web3 from '../ethereum/web3'
class TransactionRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const transaction = this.props.transaction
    return (
      <Row active={this.props.userAccount == transaction.sender}>
        <Cell> {transaction.sender}</Cell>
        <Cell> {transaction.amount} ETH</Cell>
        <Cell> {getCreatedTime(transaction.createdTime)} </Cell>
        <Cell> {
            transaction.direction?
              <Icon name='arrow alternate circle right outline' color='red'/>
              : <Icon color='red' name='arrow alternate circle left outline' color='green'/>
            }
        </Cell>
      </Row>
    );
  }
}

export default TransactionRow;
