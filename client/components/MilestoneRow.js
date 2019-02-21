import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
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
    const { index, milestone, onPass, onFail} = this.props;
      return (
        <Row
          disabled={!milestone.acceptingVotes}
          positive={!milestone.acceptingVotes}
        >
          <Cell>{index + 1}</Cell>
          <Cell>{milestone.name}</Cell>
          <Cell>{milestone.description}</Cell>
          <Cell>
            {milestone.passingVotes / (milestone.passingVotes + milestone.failingVotes) ?
              milestone.passingVotes / (milestone.passingVotes + milestone.failingVotes) : 'N/A'
            }
          </Cell>
          <Cell>
            {milestone.acceptingVotes ? (
              <Button color="green" basic onClick={onPass}>
                Meets Milestone
              </Button>
            ) : null}
          </Cell>
          <Cell>
            {milestone.acceptingVotes ? (
              <Button color="red" basic onClick={onFail}>
                Fails Milestone
              </Button>
            ) : null}
          </Cell>
        </Row>
      );
  }
}



export default MilestoneRow;


// () => (
//   <Web3Container
//     renderLoading={() => <div>Loading Page...</div>}
//     render={({ web3, accounts, fundContract }) => (
//       <MilestoneRow
//         web3={web3}
//         accounts={accounts}
//         fundContract={fundContract}
//       />
//     )}
//   />
// )
