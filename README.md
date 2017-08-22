```
let c = MaidenIdentities.deployed();
c.then(contract => contract.addIdentity('queer', { from: web3.eth.accounts[0] }));
c .then(contract => contract.getIdentity(0));
c .then(contract => contract.getClaimAddress('queer')) .then(a => web3.eth.sendTransaction({ to: a, from: web3.eth.accounts[0] }))

c.then(contract => contract.numWarriors());

c.then(contract => contract.getWarrior(0));
c.then(contract => contract.getWarriorIdentities(web3.eth.accounts[0]));
```