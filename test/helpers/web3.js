const pify = require('./pify/index');

const ethAsync = pify(web3.eth);

module.exports = {
  ethGetBalance: ethAsync.getBalance,
  ethSendTransaction: ethAsync.sendTransaction,
  ethGetBlock: ethAsync.getBlock,
  ethGetTransaction: ethAsync.getTransaction,
};
