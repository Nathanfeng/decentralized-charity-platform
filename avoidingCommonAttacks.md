# Avoiding Common Attacks

## Reentrancy

In `claimFunds`, the caller's address is tracked in the `fundsClaimed` mapping, tracking addresses that have claimed funds, prior to the transfer of value. Also, `call.value()` is avoided and `transfer()` used instead.

## Timestamp Dependence

This application does not make use the of the block timestamp.

## SafeMath Library

All mathematical operations have been replaced with methods from SafeMath imported from the Open Zeppelin library.

## Forcibly Sending Ether to a Contract

The logic in functions in the contract are independent of the balance in the contract. Any ether forcibly sent into the contract will not affect the functionality of the contract.

## Audited Contracts

The marketplace contract extended features of audited contracts from Zeppelin (`Ownable`, `Pausable`, `SafeMath`)
