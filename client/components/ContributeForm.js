import React, {Component} from 'react';
import {Form, Input, Message, Button} from "semantic-ui-react";
import { Router } from "../routes";
import Web3Container from '../lib/Web3Container';


class ContributeForm extends Component {

  state = {
    value: ""
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const {accounts, fundContract} = this.props;
      await fundContract.methods.makeDonation().send({
        from: accounts[0],
        value: this.state.value
      });

      Router.replaceRoute(`/show`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="wei"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
      <ContributeForm
        web3={web3}
        accounts={accounts}
        fundContract={fundContract}
      />
    )}
  />
)
