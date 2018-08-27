# Decentralized Charity Platform
Traditionally, when donors donate to a charity there is no reporting progress of the projects that are funded, or transparency around the outcome of those projects. This leads to funds being misallocated, inefficiently run projects, and low donor engagement. <br><br>

The Decentralized Charity Platform allows charities to raise a fund that gives benefactors the opportunity to play an active part in making sure the charity is accountable to their goals.

## How it works:

The charity raises a fund and sets a series of milestones that they promise to accomplish over the lifetime of the fund. The milestones segment the fund into installments, with each installment being paid out upon the donors voting that the charity has effectively met their milestone.

## User Roles:

### Fund Manager
The fund manager is the creator of the fund. The fund manager has the following permissions:<br><br>
**Initialize the Fund:**
The fund is initialized by the fund manager, who decides the title, description of the fund, the minimum number of donors and the target amount to be raised.<br>
**Add a milestone to the fund:**  
The fund manager adds milestones to the fund, which are goals that the fund will work towards. The milestones divide the fund into installments that will be paid upon the donors voting that the fund has achieved their milestone.<br>
**Deploy the fund:**  Deploying the fund opens it up to donations.<br>
**Activate the fund:**  Activating the fund releases the first installment to the fund manager to allow them to work towards the first milestone.<br>
**Move to next milestone:**  After at least half of donors vote on whether to pass the current milestone, and more than half weighted the votes to pass, the owner can trigger the next milestone. Triggering the next milestone will release the next installment to the fund manager.

### Donor
The donor is a contributor to the fund. A donor has the following permissions:  <br><br>
**Donate to the fund:**  Donors can donate to the fund, which allows them to participate in the objectives of the fund.<br>
**Vote on milestone:**  The donor can vote on whether to pass or fail a milestone depending on the charity's report on their performance. Each donor's vote weight is proportional to how much they donated to the fund.<br>
**Claim funds:**  If a milestone has failed, then all donors who had donated to the fund can retrieve their donations. Donations are returned based on the proportion of the donors donation to the total raised.<br>
## Technical Details

This project was built using [Next.js](https://github.com/zeit/next.js)
, React, Truffle and [Semantic-UI](https://react.semantic-ui.com/).

## Prerequisites

Node ([https://nodejs.org](https://nodejs.org)) <br>
Truffle (`npm install -g truffle`) <br>
Ganache-CLI (`npm install -g ganache-cli`) <br>

This project was created with a Truffle Box integrating React and Next.js and Truffle. More details on the Truffle Box can be found [here](https://github.com/adrianmcli/truffle-next).

## Running the Application in Development

### Start the Ethereum RPC Client
```
ganache-cli
```
The default port number for Ganache is `8545` If you're using the GUI the default port is `7545.`

### Configure the Application

Check on the file `truffle.js`. Make sure that the port number matches the one that Ganache uses (or other RPC client port number).
```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
```

### Run Tests for the Contract
In the root directory run:
```
truffle test
```

### Install the Dependencies
Navigate into the `decentralized-charity-platform/client` folder and run:
```
npm install
```
Navigate back into the root directory and run:
```
truffle install
truffle compile
```

### Deploy the Contract
In the root directory run:
```
truffle migrate
```
### Sign into MetaMask
With the mnemonic provided by ganache, sign into MetaMask. Make sure that metamask is connected to the right private network, `HTTP://127.0.0.1:8545`. If using the `HTTP://127.0.0.1:7545` if using ganache GUI.

### Start the Application
Navigate to the `client` folder and run:

```
npm run dev
```
Visit http://localhost:3000

### Visiting the pages in the App
The app has 4 main pages that are listed below:

Home page: http://localhost:3000  
Setting up fund: http://localhost:3000/new  
Adding milestones: http://localhost:3000/milestones  
Donor facing fund management page: http://localhost:3000/showDonor  
Fund Manager facing fund management page: http://localhost:3000/showManager  

These are the direct links to the pages but the app should automatically route as you work through the fund's lifecycle.
