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

This project was built using [Next.js](https://github.com/zeit/next.js)
, React, Truffle and [Semantic-UI](https://react.semantic-ui.com/).

## Pre-requisitions

Node ([https://nodejs.org](https://nodejs.org)) <br>
Truffle (`npm install -g truffle`) <br>
Ganache-CLI (`npm install -g ganache-cli`) <br>

This project was created with a boilerplate library integrating React and Next.js and Truffle. More details on the boilerplate can be found [here](https://github.com/adrianmcli/truffle-next).

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
With the mnemonic provided by ganache, sign into MetaMask. Make sure that metamask is connected to the right private network. `HTTP://127.0.0.1:7545` if using ganache GUI.

### Start the Application
In the `decentralized-charity-platform/client` folder and run:

```
npm run dev
```
Visit http://localhost:3000

### Visiting the pages in the App
The app has 4 main pages that are listed below:

Home page: http://localhost:3000  
Setting up fund: http://localhost:3000/new  
Adding milestones: http://localhost:3000/milestones  
Managing the fund: http://localhost:3000/show  

The app should automatically route between the pages depending on the phase in the fund's lifecycle.
