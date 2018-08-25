# Avoiding Common Attacks

## Reentrancy

In `claimFunds`, the caller's address is tracked in the "FundsClaimed" mapping tracking addresses that have claimed funds, prior to the transfer of value. Also, `call.value()` is avoided in favour of `transfer()`.

## Timestamp Dependence

This application does not make use the of the block timestamp.

## SafeMath Library

All mathematical operations have been replaced with methods from SafeMath imported from the openzeppelin library.

## DoS with (Unexpected) Revert

Payable functions (`nextMilestone`, `claimFunds`, `activateFund`) use pull over push to transfer funds.

## Forcibly Sending Ether to a Contract

The logic in functions in the contract are independent of the balance in the contract. Any ether forcibly sent into the contract will not affect the functionality of the contract.

## Audited Contracts

The marketplace contract extended features of audited contracts from Zeppelin (`Ownable`, `Pausable`, `SafeMath`)
