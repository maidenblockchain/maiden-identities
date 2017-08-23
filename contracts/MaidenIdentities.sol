pragma solidity ^0.4.15;

// modified relay contract
// https://github.com/Shapeshift-Public/relay

/* The Relay contract serves as a base contract for any contract that wishes to expose methods through relay addresses. */
contract Relay {

  mapping(bytes32 => address) public relays;

  /** Adds a relay for the given method. */
  function addRelay(bytes32 identity) internal returns (address) {
    address proxy = address(new Proxy(MaidenIdentities(this), identity));
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
  MaidenIdentities warriorsContract;

  /* The identity to be claimed. */
  bytes32 identity;

  function Proxy(MaidenIdentities _identitiesContract, bytes32 _identity) {
    warriorsContract = _identitiesContract;
    identity = _identity;
  }

  function() payable {

    // if warriorsContract call reverts, revert this transaction as well
    // warriorsContract.claimIdentity.value(msg.value)(msg.sender, identity);
    warriorsContract.claimIdentity(msg.sender, identity);
  }
}

contract MaidenIdentities is Relay {

  /****************************************************
   * MEMBERS
   ****************************************************/

  struct Warrior {
    // bytes32[] identities;
    bytes32 identity;
  }

  // mapping of MaidenIdentities with identities
  mapping (address => Warrior) public warriorIdentities;
  address[] public warriors;

  function() payable {
  }

  function addIdentity(bytes32 identity) public {
    addRelay(identity);
  }

  // relay claim
  function claimIdentity(address warrior, bytes32 identity) public payable {
    if(!warrior.call.value(0.1 ether)()) revert();
    warriorIdentities[warrior] = Warrior(identity);
    warriors.push(warrior);
  }

  /* owner only */

  /****************************************************
   * READ-ONLY FUNCTIONS
   ****************************************************/

  // get the relay address for claiming the given identity
  function getClaimAddress(bytes32 identity) public constant returns(address) {
    return Relay.getRelay(identity);
  }

  function getWarrior(uint i) public constant returns(address) {
    return warriors[i];
  }

  function getWarriorIdentities(address warrior) public constant returns(bytes32) {
    return warriorIdentities[warrior].identity;
  }

  function numWarriors() public constant returns(uint) {
    return warriors.length;
  }
}


