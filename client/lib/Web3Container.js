import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import FundFactory from './contracts/FundFactory.json'
import Fund from './contracts/Fund.json'

export default class Web3Container extends React.Component {
  state = {
    web3: null,
    accounts: null,
    fundContract: null,
    fundFactoryContract: null
  };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const fundContract = await getContract(web3, Fund)
      const fundFactoryContract = await getContract(web3, FundFactory)
      // console.log(Fund.networks[networkId].address, FundFactory.networks[networkId].address);

      this.setState({ web3, accounts, fundContract, fundFactoryContract })
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, fundContract, fundFactoryContract } = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, fundContract, fundFactoryContract })
      : this.props.renderLoading()
  }
}
