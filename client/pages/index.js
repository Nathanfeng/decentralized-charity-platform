import React, { Component } from 'react';
import { Container, Card , Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import {Link} from "../routes";
import Web3Container from '../lib/Web3Container';


class FundIndex extends Component {
  static async getInitialProps() {
  const {accounts, fundFactoryContract} = this.props;
  const funds = await fundFactoryContract.methods.getInitiatedFunds().call({from: accounts[0]});

  return { funds };
  }

  renderDeployedFunds() {


    const items = this.props.funds.map(address => {
    // const items = funds.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }



  render() {
    return (
      <Layout>
        <h2>What Does the Platform Do?</h2>
        <p>
          The Decentralized Charity Platform allows charities to raise a
          fund that gives benefactors transparency on the progress of
          the project their donations fund, as well as a means to keep
          the charity accountable to their goals.
        </p>

        <h2>How Does it Work?</h2>
      <h3>For Charities</h3>

        <p>
          The Decentralized Charity Platform allows charities to raise a
          fund that gives benefactors transparency on the progress of
          the project their donations fund, as well as a means to keep
          the charity accountable to their goals.
        </p>
        <Container>
        <div class="ui two column grid">
          <div class="column">
            <div class="ui fluid vertical steps">
              <div class="completed step">
                <div class="content">
                  <div class="title">1. Initiate a Fund</div>
                  <div class="description">
                    Get started by providing basic information about the fund
                    you're raising like title, description, min number of donors,
                    and target amount to raise.
                  </div>
                </div>
              </div>
              <div class="completed step">
                <div class="content">
                  <div class="title">2. Add Milestones</div>
                  <div class="description">
                    Milestones will divide the fund into equal installments that
                    will be paid depending on the charity reaching those milestones.
                    If the the milestones are not reached donors can opt to retrieve
                    their funds.
                  </div>
                </div>
              </div>
              <div class="completed step">
                <div class="content">
                  <div class="title">3. Start Fundraising</div>
                  <div class="description">
                    Starting fundraising opens the fund for donors to donate to your
                    cause.
                  </div>
                </div>
              </div>
              <div class="completed step">
                <div class="content">
                  <div class="title">4. Close Fundraising</div>
                  <div class="description">
                    Once the fundraising goal and minimum number of donors has been
                    met, you can close the fund to donations. Closing the fund automatically
                    sends you the first installment to work towards your first milestone.
                  </div>
                </div>
              </div>
              <div class="completed step">
                <div class="content">
                  <div class="title">5. Update Progress and Open Voting</div>
                  <div class="description">
                    After achieving your milestone, in order to receive the payment for the
                    next installment, you will update donors so they may vote whether to
                    release the funds for the next installment. Updates continue until all funds
                    are exhausted.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

        <div>
        <Link route="/new">
          <a>
            <Button
              style={{marginTop: "20px"}}
              floated="top"
              content="Get Started Raising a Fund!"
              primary
              />
          </a>
        </Link>

        <h3>For Donors</h3>
        <p>
          Browse through the funds displayed below to support charities
          working various causes. The charities propose milestones that
          divide the fund up into equal installments that are paid out
          depending on your vote on whether they achieve each milestone.
          If donors vote that the charity did not meet its milestones,
          they have the option of retrieving their donations.
        </p>

        <h2>Donate to These Causes</h2>
        <p>
          These are the funds that have been fully set up by a charity and are
          ready for benefactors can start donating to.
        </p>
        {/* {this.renderDeployedFunds()} */}
        <h2>Funds to be Deployed</h2>
        <p>
          These are the funds that have been started by a charity but are
          not yet ready for donations
        </p>
        </div>
      </Layout>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundFactoryContract }) => (
      <FundIndex
        web3={web3}
        accounts={accounts}
        fundFactoryContract={fundFactoryContract}
      />
    )}
  />
)
