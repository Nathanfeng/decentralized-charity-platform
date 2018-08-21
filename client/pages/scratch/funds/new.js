import React, { Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router} from '../../routes';

class FundNew extends Component {
  state = {
    contributionGoal: "",
    minNumberDonators: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: ""})

    try {
    const accounts = await web3.eth.getAccounts();
    await factory.methods
      .initiateFund(this.state.contributionGoal, this.state.minNumberDonators )
      .send({
        from:accounts[0]
      });
      console.log(this.state.contributionGoal, this.state.minNumberDonators);
      //after creating the campaign from campaings/new, bring to home
      Router.pushRoute("/funds/milestone");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false})
  };

  render() {
    return (
      <Layout>
        <h3>Step 1: Get Started Raising a Fund!</h3>
      <p></p>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Contribution Goal</label>
          <Input
            label="wei"
            labelPosition= "right"
            value={this.state.contributionGoal}
            onChange={event =>
              this.setState({ contributionGoal:event.target.value })}
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

        <Form.Field>
          <label>Name of Fund</label>
          <Input
            value={this.state.minNumberDonators}
            onChange={event =>
              this.setState({ minNumberDonators:event.target.value })}
          />
        </Form.Field>


          <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading ={this.state.loading} primary>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default FundNew;
