import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Web3Container from '../lib/Web3Container';
import MilestoneRow from './MilestoneRow';

class MilestoneTable extends Component {
  constructor(props){
    super(props);
  }

    onPass = async () => {
      const {accounts, fundContract} = this.props;
      await fundContract.methods.recordVote(true).send({
        from: accounts[0]
      });
    }

    onFail = async () => {
      const {accounts, fundContract} = this.props;
      await fundContract.methods.recordVote(false).send({
        from: accounts[0]
      });
    }


  renderRows = () => {
    const { Row, Cell } = Table;
    const {milestones} = this.props;
    return Object.values(milestones).map((milestone, index) => {
      return (
        <MilestoneRow
          key={index}
          index={index}
          milestone={milestone}
          onFail={this.onFail}
          onPass={this.onPass}
        />
      )
    });
  }


  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Table>
        <Header>
          <Row>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Title</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Pass Rate</HeaderCell>
            <HeaderCell>Meets Milestone</HeaderCell>
            <HeaderCell>Fails Milestone</HeaderCell>
          </Row>
        </Header>
        <Body>{this.renderRows()}</Body>
      </Table>
    )
  }

}


export default MilestoneTable;

// () => (
//   <Web3Container
//     renderLoading={() => <div>Loading Page...</div>}
//     render={({ web3, accounts, fundContract }) => (
//       <MilestoneTable
//         web3={web3}
//         accounts={accounts}
//         fundContract={fundContract}
//       />
//     )}
//   />
// )
