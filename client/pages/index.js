import React, { Component } from 'react';
import { Container, Card , Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import {Link} from "../routes";
import Web3Container from '../lib/Web3Container';


class FundIndex extends Component {

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
        <div className="ui two column grid">
          <div className="column">
            <div className="ui fluid vertical steps">
              <div className="completed step">
                <div className="content">
                  <div className="title">1. Initiate a Fund</div>
                <div className="description">
                    Get started by providing basic information about the fund
                    you're raising like title, description, min number of donors,
                    and target amount to raise.
                  </div>
                </div>
              </div>
              <div className="completed step">
                <div className="content">
                  <div className="title">2. Add Milestones</div>
                <div className="description">
                    Milestones will divide the fund into equal installments that
                    will be paid depending on the charity reaching those milestones.
                    If the the milestones are not reached donors can opt to retrieve
                    their funds.
                  </div>
                </div>
              </div>
              <div className="completed step">
                <div className="content">
                  <div className="title">3. Start Fundraising</div>
                <div className="description">
                    Starting fundraising opens the fund for donors to donate to your
                    cause.
                  </div>
                </div>
              </div>
              <div className="completed step">
                <div className="content">
                  <div className="title">4. Activate Fund</div>
                <div className="description">
                    Once the fundraising goal and minimum number of donors has been
                    met, you can Activate the fund. Activating the fund closes the fund
                    to donations and automatically sends you the first installment to
                    work towards your first milestone.
                  </div>
                </div>
              </div>
              <div className="completed step">
                <div className="content">
                  <div className="title">5. Update Progress and Trigger Next Milestone</div>
                <div className="description">
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
