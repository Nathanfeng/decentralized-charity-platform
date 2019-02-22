// import React, { Component} from 'react';
import {Menu} from 'semantic-ui-react';
import { Link } from '../routes';
import Web3Container from '../lib/Web3Container';


export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Page...</div>}
    render={({ web3, accounts, fundContract }) => (
        <div style={{marginBottom: "30px"}}>
          <div className="ui secondary pointing menu">
            <Link route="/">
            <a className="active item">
              Home
            </a>
            </Link>
            <Link route="/new">
              <a className="item">
                Raise a Fund
              </a>
            </Link>
            <Link route="/showManager">
              <a className="item">
                Fund Managers
              </a>
            </Link>
            <Link route="/showDonor">
              <a className="item">
                Donors
              </a>
            </Link>
            <Menu.Menu position="right">
              <a className="item">
                Current Account: {accounts[0]}
              </a>
            </Menu.Menu>
          </div>
        </div>
    )}
  />
)
