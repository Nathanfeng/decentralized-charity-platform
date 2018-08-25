import React, {Component} from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { Form, Table, Button, Card, Grid} from "semantic-ui-react";
import ContributeForm from "../components/ContributeForm";
import { Link } from '../routes';
import Web3Container from '../lib/Web3Container';
import MilestoneTable from "../components/MilestoneTable"
// import RequestRow from '../components/RequestRow';


class FundShow extends Component {

  state = {
    errorMessage: "",
    loading: false
  };

  static async getInitialProps(props) {
    const {accounts, fundContract} = this.props;
    // const milestoneCount = await fundContract.methods.getMilestonesCount().call();
    // const milestones = await Promise.all(
    //   Array(parseInt(milestoneCount))
    //     .fill()
    //     .map((element, index) => {
    //       return fundContract.methods.milestones(index).call();
    //     })
    // );
    // console.log(milestones);
    // const summary = await fundContract.methods.fundSummary().call();

    return {
      address: summary[0],
      totalDonors: summary[1],
      minNumberDonators: summary[2],
      totalDonated: summary[3],
      targetAmount: summary[4],
      acceptingDonations: summary[5],
      active: summary[6],
      milestones,
      fundContract,
      milestoneCount,
      accounts
    };

  }

  renderCards() {
    const {
      manager,
      totalDonors,
      minNumberDonators,
      totalDonated,
      targetAmount,
      acceptingDonations,
      active,
      accounts,
      fundContract
    } = this.props;


    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager created this fund",
        style: { overflowWrap: "break-word"}
      },

      {
      header: totalDonors,
      meta: 'Total Donors',
      description:
        'This is the total number of addresses that have donated to the fund'
    },
    {
      header: minNumberDonators,
      meta: 'Minimum Number of Donors',
      description:
        'The minimum number of donors for the fund to be deployed'
    },
    {
      header: totalDonated,
      meta: 'Total Donated',
      description:
        'The total amount donated to the fund so far'
    },
    {
      header: targetAmount,
      meta: 'Target Amount',
      description:
        'This is the minimum amount that the fund is hoping to raise'
    },
    {
      header: acceptingDonations,
      meta: 'Accepting Donations',
      description:
        'Number of people who have already donated to this fund'
    },
    {
      header: active,
      meta: 'Fund Acive',
      description:
        'The fund has been activated by the fund manager'
    }
  ];

    return <Card.Group items= {items}/>;
  }

  onActivate = async () => {
    event.preventDefault();

    try {
    // const {accounts, fundContract} = this.props;
    await fundContract.methods.activateFund()
      .send({
        from:accounts[0]
      });
      Router.pushRoute("/milestones");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false})
  }

  onNextMilestone = async () => {
    event.preventDefault();

    try {
    // const {accounts, fundContract} = this.props;
    await fundContract.methods.nextMilestone()
      .send({
        from:accounts[0]
      });
      Router.pushRoute("/milestones");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false})

  }
  onClaim = async () => {
    event.preventDefault();

    try {
    const {accounts, fundContract} = this.props;
    await fundContract.methods.claimFunds()
      .send({
        from:accounts[0]
      });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false})

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
    const {accounts, fundContract, milestones} = this.props;

    return this.props.milestones.map((milestone, index) => {
      return (

        <Row
          disabled={milestone.acceptingVotes}
          positive={!milestone.acceptingVotes}
        >
          <Cell>0</Cell>
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


  render() {
    const { Header, Row, HeaderCell, Body } = Table;
      return (

        <Layout>
          <h2>Fund Name</h2>
          <h4>
            Current Status of Fund, fund manager, target # donors,
            target to raise
          </h4>
          <h3>Donate to this Fund (Donors)</h3>
          <p>
            When the status of the fund is "Accepting Donations" you can
            donate to this fund
          </p>
          <ContributeForm />

        <h3>Activate Fund (Fund Manager)</h3>
          <p>
            Once the minimum number of donors and target amount has been
            raised, the fundManager can activate the fund, which pays out the
            first installment of the donations.
          </p>

          <Form
            onSubmit={this.onActivate}
            error={!!this.state.errorMessage}
          >
            <Button
              primary
            >
              Activate Fund
            </Button>
          </Form>


          <h4>Current Milestones</h4>
          {/* <MilestoneTable/> */}

          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Title</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Pass Rate</HeaderCell>
                <HeaderCell>Meets Milestone</HeaderCell>
              </Row>
            </Header>
            {/* <Body>{this.renderRows()}</Body> */}
          </Table>

          <h3>Next Milestone (Fund Manager)</h3>
          <p>
            Once the the donors vote and pass the milestone, the manager of
            the fund can move the fund on to the next milestone. moving to the
            next milestone will pay the fund the next installment and open up voting
            on the next milestone.
          </p>

          <Form
            onSubmit={this.onNextMilestone}
            error={!!this.state.errorMessage}
          >
            <Button primary>Next Milestone</Button>
          </Form>

          <h3>Claim Funds (Donors)</h3>
          <p>
            If the donors vote that the charity did not complete the milestone,
            then they have the option to claim their funds. When donors claim funds,
            they will be refunded the proportion that they had donated to the fund of
            the remaining funds.
          </p>

          <Form
            onSubmit={this.onClaim}
            error={!!this.state.errorMessage}
          >
            <Button primary>Claim Funds </Button>
          </Form>

        </Layout>
      );
    }
};

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <FundShow
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)