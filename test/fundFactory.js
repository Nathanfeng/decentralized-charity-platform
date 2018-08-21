const Factory = artifacts.require("./contracts/FundFactory.sol");
const Fund = artifacts.require("./contracts/Fund.sol");

contract('Fund', (accounts) => {
    let owner = accounts[2];
    let firstDonor = accounts[3];
    let secondDonor = accounts[4];
    let fund;
    let factory;

    beforeEach(async () => {
      factory = await Factory.new({from:owner})
      await factory.initiateFund("test", "test fund", 100, 2, {from: owner});
      fund = await Fund.new("test2", "second test", 100, 2, {from:owner});
      // const addedMilestone = {title: "first", description: "first milestone"};
      await fund.addMilestone("first", "first milestone", {from: owner});
      // await fund.addMilestone(addedMilestone.title, addedMilestone.description, {from: owner});

    });

    describe("initializing contracts", () => {

      it('deploys both the fund factory and an individual fund', () => {
        assert.ok(factory.address);
        assert.ok(fund.address);
      });

      it('the address initializing is owner', async () => {
        const deployer = await fund.owner.call();
        assert.equal(owner, deployer);
      });
    })


    describe("milestone functionality", () => {

      it('allows you to add a milestone', async () => {
        const totalMilestones = await fund.getMilestonesCount({from: owner});

        assert.equal(totalMilestones, 1);
      });

      it('returns 6 properties of a specific milestone', async () => {
        const returnedMilestone = await fund.returnMilestone(0, {from: owner})

        assert.equal(returnedMilestone.length , 6);
      });

    })

    describe("deployment", () => {

      it('should not deploy if less than 1 milestone added', async () => {
        try {
          newFund = Fund.new("test3", "third test", 100, 2, {from:owner});
          const deployStatus = await fund.acceptingDonations.call(owner);
          await newFund.deployFund({from: owner})

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should deploy if at least 1 milestone added', async () => {
        // newFund = await Fund.new("test3", "third test", 100, 3, {from:owner});
        await fund.deployFund({from: owner});
        const deployStatus = await fund.acceptingDonations.call();

        assert(deployStatus);
      });

    })

    describe("donations", () => {

      it('should accept and record a donation', async () => {
        const deployCall = await fund.deployFund({from: owner})
        await fund.makeDonation({from: firstDonor, value: 40});
        const totalDonated = await fund.totalDonated.call();
        const amountDonated = await fund.amountDonated.call(firstDonor);
        const recordedDonation = await fund.donated.call(firstDonor)

        assert(amountDonated, 40);
        assert(recordedDonation);
        assert(totalDonated, 40);
      });

      it('should not accept donations twice from same address ', async () => {

        // newFund = await Fund.new("test3", "third test", 100, 3, {from:owner});

      });
      it('should not allow the owner to make a donation', async () => {

        // newFund = await Fund.new("test3", "third test", 100, 3, {from:owner});

      });



    })




})

/*
Other tests to write:



*/
