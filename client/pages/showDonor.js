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
    const milestoneCount = 0;
    const {accounts, fundContract} = this.props;
    // const milestoneCount = await fundContract.methods.getMilestonesCount().call();
    console.log(milestoneCount);
    const milestones = await Promise.all(
      Array(parseInt(milestoneCount))
        .fill()
        .map((element, index) => {
          return fundContract.methods.milestones(index).call();
        })
    );
    // console.log(milestones);
    const summary = await fundContract.methods.fundSummary().call();
    console.log(summary);
    return {
      address: summary[0],
      totalDonors: summary[1],
      minNumberDonators: summary[2],
      totalDonated: summary[3],
      targetAmount: summary[4],
      acceptingDonations: summary[5],
      active: summary[6],
      title: summary[7],
      description: summary[8],
      milestones,
      milestoneCount,
      fundContract,
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
      fundContract,
      title,
      description,
      milestoneCount
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
        'Whether you can donate to the fund'
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
          <h4>
            Current Status of Fund, fund manager, target # donors,
            target to raise
          </h4>
          {this.renderCards()}

          <h3>Donate to this Fund</h3>
          <p>
            When the status of the fund is "Accepting Donations" you can
            donate to this fund
          </p>
          <ContributeForm />


          <h4>Current Milestones</h4>
          {/* <MilestoneTable/> */}

          <h3>Claim Funds</h3>
          <p>
            Once the the donors vote and pass the milestone, the manager of
            the fund can move the fund on to the next milestone. moving to the
            next milestone will pay the fund the next installment and open up voting
            on the next milestone.
          </p>
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
