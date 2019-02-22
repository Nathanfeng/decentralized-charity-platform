import React, {Component} from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { Form, Table, Button, Card, Grid} from "semantic-ui-react";
import ContributeForm from "../components/ContributeForm";
import { Link } from '../routes';
import Web3Container from '../lib/Web3Container';
import MilestoneTable from "../components/MilestoneTable"


class ShowManager extends Component {

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
    description:"",
    milestoneCount: "",
    milestones: ""
  };

  componentDidMount = async () => {
    const {accounts, fundContract} = this.props;
    const milestoneCount = await fundContract.methods.getMilestonesCount().call();
    const summary = await fundContract.methods.fundSummary().call();
    this.setState({
      manager: summary[0],
      totalDonors: summary[1],
      minNumberDonators: summary[2],
      totalDonated: summary[3],
      targetAmount: summary[4],
      acceptingDonations: summary[5].toString(),
      active: summary[6],
      title: summary[7],
      description: summary[8],
      milestoneCount,
      fundContract,
      accounts
    });

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
      fundContract,
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
        'The total amount donated to the fund so far'
    },
    {
      header: targetAmount,
      meta: 'Target Amount in Wei',
      description:
        'This is the minimum amount that the fund is hoping to raise'
    },
    {
      header: acceptingDonations,
      meta: 'Accepting Donations',
      description:
        'Number of people who have already donated to this fund in Wei'
    },
    {
      header: active.toString(),
      meta: 'Fund Acive',
      description:
        'Whether the fund has been activated by the fund manager'
    }
  ];

    return <Card.Group items= {items}/>;
  }

  onActivate = async () => {
    event.preventDefault();

    try {
    const {accounts, fundContract} = this.props;
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
    const {accounts, fundContract} = this.props;
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



  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    const {title, description, active} = this.state;
      return (

        <Layout>
          <h2>{title}</h2>
          <p>{description}</p>
          <h4>
            Fund Stats
          </h4>
          {this.renderCards()}

          {
            !active && (
              <div>
                <h3>Step 4: Activate Fund </h3>
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
              </div>
            )
          }

          <h3>Step 5: Next Milestone</h3>
          <p>
            Once you've exhausted your funds or have achieved your milestone, send a report to donors on your progress. This will allow them to vote on whether you've achieved those milestones. Once the the donors vote and pass the milestone, you can move the fund on to the next milestone by clicking below. Moving to the next milestone will pay the fund manager the next installment and open up voting on the next milestone.
          </p>

          <Form
            style={{ marginBottom: "30px"}}
            onSubmit={this.onNextMilestone}
            error={!!this.state.errorMessage}
          >
            <Button primary>Next Milestone</Button>
          </Form>

        </Layout>
      );
    }
};

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <ShowManager
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
