pragma solidity ^0.4.24;

import '../client/node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "../client/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../client/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

	/**
 * @title Fund
 * @dev Charity app that administers a single fund
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
	uint public currentMilestoneIndex;
	mapping (address => uint) public amountDonated;
	mapping (address => bool) public donated;
	mapping (address => bool) public claimedFunds;
	Milestones[] public milestones;

	event FundInitialized(address owner, string title, string description, uint targetAmount, uint minNumberDonators);
	event MilestoneAdded(string name, string description);
	event FundDeployed(address owner, string title, string description);
	event DonationReceived(address fundAddress, address donorAddress, uint amount);
	event FundActivated(address fundAddress, string title, string description, uint totalDonated);
	event VoteRecorded(address fundAddress, address voter, bool approval, uint donationAmount, uint passingVotes, uint failingVotes);
	event NextMilestone(address fundAddress, uint milestoneIndex);
	event FundsClaimed(address fundAddress, address retreiver, uint refund, uint currentbalance, uint proportionDonated);


	modifier restrictOwner {
		require(!(msg.sender == owner));
		_;
	}

	modifier notAcceptingDonations {
		require(!acceptingDonations);
		_;
	}

	/**
	* @dev checks that the current milestone is passed.
	* A milestone is passed if:
	*1. More than 50% of donors vote
	*2. The total weight of passing votes is greater than weight of failing votes
	*/

	modifier milestonePassed {
		Milestones memory currentMilestone = milestones[currentMilestoneIndex];
		require(currentMilestone.totalVoted >= SafeMath.div(totalDonors, 2));
		require(currentMilestone.passingVotes > currentMilestone.failingVotes);
		_;
	}

	/**
	* @dev checks that the current milestone is failed.
	* A milestone is failed if:
	*1. Less than 50% of donors vote
	*2. The total weight of failing votes is greater than weight of passing votes
	*/

	modifier milestoneFailed {
		Milestones memory currentMilestone = milestones[currentMilestoneIndex];
		require(currentMilestone.totalVoted >= SafeMath.div(totalDonors, 2));
		require(currentMilestone.passingVotes < currentMilestone.failingVotes);
		_;
	}

	/**
	* @dev checks that the current milestone is failed.
	* A milestone is failed if:
	*1. Less than 50% of donors vote
	*2. The total weight of failing votes is greater than weight of passing votes
	*/

	modifier milestonesRemaining {
		require(currentMilestoneIndex < milestones.length);
		_;
	}

	/**
	 * @dev Sets the starting values of owner, totalDonated, totalDonors
	 * and currentMilestoneIndex variables
	 */
	constructor() public {
		owner = msg.sender;
		totalDonated = 0;
		totalDonors = 0;
		currentMilestoneIndex = 0;
	}

	/**
	* @dev Fallback function
	*/
	function() public payable {
	  revert();
	}

	/**
	 * @dev Sets the requirements of the fund
	 * @param name The name of the fund
	 * @param descrip The description of the goals of the fund
	 * @param target The target amount the fund needs to raise to be deployed
	 * @param minDonors The min number of donors for the fund to be deployed
	 */

	function initializeFund(
		string name,
		string descrip,
		uint target,
		uint minDonors
		)
		public
		onlyOwner
		{
		require(!fundInitialized);
		title = name;
		description = descrip;
		targetAmount = target;
		minNumberDonators = minDonors;
		fundInitialized = true;
		emit FundInitialized(msg.sender, title, description, targetAmount, minNumberDonators);
	}

	/**
	 * @dev Provides a summary of the current state of the fund
	 * @return owner The address of the owner.
	 * @return totalDonors The total number of donors.
	 * @return minNumberDonators The minimum number of donors for owner to deploy fund.
	 * @return totalDonated The total amount donated to the fund.
	 * @return targetAmount The target amount the fund needs to raise to deploy.
	 * @return acceptingDonations Whether the fund is accepting donations.
	 * @return active Whether the fund is accepting votes.
	 * @return title Title of the fund.
	 * @return description Description on the goals of the fund.
	 */

	function fundSummary()
		public
		view
		returns(address, uint, uint, uint, uint, bool, bool, string, string)
	{
		require(fundInitialized);

		return (owner, totalDonors, minNumberDonators, totalDonated,
		targetAmount, acceptingDonations, active, title, description);
	}

	/**
	* @dev Adds a milestone to the fund
	* @param _name name of the milestone
	* @param _description description of what is to be achieved in the milestone
	*/
	function addMilestone(string _name, string _description)
		onlyOwner
		notAcceptingDonations
		public
	{
		require(fundInitialized);
		require(!active);

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

	/**
	 * @dev returns the details of the milestone
	 * @return name The name of milestone
	 * @return description The description of milestone
	 * @return passingVotes The number of passing votes
	 * @return failingVotes The number of failing votes
	 * @return totalvoted The number of donors who have voted pass or fail
	 * @return acceptingVotes Whether the milestone is still taking votes
	 */

	function returnMilestone(uint index)
		public
		view
		returns (string, string, uint, uint, uint, bool)
	{
		require(fundInitialized);

		Milestones memory milestone = milestones[index];
		return (milestone.name, milestone.description, milestone.passingVotes,
		milestone.failingVotes, milestone.totalVoted, milestone.acceptingVotes);
	}

	/**
	* @dev Gets the total number of milestones added
	* @return length The number of milestones for the fund
	*/

	function getMilestonesCount()
		public
		view
		returns (uint)
	{
		return milestones.length;
	}

	/**
	* @dev Deploys fund and opens fund up for donations
	*/

	function deployFund()
		onlyOwner
		notAcceptingDonations
		public
	{
		require(milestones.length >= 1);
		require(fundInitialized);

		acceptingDonations = true;
		emit FundDeployed(msg.sender, title, description);

	}

	/**
	* @dev Allows a donor to make a donation to the fund
	*/

  function makeDonation()
		restrictOwner
		payable
		whenNotPaused
		public
	{
    require(!donated[msg.sender]);
		require(acceptingDonations);

  	totalDonated = SafeMath.add(totalDonated, msg.value);
		totalDonors++;
  	donated[msg.sender] = true;
		amountDonated[msg.sender] = msg.value;
		emit DonationReceived(owner, msg.sender, msg.value);
  }

	/**
	* @dev Closes the fund to donations, releases the first installment to
	* the owner of the fund, and opens up voting on the first milestone.
	*/

	function activateFund()
		onlyOwner
		whenNotPaused
		payable
		public
	{
		require(!active);
		require(acceptingDonations);
		require(totalDonated >= targetAmount);
		require(totalDonors >= minNumberDonators);

		uint split = SafeMath.add(milestones.length, 1);
		uint installment = SafeMath.div(totalDonated, split);
    owner.transfer(installment);
    milestones[currentMilestoneIndex].acceptingVotes = true;
		acceptingDonations = false;
		active = true;
		emit FundActivated(owner, title, description, totalDonated);
	}

	/**
	* @dev Records the vote of the donor. Donors' votes are weighted based on
	* the proportion of total donations their inidividual donation accounts for.
	* @param vote Donor's vote of the fund passing or failing the current
	* milestone. true is Pass, false is Fail.
	*/

  function recordVote(bool vote)
		restrictOwner
		notAcceptingDonations
		public
	{
		require(donated[msg.sender]);
		require(!(milestones[currentMilestoneIndex].voted[msg.sender]));
		require(milestones[currentMilestoneIndex].acceptingVotes);
		require(active);

		uint donationAmount = amountDonated[msg.sender];
		uint passingVotes = milestones[currentMilestoneIndex].passingVotes;
		uint failingVotes = milestones[currentMilestoneIndex].failingVotes;

		if (vote) {
			milestones[currentMilestoneIndex].passingVotes = SafeMath.add(passingVotes, donationAmount);

		} else {
			milestones[currentMilestoneIndex].failingVotes = SafeMath.add(failingVotes, donationAmount);
		}
		milestones[currentMilestoneIndex].totalVoted++;
		milestones[currentMilestoneIndex].voted[msg.sender] = true;
		emit VoteRecorded( owner, msg.sender, vote, donationAmount, passingVotes, failingVotes);
  }

	/**
	* @dev Moves the fund on to the next milestone. When called by the owner,
	* funds are released to the owner if the donors of the fund vote that
	* the milestone is met. Once the milestone is met, the voting is open for
	* the next milestone.
	*/

	function nextMilestone()
		notAcceptingDonations
		milestonesRemaining
		onlyOwner
		milestonePassed
		whenNotPaused
		payable
		public
	{
		bool acceptingVotes = milestones[currentMilestoneIndex].acceptingVotes;
		require(acceptingVotes);
		require(active);

		uint split = SafeMath.add(milestones.length, 1);
		uint installment = SafeMath.div(totalDonated, split);
		owner.transfer(installment);
		milestones[currentMilestoneIndex].acceptingVotes = false;
		currentMilestoneIndex++;
		milestones[currentMilestoneIndex].acceptingVotes = true;
		emit NextMilestone( owner, currentMilestoneIndex);
	}

	/**
	* @dev Can be called by the donors to claim the remaining funds if a milestone
	* fails. Once the donors claim funds, votes are no longer accepted for the
	* milestone.
	*/
	function claimFunds()
		restrictOwner
		milestoneFailed
		payable
		whenNotPaused
		public
	{
		require(donated[msg.sender]);
		require(!claimedFunds[msg.sender]);
    /*since solidity doesn't account for decimals, we are multiplying
    by 1000 to get the result up to 3 decimal places.
    */
		uint adjustedDonation = SafeMath.mul(amountDonated[msg.sender], 1000);
		uint proportionDonated = SafeMath.div(adjustedDonation, totalDonated);
		emit FundsClaimed(owner, msg.sender, adjustedDonation, totalDonated, proportionDonated);
		uint refund = SafeMath.mul(proportionDonated, address(this).balance);
		//adjusting the refund
		refund = SafeMath.div(refund, 1000);
		claimedFunds[msg.sender]= true;
		msg.sender.transfer(refund);
		milestones[currentMilestoneIndex].acceptingVotes = false;

	}

}
