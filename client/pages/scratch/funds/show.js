import React, {Component} from "react";
import Layout from "../../components/Layout";
import Fund from "../../ethereum/fund";
import {Button, Card, Grid} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from '../../routes';


class FundShow extends Component {

  static async getInitialProps(props) {
    const fund = Fund(props.query.address);
    const summary = await fund.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount
    } = this.props;


    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager created this fund",
        style: { overflowWrap: "break-word"}
      },

      {
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description:
        'You must contribute at least this much wei to become an approver'
    },
    {
      header: requestCount,
      meta: 'Number of Requests',
      description:
        'A request tries to withdraw money from the contract. Requests must be approved by approvers'
    },
    {
      header: approversCount,
      meta: 'Number of Approvers',
      description:
        'Number of people who have already donated to this fund'
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Balance in ether",
      description: "this is how much money this fund has to spend."
    }

    ];

    return <Card.Group items= {items}/>;
  }

  render() {
      return (
        <Layout>
          <h3>Fund Show</h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

              <Grid.Column width={6}>
                <ContributeForm address={this.props.address} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Link route={`/funds/${this.props.address}/requests`}>
                  <a>
                    <Button primary>View Requests</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Layout>
      );
    }

};

export default FundShow;
