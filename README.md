```
let c = MaidenIdentities.deployed();
c.then(contract => contract.addIdentity('queer', { from: web3.eth.accounts[0] }));
c .then(contract => contract.getIdentity(0));
c .then(contract => contract.getClaimAddress('queer')) .then(a => web3.eth.sendTransaction({ to: a, from: web3.eth.accounts[0] }))

c.then(contract => contract.numWarriors());

c.then(contract => contract.getWarrior(0));
c.then(contract => contract.getWarriorIdentities(web3.eth.accounts[0]));
```

Gas Accounting
========================
1 identity: 0.014
5 identities: 0.024
10 identities: 0.033
15 identities: 0.042

0.005 + n * .009 ETH

205,485 gas = 0.0022 ETH = $0.66 to add an identity afterwards
