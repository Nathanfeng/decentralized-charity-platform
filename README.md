# decentralized-charity

The Decentralized Charity Platform allows charities to raise a fund that gives benefactors the opportunity to play an active part in making sure the charity is accountable to their goals.

## How it works:

The charity raises a fund and sets a series of milestones that they promise to accomplish over the lifetime of the fund. The milestones segment the fund into installments, with each installment being paid out upon the donors voting that the charity has effectively met their milestone.

## User Roles:

### Fund Manager:
The fund manager is the creator of the fund. The fund manager has the following permissions:  
**Add a milestone to the fund:**  
**Deploy the fund:**  to open it up for donations,  
**Activate the fund:**  
**Move to next milestone:**  

### Donor:
The donor is a contributor to the fund. A donor has the following permissions:
**Donate to the fund:**  
**Claim funds:**  

## Technical Details

This project was built using Next.js, React, Semantic-ui.

## Pre-requisitions

Node ([https://nodejs.org](https://nodejs.org)) <br>
Yarn ([https://yarnpkg.com](https://yarnpkg.com)) or NPM<br>
Truffle (`yarn global add truffle`) <br>
Ganache-CLI (`yarn global add ganache-cli`) <br>

Application is built with React and Truffle framework.


## Running the Application in Development

### Start the Ethereum RPC Client
```
ganache-cli
```
The default port number for Ganache is `8545`


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
With the mnemonic provided by ganache, sign into MetaMask

### Start the Application
In the `decentralized-charity-platform/client` folder and run:

```
npm run dev
```
Visit http://localhost:3000


## Notes

### Account Switching with MetaMask

The User Interface does not refresh automatically when you switch between accounts with MetaMask. To maintain display consistency, do refresh the browser every time when you switch an account with MetaMask.

### Slow Network Speed

It takes a while to get a response from the network, hence the user interface feedback might be slow. Please be patient and wait for the network to response.












The charity then periodically proposes a set of initiatives that the benefactors vote on, with each vote weighted based on the benefactor’s equity in the fund.
