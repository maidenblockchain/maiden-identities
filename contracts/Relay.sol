pragma solidity ^0.4.15;

// modified relay contract
// https://github.com/Shapeshift-Public/relay

contract IMaidenIdentities {
  function claimIdentity(address warrior, bytes32 identity) public payable;
}

/* The Relay contract serves as a base contract for any contract that wishes to expose methods through relay addresses. */
contract Relay {

  mapping(bytes32 => address) public relays;

  /** Adds a relay for the given method. */
  function addRelay(bytes32 identity) internal returns (address) {
    address proxy = address(new Proxy(IMaidenIdentities(this), identity));
    relays[identity] = proxy;
    return proxy;
  }

  /** Retrieves the dynamic contract address that can be sent a transaction to trigger the given method. */
  function getRelay(bytes32 identity) constant internal returns (address) {
    return relays[identity];
  }
}

/** The Proxy contract represents a single method on a host contract. It stores the address of the host contract and the method id of the method so that it can invoke the method when a user sends funds to this contract's address. Note: This version is permission-less. Most use cases would require an authorized owner contract. */
contract Proxy {

  /* The address of the host contract. */
  IMaidenIdentities identitiesContract;

  /* The identity to be claimed. */
  bytes32 identity;

  function Proxy(IMaidenIdentities _identitiesContract, bytes32 _identity) {
    identitiesContract = _identitiesContract;
    identity = _identity;
  }

  function() payable {

    // if identitiesContract call reverts, revert this transaction as well
    identitiesContract.claimIdentity.value(msg.value)(msg.sender, identity);
  }
}
