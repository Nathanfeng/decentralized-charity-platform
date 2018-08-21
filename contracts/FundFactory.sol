pragma solidity ^0.4.24;

import '../client/node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "../client/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../client/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Fund.sol";
/*
The Decentralized Charity Platform allows charities to raise a fund that
gives benefactors the opportunity to play an active part in determining
how their donations are used.
*/

contract FundFactory is Ownable, Pausable {

	address[] public initiatedFunds;
	mapping (address => string) public fundTitle;

	function initiateFund(string title, string description, uint targetAmount, uint minNumberDonators) public {
			address newFund = new Fund(title, description, targetAmount, minNumberDonators);
			initiatedFunds.push(newFund);
	}

	function getInitiatedFunds() public view returns (address[]) {
			return initiatedFunds;
	}
}
