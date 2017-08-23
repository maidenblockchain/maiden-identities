pragma solidity ^0.4.15;

import "./Relay.sol";

contract MaidenIdentities is Relay {

  /****************************************************
   * MEMBERS
   ****************************************************/

  struct Warrior {
    // bytes32[] identities;
    bytes32 identity;
  }

  // mapping of warriors with identities
  mapping (address => Warrior) public warriorIdentities;
  address[] warriors;

  // mapping of all unique identities
  mapping (bytes32 => bool) public identitiesList;
  bytes32[] identitiesListArray;

  address public owner;
  bool public enabled;
  uint public payout;

  /****************************************************
   * MODIFIERS
   ****************************************************/

  modifier onlyOwner() {
    if (msg.sender != owner) revert();
    _;
  }

  /****************************************************
   * EVENTS
   ****************************************************/

  event Transferred(address _owner);
  event IdentityAdded(bytes32 _identity);
  event IdentityClaimed(address _warrior, bytes32 _identity);
  event Enabled();
  event Disabled();
  event PayoutSet(uint _payout);
  event Withdrawn(uint _amount);

  /****************************************************
   * PUBLIC FUNCTIONS
   ****************************************************/

  function MaidenIdentities() {
    owner = msg.sender;
  }

  function() payable {
  }

  function addIdentity(bytes32 identity) public {

    // only add new identities
    if (identitiesList[identity]) revert();

    // add the identity
    identitiesList[identity] = true;
    identitiesListArray.push(identity);

    // create the relay to let anyone claim the identity
    Relay.addRelay(identity);

    IdentityAdded(identity);
  }

  // function getWarriorIdentities(bytes32 identity) {
  // }

  // direct claim
  // function claimIdentity(bytes32 identity) public payable {
  //   claimIdentity(msg.sender, identity);
  // }

  // relay claim
  function claimIdentity(address warrior, bytes32 identity) public payable {

    // only the relay can call this method
    if (msg.sender != getClaimAddress(identity)) revert();

    // // only can claim an identity once
    // // if (identities[warrior])

    warriorIdentities[warrior] = Warrior(identity);
    warriors.push(warrior);

    IdentityClaimed(warrior, identity);
  }

  /* owner only */

  function transferOwner(address newOwner) public onlyOwner {
    owner = newOwner;
    Transferred(owner);
  }

  function enable() public onlyOwner {
    enabled = true;
    Enabled();
  }

  function disable() public onlyOwner {
    enabled = false;
    Disabled();
  }

  // sets the ETH payout for claiming an identity
  function setPayout(uint _payout) public onlyOwner {
    payout = _payout;
    PayoutSet(payout);
  }

  function withdraw(address to) public onlyOwner {
    Withdrawn(this.balance);
    if(!to.call.value(this.balance)()) revert();
  }

  /****************************************************
   * READ-ONLY FUNCTIONS
   ****************************************************/

  // get the relay address for claiming the given identity
  function getClaimAddress(bytes32 identity) public constant returns(address) {
    return Relay.getRelay(identity);
  }

  function getIdentity(uint i) public constant returns(bytes32) {
    return identitiesListArray[i];
  }

  function numIdentities() public constant returns(uint) {
    return identitiesListArray.length;
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


