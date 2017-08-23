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
  it('should allow the contract to be paused by the owner')
  // it('should not allow the contract to be paused by a non-owner')
})

contract('MaidenIdentities', accounts => {
  const [owner, user] = accounts
  it('should allow the contract to be unpaused by the owner')
  // it('should allow the contract to be unpaused by a non-owner')
})
