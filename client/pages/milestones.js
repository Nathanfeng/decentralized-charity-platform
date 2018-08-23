import React, { Component} from 'react';
import { Table, Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from "../components/Layout";
import Web3Container from '../lib/Web3Container';
import { Router} from '../routes';

class NewMilestone extends Component {

  state = {
    title: "",
    description: "",
    errorMessage: "",
    loading: false
  };


  onAdd = async (event) => {
    event.preventDefault();

    const {title, description} = this.state;

    this.setState({ loading: true, errorMessage: ""})

    try {
      const {accounts, fundContract} = this.props;
      await fundContract.methods
        .addMilestone.call()
        .send({ from: accounts[0] });

      Router.pushRoute("/show");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  onDeploy = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: ""})

    try {
      const {accounts, fundContract} = this.props;
      await fundContract.methods
        .deployFund()
        .send({ from: accounts[0]});

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderRows = async (event) => {

  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Step 2: Add Milestones to Your Fund</h3>
        <p>
          Now that you've initiated the fund, its time to add milestones
          that your donors will use to evaluate your performance. If over
          80% of your donors vote that you've achieved your milestone, then
          you will receive the next portion of your funding.
        </p>
        <p>
          The milestones will divide the total funds into equal installments
          (ie. with 2 milestones, the fund will be paid in 3 installments).
          When the fund is deployed, the first installment is paid to the fund
          manager. The fund will need at least 1 milestone to be deployed.
        </p>

        <Form onSubmit={this.onAdd} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={event =>
                this.setState({ title: event.target.value })}
              />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description:event.target.value })}
            />
          </Form.Field>
          <Button loading ={this.state.loading} primary>Add Milestone</Button>
        </Form>

        <h3>All Milestones</h3>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Title</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Pass Rate</HeaderCell>
              <HeaderCell >Meets Milestone</HeaderCell>
            </Row>
          </Header>
          {/* <Body>{this.renderRows()}</Body> */}
        </Table>

        <h3 style={{marginTop: "40px"}}>Step3: Deploy the Fund </h3>
        <p>
          After adding at least 1 milestone to your fund you can now deploy
          the fund so people can donate to it. Go ahead and hit the Deploy Fund button if
          you want to deploy and open the fund up for donations!
        </p>

        <Form onSubmit={this.onDeploy} error={!!this.state.errorMessage}>
          <button
            className="ui button"
            style = {{ marginTop: '20px'}}
          >
            Deploy Fund!
          </button>
        </Form>
      </Layout>
    );
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <NewMilestone
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
