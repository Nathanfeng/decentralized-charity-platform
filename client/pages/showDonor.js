import React, {Component} from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { Form, Table, Button, Card, Grid} from "semantic-ui-react";
import ContributeForm from "../components/ContributeForm";
import { Link } from '../routes';
import Web3Container from '../lib/Web3Container';
import MilestoneTable from "../components/MilestoneTable"

class ShowDonor extends Component {

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
    title:"",
    description:'',
    milestoneCount: "",
    milestones: "",
    currentMilestone: ""
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
    let currentMilestone = milestones.filter((milestone) => milestone.acceptingVotes)[0];
    if(!currentMilestone){currentMilestone = ''};
    console.log(currentMilestone);
    this.setState({
      manager: summary[0],
      totalDonors: summary[1],
      minNumberDonators: summary[2],
      totalDonated: summary[3],
      targetAmount: summary[4],
      acceptingDonations: summary[5],
      active: summary[6].toString(),
      title: summary[7],
      description: summary[8],
      milestones,
      milestoneCount,
      currentMilestone
    });

  }

  renderRows = () => {
    const { Row, Cell } = Table;
    console.log(this.state.milestones)
    return Object.values(this.state.milestones).map((milestone, index) => {
      return (

        <Row
          disabled={!milestone.acceptingVotes}
          positive={!milestone.acceptingVotes}
        >
          <Cell>{index + 1}</Cell>
        <Cell>{milestone.name}</Cell>
        <Cell>{milestone.description}</Cell>
        <Cell>{milestone.totalVoted}</Cell>
          <Cell>
            {parseInt(milestone.passingVotes) / (parseInt(milestone.passingVotes) + parseInt(milestone.failingVotes)) ?
              Math.round(parseInt(milestone.passingVotes) / (parseInt(milestone.passingVotes) + parseInt(milestone.failingVotes)) * 100) + ' %' : 'N/A'
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
      meta: 'Total Donated in Wei',
      description:
        'The total amount donated to the fund so far in Wei'
    },
    {
      header: targetAmount,
      meta: 'Target Amount in Wei',
      description:
        'This is the minimum amount that the fund is hoping to raise in Wei'
    },
    {
      header: acceptingDonations.toString(),
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
    const {title, description, acceptingDonations, totalDonors, currentMilestone} = this.state;
      return (

        <Layout>
          <h2>{title}</h2>
          <p>{description}</p>
        <h4>
            Fund Details
        </h4>
          {this.renderCards()}

          <h3>Current Milestones</h3>
          <Table>
            <Header>
              <Row>
                <HeaderCell>#</HeaderCell>
                <HeaderCell>Title</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Total Votes</HeaderCell>
                <HeaderCell>Pass Rate</HeaderCell>
                <HeaderCell>Meets Milestone</HeaderCell>
                <HeaderCell>Fails Milestone</HeaderCell>
              </Row>
            </Header>
            <Body>{this.renderRows()}</Body>
          </Table>

          {
            acceptingDonations && (
              <div>
                <h3>Donate to this Fund</h3>
                <p>
                  When the status of the fund is "Accepting Donations" you can
                  donate to this fund
                </p>
                <ContributeForm />
              </div>
            )
          }

          {currentMilestone !== "" &&
          (parseInt(currentMilestone.totalVoted) > Math.floor(totalDonors/2) &&
            parseInt(currentMilestone.passingVotes) / (parseInt(currentMilestone.passingVotes) + parseInt(currentMilestone.failingVotes) < 0.5)) &&
            (
              <div>
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
              </div>

            )
          }



        </Layout>
      );
    }
};

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <ShowDonor
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
