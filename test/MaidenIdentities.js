const MaidenIdentities = artifacts.require('./MaidenIdentities.sol')

const expectThrow = promise => {
  const ERROR_SIG = Symbol('ERROR_SIG')
  return promise
    .catch(() => ERROR_SIG)
    .then(e => {
      if (e !== ERROR_SIG) {
        throw new Error('Expected error')
      }
    })
}

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should deploy a MaidenIdentities contract', () => {
    return MaidenIdentities.deployed()
  })
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow an identity to be added', async () => {
    const contract = await MaidenIdentities.deployed()
    await contract.addIdentity('queer', { from: user })
    assert.equal((await contract.numIdentities()).toNumber(), 1)
    assert.equal(web3.toUtf8(await contract.getIdentity(0)).toString(), 'queer')
    assert(web3.isAddress(await contract.getClaimAddress('queer')).toString())
  })
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should not allow an identity to be claimed directly', async () => {
    const contract = await MaidenIdentities.deployed()
    await contract.addIdentity('queer', { from: user })
    return expectThrow(contract.claimIdentity(user, 'queer', { from: user }))
  })
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow an identity to be claimed via the relay', async () => {
    const contract = await MaidenIdentities.deployed()
    await contract.addIdentity('queer', { from: user })
    const claimAddress = await contract.getClaimAddress('queer')
    await web3.eth.sendTransaction({ from: user, to: claimAddress })

    assert.equal((await contract.numWarriors()).toNumber(), 1)
    assert.equal((await contract.getWarrior(0)).toString(), user)
    assert.equal(web3.toUtf8(await contract.getWarriorIdentities(user)).toString(), 'queer')
    assert(web3.isAddress(await contract.getClaimAddress('queer')).toString())
  })
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow donations to be sent to the main contract', async () => {
    const contract = await MaidenIdentities.deployed()
    await web3.eth.sendTransaction({ from: user, to: contract.address, value: web3.toWei(1) })
  })
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow donations to be collected by the owner', async () => {
    const contract = await MaidenIdentities.deployed()
    await web3.eth.sendTransaction({ from: user, to: contract.address, value: web3.toWei(1) })
    await contract.withdraw(owner, { from: owner })

    const balance = web3.eth.getBalance(contract.address)
    assert.equal(balance.toNumber(), 0)
  })
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should set a payout for claiming an identity', async () => {
    const contract = await MaidenIdentities.deployed()
    await contract.addIdentity('queer', { from: user })

    // fund the contract and set the payout
    await web3.eth.sendTransaction({ from: owner, to: contract.address, value: web3.toWei(1) })
    await contract.setPayout(web3.toWei(0.1), { from: owner })

    // claim an identity
    const claimAddress = await contract.getClaimAddress('queer')
    await web3.eth.sendTransaction({ from: user, to: claimAddress, gas: 4000000 })

    const balance = web3.eth.getBalance(contract.address)
    assert.equal(web3.fromWei(balance).toNumber(), 0.9)
  })
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow owner to disable')
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should not payout a user more than once')
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow the contract to be paused by the owner')
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow the contract to be unpaused by the owner')
  // it('should allow the contract to be unpaused by a non-owner')
})
