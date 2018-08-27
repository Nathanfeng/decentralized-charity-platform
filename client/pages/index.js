import React, { Component } from 'react';
import { Container, Card , Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import {Link} from "../routes";
import Web3Container from '../lib/Web3Container';


class FundIndex extends Component {
  // static async getInitialProps() {
  // console.log('test');
  // const {accounts, fundContract} = this.props;
  // const summary = await this.props.fundContract.methods.fundSummary().call();

  // console.log(summary)
  // return { summary };
  // }

  renderTitle = () => {
    const {accounts, fundContract} = this.props;
    // console.log(accounts[0]);
    const outcome = fundContract.methods.owner.send({
      from:accounts[0]
    });
    console.log(outcome);
    // const summary = await this.props.fundContract.methods.fundSummary().call();
    return (
      <div>
        {/* <h3>hi</h3> */}
      {/* <h3>{fundContract.address}</h3> */}
        {/* <h4>{summary[8]}</h4> */}
      </div>
    )
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
          Here is an overview of the process that a fund manager goes through to
          raise a fund through the Decentralized Charity Platform
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
                  <div class="title">4. Activate Fund</div>
                  <div class="description">
                    Once the fundraising goal and minimum number of donors has been
                    met, you can Activate the fund. Activating the fund closes the fund
                    to donations and automatically sends you the first installment to
                    work towards your first milestone.
                  </div>
                </div>
              </div>
              <div class="completed step">
                <div class="content">
                  <div class="title">5. Update Progress and Trigger Next Milestone</div>
                  <div class="description">
                    The next step is updating your donors and waiting for them to vote on
                    whether you've achieved your milestone. If you've achieved your milestone,
                    you can trigger the next milestone, which will transfer you the next
                    installment. If the donors voted that you failed to achieve your milestone,
                    they can claim their funds.
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
              style={{marginTop: "20px", marginBottom: "10px"}}
              floated="top"
              content="Get Started Raising a Fund!"
              primary
              />
          </a>
        </Link> <br/>
        <Link route={`/showManager`} style={{marginTop: "30px"}}>
           <a>Click here to view the fund details as a fund manager</a>
        </Link>

        <h3>For Donors</h3>
        <p >
          The charities propose milestones that
          divide the fund up into equal installments that are paid out
          depending on your vote on whether they achieve each milestone.
          If donors vote that the charity did not meet its milestones,
          you have the option of retrieving your donation.
        </p>
        <div style={{ marginBottom: "30px"}}>
          <Link route={`/showDonor`}>
             <a>Click here to view the fund details as a donor </a>
          </Link>
        </div>

        </div>
      </Layout>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <FundIndex
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
