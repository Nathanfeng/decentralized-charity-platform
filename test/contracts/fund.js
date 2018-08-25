const Fund = artifacts.require("./contracts/Fund.sol");
const { ethGetBalance, ethGetTransaction } = require('../helpers/web3');


contract('Fund', (accounts) => {
    let owner = accounts[1];
    let firstDonor = accounts[2];
    let secondDonor = accounts[3];
    let fund;

    beforeEach(async () => {
      fund = await Fund.new({from: owner});
      await fund.initializeFund("test2", "second test", 20, 2, {from:owner});
      await fund.addMilestone("first", "first milestone", {from: owner});
      await fund.addMilestone("second", "second milestone", {from: owner});
      await fund.deployFund({from: owner});
      // await fund.addMilestone(addedMilestone.title, addedMilestone.description, {from: owner});

    });

    describe("initializing contracts", () => {

      it('deploys both the fund factory and an individual fund', () => {
        assert.ok(fund.address);
      });

      it('the address initializing is owner', async () => {
        const deployer = await fund.owner.call();
        assert.equal(owner, deployer);
      });
    })


    describe("milestones", () => {

      it('allows the owner to add a milestone', async () => {
        const totalMilestones = await fund.getMilestonesCount({from: owner});

        assert.equal(totalMilestones, 2);
      });

      it('does not allow anyone other than owner to add a milestone', async () => {
        try {
          newFund = await Fund.new({from:owner});
          await newFund.initializeFund("test2", "second test", 20, 2, {from:owner});
          await newFund.addMilestone("first", "first milestone", {from: firstDonor});

          assert(false);
        } catch(err) {
          assert(err);
        }

      });

      it('returns 6 properties of a specific milestone', async () => {
        const returnedMilestoneArray = await fund.returnMilestone(0, {from: owner})

        assert.equal(returnedMilestoneArray.length , 6);
      });

      it('returns the total number of milestones', async () => {
        const milestonesAdded = await fund.getMilestonesCount({from: owner})

        assert.equal(milestonesAdded , 2);
      });

    })

    describe("deployment", () => {

      it('should not deploy if less than 1 milestone added', async () => {
        try {
          newFund = await Fund.new({from: owner});
          await newFund.initializeFund("test3", "third test", 100, 2, {from:owner});
          await newFund.deployFund({from: owner})

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should deploy if > 1 milestone added, change acceptingDonations to true', async () => {
        newFund = await Fund.new({from: owner});
        const preDeployedStatus = await newFund.acceptingDonations.call();
        await newFund.initializeFund("test3", "third test", 100, 2, {from:owner});
        await newFund.addMilestone("first", "first milestone", {from: owner});
        await newFund.deployFund({from: owner});
        const deployStatus = await newFund.acceptingDonations.call();

        assert.equal(preDeployedStatus, false)
        assert(deployStatus);
      });

    })

    describe("donations", () => {

      it('should accept and record a donation', async () => {
        await fund.makeDonation({from: firstDonor, value: 40});
        const totalDonated = await fund.totalDonated.call();
        const amountDonated = await fund.amountDonated.call(firstDonor);
        const recordedDonation = await fund.donated.call(firstDonor)

        assert(amountDonated, 40);
        assert(recordedDonation);
        assert(totalDonated, 40);
      });

      it('should not accept donations twice from same address ', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 40});
          await fund.makeDonation({from: firstDonor, value: 30});

          assert(false);
        } catch (err) {
          assert(err);
        }

      });

      it('should not allow the owner to make a donation', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 40});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

    })

    describe("activate fund", () => {

      it('should should open fund up to voting when activated', async () => {
        await fund.makeDonation({from: firstDonor, value: 60});
        await fund.makeDonation({from: secondDonor, value: 60});
        await fund.activateFund({from: owner});
        acceptingDonations = await fund.acceptingDonations.call();

        assert.equal(acceptingDonations, false);
      });

      it('should prevent activation if not enough people donated', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 120});
          await fund.activateFund({from: owner});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should prevent activation if if not enough was donated', async () => {
        try {
          const deployCall = await fund.deployFund({from: owner});
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 5});
          await fund.activateFund({from: owner});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should transfer 1/3 total donated from the contract when activated ', async () => {
          await fund.makeDonation({from: firstDonor, value: 40});
          await fund.makeDonation({from: secondDonor, value: 50});
          const beforeBalance = (await ethGetBalance(fund.address)).toNumber();
          await fund.activateFund({from: owner});
          const afterBalance = (await ethGetBalance(fund.address)).toNumber();

          assert.equal(beforeBalance, 90);
          assert.equal(afterBalance, 60);
      });

    })
    //not done
    describe("voting", () => {

      it('should allow donor to vote', async () => {
        await fund.makeDonation({from: firstDonor, value: 10});
        await fund.makeDonation({from: secondDonor, value: 50});
        await fund.activateFund({from: owner});
        await fund.recordVote(true, {from: firstDonor});
        const milestone = await fund.returnMilestone.call(0);

        assert.equal(milestone[4], 1);
      });

      it('should prevent the owner from voting', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(true, {from: owner});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('does not allow non donors to vote', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          let notDonor = accounts[3];
          await fund.recordVote(true, {from: notDonor});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should make sure addresses can only vote once', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(true, {from: firstDonor});
          await fund.recordVote(true, {from: firstDonor});


          assert(false);
        } catch (err) {
          assert(err);
        }
      });
    })

    describe("nextMilestone", () => {

      it('should not allow donors to trigger next milestone', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(true, {from: firstDonor});
          await fund.recordVote(true, {from: secondDonor});
          await fund.nextMilestone({from: firstDonor});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should transfer 1/3 total donated from the contract with nextMilestone ', async () => {
          await fund.makeDonation({from: firstDonor, value: 40});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(true, {from: firstDonor});
          await fund.recordVote(true, {from: secondDonor});
          const beforeBalance = (await ethGetBalance(fund.address)).toNumber();
          await fund.nextMilestone({from: owner});
          const afterBalance = (await ethGetBalance(fund.address)).toNumber();

          assert.equal(beforeBalance, 60);
          assert.equal(afterBalance, 30);
      });

      it('should turn off voting for previous milestone and turn on voting for next milestone', async () => {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(true, {from: firstDonor});
          await fund.recordVote(true, {from: secondDonor});
          await fund.nextMilestone({from: owner});
          const firstMilestone = await fund.returnMilestone(0, {from: owner})

          assert.equal(firstMilestone[5], false);
      });


    })

    describe("claim funds", () => {
      it('should not allow owners to trigger claim funds', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(false, {from: firstDonor});
          await fund.recordVote(false, {from: secondDonor});
          await fund.claimFunds({from: owner});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should not allow those who havent donated to claim funds', async () => {
        try {
          await fund.makeDonation({from: firstDonor, value: 10});
          await fund.makeDonation({from: secondDonor, value: 50});
          await fund.activateFund({from: owner});
          await fund.recordVote(false, {from: firstDonor});
          await fund.recordVote(false, {from: secondDonor});
          await fund.claimFunds({from: notDonor});

          assert(false);
        } catch (err) {
          assert(err);
        }
      });

      it('should transfer the donation proportion from contract balance ', async () => {
          await fund.makeDonation({from: firstDonor, value: 30});
          await fund.makeDonation({from: secondDonor, value: 60});
          await fund.activateFund({from: owner});
          await fund.recordVote(false, {from: firstDonor});
          await fund.recordVote(false, {from: secondDonor});
          const beforeBalance = (await ethGetBalance(fund.address)).toNumber();
          await fund.claimFunds({from: firstDonor});
          const afterBalance = (await ethGetBalance(fund.address)).toNumber();

          assert.equal(beforeBalance, 60);
          assert.closeTo(afterBalance, 40, 1);
      });
    })




})

/*
Other tests to write:



*/