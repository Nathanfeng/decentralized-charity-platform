import React, { Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router} from '../../routes';

class NewMilestone extends Component {

  render() {
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
        <h5>This Fund Currently Has {} Milestones</h5>
        <div class="ui form">
          <div class="field">
            <label>Title of Milestone</label>
            <input type="text"/>
          </div>
          <div class="field">
            <label>Details of Milestone</label>
            <textarea></textarea>
          </div>
        </div>

        <button
          class="ui button"
          style = {{ marginTop: '20px'}}
        >
          Add Milestone
        </button>

        <h3 style={{marginTop: "40px"}}>Step3: Deploy the Fund </h3>
        <p>
          After adding at least 1 milestone to your fund you can now deploy
          the fund so people can donate to it. Go ahead and hit the Deploy Fund button if
          you want to deploy and open the fund up for donations!
        </p>

        <button
          class="ui button"
          style = {{ marginTop: '20px'}}
        >
          Deploy Fund!
        </button>
      </Layout>
    );
  }
}

export default NewMilestone;
