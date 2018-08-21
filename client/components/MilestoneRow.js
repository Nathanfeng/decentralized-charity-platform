import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import Web3Container from '../lib/Web3Container';


class MilestoneRow extends Component {
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

  render() {
    const { Row, Cell } = Table;
    const { id, milestone, milestoneCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.title}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>
          {request.passingVotes}/{milestone.totalVoted}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onPass}>
              Meets Milestone
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="red" basic onClick={this.onFail}>
              Fails Milestone
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <MilestoneRow
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
