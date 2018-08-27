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
    const { id, milestones, milestoneCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return milestones.map((milestone, index) => {
      return (

        <Row
          disabled={milestone.acceptingVotes}
          positive={!milestone.acceptingVotes}
        >
          <Cell>{id}</Cell>
          <Cell>{milestone.title}</Cell>
          <Cell>{milestone.description}</Cell>
          <Cell>
            {milestone.passingVotes / (milestone.passingVotes + milestone.failingVotes)}
          </Cell>
          <Cell>
            {milestone.acceptingVotes ? null : (
              <Button color="green" basic onClick={this.onPass}>
                Meets Milestone
              </Button>
            )}
          </Cell>
          <Cell>
            {milestone.acceptingVotes ? null : (
              <Button color="red" basic onClick={this.onFail}>
                Fails Milestone
              </Button>
            )}
          </Cell>
        </Row>
      );
    });

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
