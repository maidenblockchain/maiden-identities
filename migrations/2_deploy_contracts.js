const MaidenIdentities = artifacts.require("./MaidenIdentities.sol")

module.exports = deployer => {
  deployer.deploy(MaidenIdentities)
}
