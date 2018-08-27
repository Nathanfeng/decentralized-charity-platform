import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Web3Container from '../lib/Web3Container';
import MilestoneRow from './MilestoneRow';

class MilestoneTable extends Component {

  static async getInitialProps(props) {
    const {accounts, fundContract} = this.props;

    const milestoneCount = await fundContract.getMilestonesCount().call();
    const milestones = await Promise.all(
      Array(parseInt(milestoneCount))
        .fill()
        .map((element, index) => {
          return fundContract.milestones(index).call();
        })
    );

    return { accounts, milestones, milestoneCount, fundContract };
  }

    onPass = async () => {
      const {accounts, fundContract} = this.props;
      await fundContract.methods.recordVote(true).send({
        from: accounts[0]
      });
    };

    onFail = async () => {
      const {accounts, fundContract} = this.props;
      await fundContract.methods.recordVote(false).send({
        from: accounts[0]
      });
    };


  renderRows() {
    return this.props.milestones.map((milestone, index) => {
      return (
        <MilestoneRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
        />
      );
    });
  }


  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Title</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Pass Rate</HeaderCell>
            <HeaderCell>Meets Milestone</HeaderCell>
            <HeaderCell>Fails Milestone</HeaderCell>
          </Row>
        </Header>
        {/* <Body>{this.renderRows()}</Body> */}
      </Table>
    )
  }
}


export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <MilestoneTable
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
