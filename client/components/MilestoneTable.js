import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Web3Container from '../lib/Web3Container';
// import MilestoneRow from './MilestoneRow';

class MilestoneTable extends Component {

  static async getInitialProps(props) {
    const {accounts, fundContract} = this.props;
    const address = accounts[0];

    const milestoneCount = await fundContract.getMilestonesCount().call();
    const milestones = await Promise.all(
      Array(parseInt(milestoneCount))
        .fill()
        .map((element, index) => {
          return fundContract.milestones(index).call();
        })
    );

    return { address, milestones, milestoneCount };
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

  renderRows = () => {
    const { Row, Cell } = Table;
    const { id, milestones, milestoneCount } = this.props;

    // this.props.milestones.map((milestone, index) => {
    //   return (
    //     <MilestoneRow
    //       key={index}
    //       id={index}
    //       milestone={milestone}
    //       address={this.props.address}
    //       approversCount={this.props.milestoneCount}
    //     />
    //   );
    // });

    return this.props.milestones.map((milestone, index) => {
      return (


        <Row
          disabled={milestone.acceptingVotes}
          positive={!milestone.acceptingVotes}
        >
          <Cell>{id}</Cell>
          <Cell>{milestone.title}</Cell>
          <Cell>{milestone.description}</Cell>
          <Cell>
            {milestone.passingVotes}/{milestone.totalVoted}
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
        <Body>{this.renderRows()}</Body>
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
