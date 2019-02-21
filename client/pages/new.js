import React, { Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from "../components/Layout";
import { Router} from '../routes';
import Web3Container from '../lib/Web3Container';


class FundNew extends Component {
  state = {
    name: "",
    description: "",
    targetAmount: "",
    minNumberDonators: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: ""});
    const {name, descrip, targetAmount, minNumberDonators} = this.state;

    try {
    const {accounts, fundContract} = this.props;
    await fundContract.methods.initializeFund(
      name,
      description,
      targetAmount,
      minNumberDonators
    )
      .send({
        from:accounts[0]
      });
      Router.pushRoute("/milestones");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false})
  };

  render() {
    return (
      <Layout>
        <h3>Step 1: Get Started Raising a Fund!</h3>
      <p>Enter information and requirements for your fund below</p>

      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Name of Fund</label>
          <Input
            value={this.state.name}
            onChange={event =>
              this.setState({ name: event.target.value })}
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
        <Form.Field>
          <label>Contribution Goal</label>
          <Input
            label="wei"
            labelPosition= "right"
            value={this.state.targetAmount}
            onChange={event =>
              this.setState({ targetAmount:event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Minimum Number of Donors</label>
          <Input
            value={this.state.minNumberDonators}
            onChange={event =>
              this.setState({ minNumberDonators:event.target.value })}
          />
        </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading ={this.state.loading} primary>Initialize Fund</Button>
        </Form>
      </Layout>
    );
  }
}


export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <FundNew
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
