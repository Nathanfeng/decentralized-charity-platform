pragma solidity ^0.4.24;

import '../client/node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "../client/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../client/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/* the Funds contract keeps track of donors, donations, calculates the
  weight of each vote, handles the fundraising period and the time period
  in which funds are accepted.
*/
contract Fund is Ownable, Pausable {

	struct Milestones {
		string name;
		string description;
		uint passingVotes;
		uint failingVotes;
		uint totalVoted;
		bool acceptingVotes;
		mapping (address => bool) voted;
	}

	address public owner;
	bool public fundInitialized;
	bool public acceptingDonations;
	bool public active;
	string public title;
	string public description;
	uint public targetAmount;
	uint public minNumberDonators;
	uint public totalDonors;
	uint public totalDonated;
	uint public currentMilestoneIndex = 0;
	mapping (address => uint) public amountDonated;
	mapping (address => bool) public donated;
	Milestones[] public milestones;

	//events
	event FundCreated(address owner, string title, string description, uint targetAmount, uint minNumberDonators);
	event MilestoneAdded(string name, string description);
	event FundDeployed(address owner, string title, string description);
	event DonationReceived(address fundAddress, address donorAddress, uint amount);
	event FundActivated(address fundAddress, string title, string description, uint totalDonated);
	event VoteRecorded(address fundAddress, address voter, bool approval);
	event NextMilestone(address fundAddress, uint milestoneIndex);
	event FundsClaimed(address fundAddress, address retreiver);


	constructor(
		string title,
		string description,
		uint targetAmount,
		uint minNumberDonators
		) public {
		owner = msg.sender;
		title = title;
		description = description;
		targetAmount = targetAmount;
		minNumberDonators = minNumberDonators;
		totalDonated = 0;
		fundInitialized = true;
		emit FundCreated(msg.sender, title, description, targetAmount, minNumberDonators);
	}

	modifier restrictOwner {
		require(!(msg.sender == owner));
		_;
	}

	modifier notAcceptingDonations {
		require(!acceptingDonations);
		_;
	}

	/* A milestone is met if:
		1. More than 50% of donors vote
		2. The total weight of approval votes is greater than failing votes
	*/
	modifier milestonePassed {
		Milestones memory currentMilestone = milestones[currentMilestoneIndex];
		require(currentMilestone.totalVoted >= SafeMath.div(totalDonors, 2));
		require(currentMilestone.passingVotes > currentMilestone.failingVotes);
		_;
	}

	modifier milestoneFailed {
		Milestones memory currentMilestone = milestones[currentMilestoneIndex];
		require(currentMilestone.totalVoted >= SafeMath.div(totalDonors, 2));
		require(currentMilestone.passingVotes < currentMilestone.failingVotes);
		_;
	}

	function fundSummary()
		public
		view
		returns(address, uint, uint, uint, uint, bool, bool)
	{
		require(fundInitialized);

		return (owner, totalDonors, minNumberDonators, totalDonated,
		targetAmount, acceptingDonations, active);
	}

	function addMilestone(string _name, string _description)
		onlyOwner
		whenNotPaused
		public
	{
		require(fundInitialized);

		Milestones memory newMilestone = Milestones({
			name: _name,
			description: _description,
			passingVotes: 0,
			failingVotes: 0,
			totalVoted: 0,
			acceptingVotes: false
		});

		milestones.push(newMilestone);
		emit MilestoneAdded(_name, _description);
	}

	function returnMilestone(uint index)
		public
		view
		whenNotPaused
		returns (string, string, uint, uint, uint, bool)
	{
		require(fundInitialized);

		Milestones memory milestone = milestones[index];
		return (milestone.name, milestone.description, milestone.passingVotes,
		milestone.failingVotes, milestone.totalVoted, milestone.acceptingVotes);
	}

	function getMilestonesCount()
		public
		view
		returns (uint)
	{
		return milestones.length;
	}

	function deployFund()
		onlyOwner
		whenNotPaused
		notAcceptingDonations
		public
	{
		require(milestones.length >= 1);
		require(fundInitialized);

		acceptingDonations = true;
		emit FundDeployed(msg.sender, title, description);

	}

  function makeDonation()
		restrictOwner
		payable
		whenNotPaused
		public
	{
    require(!donated[msg.sender]);
		require(acceptingDonations);

    totalDonated += msg.value;
		totalDonors++;
    donated[msg.sender] = true;
		amountDonated[msg.sender] = msg.value;
		emit DonationReceived(owner, msg.sender, msg.value);
  }

	function activateFund()
		onlyOwner
		whenNotPaused
		public
	{
		require(!active);
		require(acceptingDonations);
		require(totalDonated >= targetAmount);
		require(totalDonors >= minNumberDonators);

		uint installment = SafeMath.div(totalDonated, milestones.length);
    owner.transfer(installment);
		acceptingDonations = false;
		active = true;
		emit FundActivated(owner, title, description, totalDonated);
	}

  function recordVote(bool vote)
		restrictOwner
		whenNotPaused
		notAcceptingDonations
		public
	{
    require(donated[msg.sender]);
    require(!(milestones[currentMilestoneIndex].voted[msg.sender]));
    require(active);

		uint donationProportion = SafeMath.div(amountDonated[msg.sender], totalDonated);
		uint voteWeight = SafeMath.mul(donationProportion, 100);

		if (vote) {
			SafeMath.add(milestones[currentMilestoneIndex].passingVotes, voteWeight);
		} else {
			SafeMath.add(milestones[currentMilestoneIndex].failingVotes, voteWeight);
		}
		milestones[currentMilestoneIndex].totalVoted++;
		milestones[currentMilestoneIndex].voted[msg.sender] = true;
		emit VoteRecorded( owner, msg.sender, vote);
  }

	/* funds are released to the owner if the donors of the fund vote that
	the milestone is met. Once the milestone is met, the voting is open for
	the next milestone.
	*/

	function nextMilestone()
		notAcceptingDonations
		onlyOwner
		milestonePassed
		whenNotPaused
		payable
		public
	{
		bool acceptingVotes = milestones[currentMilestoneIndex].acceptingVotes;
		require(acceptingVotes);
		require(active);
		require((address(this).balance) > 0);

		uint installment = SafeMath.div(totalDonated, milestones.length);
		owner.transfer(installment);
		acceptingVotes = false;
		currentMilestoneIndex++;
		acceptingVotes = true;
		emit NextMilestone( owner, currentMilestoneIndex);
	}

	/* If a milestone failed then donors can claim funds. Once the donors claim
	funds, votes are no longer accepted for the milestone.
	*/
	function claimFunds()
		restrictOwner
		milestoneFailed
		payable
		whenNotPaused
		public
	{
		require(donated[msg.sender]);
		require((address(this).balance) > 0);

		uint donation = amountDonated[msg.sender];
		uint proportionDonated = SafeMath.div(donation, totalDonated);
		uint refund = SafeMath.mul(proportionDonated, address(this).balance);
		msg.sender.transfer(refund);
		milestones[currentMilestoneIndex].acceptingVotes = false;
		emit FundsClaimed(owner, msg.sender);

	}

}