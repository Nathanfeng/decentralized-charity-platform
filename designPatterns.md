# Design Pattern Decisions

## Voting Mechanism
The voting mechanism in the contract is designed so that each address's votes depended on the proportion of the fund that it donated. If mechanism was instead one address, one vote, the attacker could create many addresses and hence have many votes.

## Circuit Breaker

Circuit breaker (`Pausable`) is applied on all payable functions. If a vulnerability is found, all payable functions would be suspended upon triggering by the owner of the contract.

## Using Push over Pull Payments

Payable functions (`nextMilestone`, `claimFunds`, `activateFund`) use pull over push to transfer funds.

## Fail Early and Fail Loud

Throughout the contract, require statements are used as early as possible in functions, providing early indication that a certain function has failed.

## Restricting Access

In the contract the Ownable contract is imported, which only allows the owner to call the function, as well as a `restrictOwner` function that restricts the owner from calling a function.
