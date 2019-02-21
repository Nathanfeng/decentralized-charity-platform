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
    loading: false,
    manager:"",
    totalDonors:"",
    minNumberDonators:"",
    totalDonated:"",
    targetAmount:"",
    acceptingDonations:"",
    active:"",
    accounts:"",
    fundContract:"",
    milestoneCount: "",
    milestones: ""
  };

  componentDidMount = async () => {
    const {accounts, fundContract} = this.props;
    const milestoneCount = await fundContract.methods.getMilestonesCount().call();
    const summary = await fundContract.methods.fundSummary().call();
    const milestones = await Promise.all(
      Array(parseInt(milestoneCount))
        .fill()
        .map((element, index) => {
          return fundContract.methods.milestones(index).call();
        })
    );
    this.setState({
      manager: summary[0],
      totalDonors: summary[1],
      minNumberDonators: summary[2],
      totalDonated: summary[3],
      targetAmount: summary[4],
      acceptingDonations: summary[5].toString(),
      active: summary[6].toString(),
      title: summary[7],
      description: summary[8],
      milestones,
      milestoneCount,
      fundContract,
      accounts
    });

  }

  renderRows = () => {
    const { Row, Cell } = Table;
    return Object.values(this.state.milestones).map((milestone, index) => {
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
              <Button color="green" basic onClick={this.onPass}>
                Meets Milestone
              </Button>
            ) : null}
          </Cell>
          <Cell>
            {milestone.acceptingVotes ? (
              <Button color="red" basic onClick={this.onFail}>
                Fails Milestone
              </Button>
            ) : null}
          </Cell>
        </Row>
      );
    });

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

  renderCards = ()=> {
    const {
      manager,
      totalDonors,
      minNumberDonators,
      totalDonated,
      targetAmount,
      acceptingDonations,
      active,
      accounts,
      fundContract,
      title,
      description,
      milestoneCount
    } = this.state;


    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager that created this fund",
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
        'Whether you can donate to the fund'
    },
    {
      header: active,
      meta: 'Fund Active',
      description:
        'Whether the fund has been activated by the fund manager'
    }
  ];

    return <Card.Group items= {items}/>;
  }

  onClaim = async (event) => {
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


  render() {
    const { Header, Row, HeaderCell, Body } = Table;
      return (

        <Layout>
          <h2>{this.props.title}</h2>
          <p>{this.props.description}</p>
        <h3>
            Fund Details
        </h3>
          {this.renderCards()}

          <h3>Current Milestones</h3>
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

          <h3>Donate to this Fund</h3>
          <p>
            When the status of the fund is "Accepting Donations" you can
            donate to this fund
          </p>
          <ContributeForm />

          <Link route={`/showManager`} style={{marginTop: "30px"}}>
             <a>Click here to view the fund details as a fund manager</a>
          </Link>





          <h3>Claim Funds</h3>
          <p>
            Once the the donors vote and pass the milestone, the manager of
            the fund can move the fund on to the next milestone. Moving to the
            next milestone will pay the fund the next installment and open up voting
            on the next milestone.
          </p>
          <p>
            If the donors vote that the charity did not complete the milestone,
            then they have the option to claim their funds. When donors claim funds,
            they will be refunded the proportion that they had donated to the fund from
            the remaining funds.
          </p>

          <Form
            style={{ marginBottom: "30px"}}
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
