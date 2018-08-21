// const FundFactory = artifacts.require("./contracts/Fund.sol");

contract('Pizza', (accounts) => {
    let owner = accounts[0];
    let friend = accounts[1];
    let pizza;

    beforeEach(async () => {
        pizza = await Pizza.new({from:owner});
      });

      it("should allow a friend to purchase pizza", async () => {
        const _hash = await pizza.toHash(2, 100);
        const sig = await web3.eth.sign(owner, _hash);
        await pizza.sendEth({from:owner, value:1000});
        const result = await pizza.orderPizza(sig, owner, 2, 100, { from: friend});
        const pizzas = result.logs[0].args._noOfPizzas;
        const wei = result.logs[0].args._wei;
        assert.equal(pizzas.toNumber(), 2);
        assert.equal(wei.toNumber(), 100)
      });

})

it('...should store the value 89.', async () => {
   const simpleStorageInstance = await SimpleStorage.deployed()

   // Set value of 89
   await simpleStorageInstance.set(89, {from: accounts[0]})

   // Get stored value
   const storedData = await simpleStorageInstance.get.call()

   assert.equal(storedData, 89, 'The value 89 was not stored.')
 })
})
