const MaidenIdentities = artifacts.require("./MaidenIdentities.sol")

module.exports = deployer => {
  deployer.deploy(MaidenIdentities, web3.toWei(0.03), ['Woman', 'Man', 'Trans', 'Queer', 'Nonbinary', 'Person of Color', 'Black', 'Latinx', 'Native American', 'Asian', 'Middle Eastern', 'Bisexual', 'Gay', 'Lesbian', 'Parent'/*, 'Person with a disability', 'Veteran', 'Refugee', 'Immigrant', 'Ally'*/])
}
