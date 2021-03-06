import React, { Component} from 'react';
import { Table, Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from "../components/Layout";
import Web3Container from '../lib/Web3Container';
import { Router} from '../routes';

class NewMilestone extends Component {

  state = {
    title: "",
    description: "",
    addErrorMessage: "",
    deployErrorMessage: "",
    addLoading: false,
    deployLoading: false
  };

  onAdd = async (event) => {
    event.preventDefault();
    this.setState({ addLoading: true, errorMessage: ""})
    const {title, description} = this.state;

    try {
      const {accounts, fundContract} = this.props;
      await fundContract.methods
        .addMilestone(title, description)
        .send({ from: accounts[0] });

      this.setState({
        addErrorMessage: "",
        title: "",
        description: ""
       });
      Router.pushRoute("/milestones");
    } catch (err) {
      this.setState({ addErrorMessage: err.message });
    }

    this.setState({ addLoading: false });
  };

  onDeploy = async (event) => {
    event.preventDefault();
    this.setState({ deployLoading: true, errorMessage: ""})

    try {
      const {accounts, fundContract} = this.props;
      await fundContract.methods
        .deployFund()
        .send({ from: accounts[0]});

      Router.pushRoute("/showManager");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ deployLoading: false });
  };


  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Step 2: Add Milestones to Your Fund</h3>
        <p>
          Now that you've initialized the fund, its time to add milestones
          that your donors will use to evaluate your performance. If over
          50% of votes that are that you've achieved your milestone, then
          you will receive the next portion of your funding.
        </p>
        <p>
          The milestones will divide the total funds into equal installments
          (ie. with 2 milestones, the fund will be paid in 3 installments).
          When the fund is deployed, the first installment is paid t. The
          fund will need at least 1 milestone to be deployed.
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

        <h3 style={{marginTop: "40px"}}>Step3: Deploy the Fund </h3>
        <p>
          After adding at least 1 milestone to your fund you can now deploy
          the fund so people can donate to it. Go ahead and hit the Deploy Fund button if
          you want to deploy and open the fund up for donations!
        </p>

        <Form onSubmit={this.onDeploy} error={!!this.state.errorMessage}>
          <Button loading ={this.state.loading} primary>Deploy Fund!</Button>
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
