const SHA256 = require('crypto-js/sha256')

// Transaction
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

// Block structure
class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce,
    ).toString()
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log('Block Mined ' + this.hash)
  }
}

// BlockChain structure
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
    this.pendingTransactions = []
    this.minigReward = 100
  }

  createGenesisBlock() {
    return new Block('21/08/2021', 'Genesis block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mineBlock(this.difficulty)

    console.log('Block succcessfully mined')
    this.chain.push(block)

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.minigReward),
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount
        }
        if (trans.toAddress == address) {
          balance += trans.amount
        }
      }
    }
    return balance
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

// creating a coin
let JuliettCoin = new Blockchain()

JuliettCoin.createTransaction(new Transaction('address1', 'address2', 100))
JuliettCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n Starting the miner. Mining.....')
JuliettCoin.minePendingTransactions('Kacper-address')

console.log(
  '\nBalance of Kacper is',
  JuliettCoin.getBalanceOfAddress('Kacper-address'),
)

console.log('\n Starting the miner. Mining.....')
JuliettCoin.minePendingTransactions('Kacper-address')

console.log(
  '\nBalance of Kacper is',
  JuliettCoin.getBalanceOfAddress('Kacper-address'),
)
