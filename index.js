const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519')
const { SuiClient } = require('@mysten/sui.js/client')
const { TransactionBlock } = require('@mysten/sui.js/transactions')

const fetch = require('node-fetch')

const { sleepMS, get_current_epoch } = require('./lib')
const config = require('./config')

const MINT_FEE = config.mintFee
const TICK = config.content
const PACKAGE_ID = config.packageID
const TickRecordID = config.recordID

// polyfill @mysten/sui.js
if (!globalThis.fetch) {
  globalThis.fetch = fetch
}

async function executeTransaction(suiClient, keypair) {
  const current_epoch = await get_current_epoch(suiClient)
  const txb = new TransactionBlock()
  const [coin] = txb.splitCoins(txb.gas, [MINT_FEE])

  txb.moveCall({
    target: `${PACKAGE_ID}::movescription::mint`,
    arguments: [txb.object(TickRecordID), txb.pure(TICK), coin, txb.pure('0x6')],
  })

  const result = await suiClient.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    signer: keypair,
  })

  const transactionBlock = await suiClient.waitForTransactionBlock({
    digest: result.digest,
    options: {
      showEffects: true,
    },
  })
  console.log(`current epoch: ${current_epoch}`)
}

const getKeypairList = () => {
  const kpList = []
  for (const mnemonic of config.walletMemonicSeedList) {
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic)
    kpList.push(keypair)
  }
  return kpList
}

const checkWallet = async (keypairList, suiClient) => {
  for (const keypair of keypairList) {
    const address = keypair.toSuiAddress()
    const balance = await suiClient.getBalance({ owner: address })
    console.log('-----------------------')
    console.log('钱包地址：', address)
    console.log('余额', (balance.totalBalance * 1) / 10 ** 9, 'SUI')
  }
}

const main = async () => {
  // const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') })
  const suiClient = new SuiClient({ url: config.rpcUrl })
  const keypairList = getKeypairList()

  await checkWallet(keypairList, suiClient)
  console.log('-----------------------')
  console.log('请确认钱包地址，20 秒后开始铸造', 'token: ', config.content)
  await sleepMS(20 * 1000)

  for (let i = 0; i < config.repeatCount; i++) {
    for (const keypair of keypairList) {
      console.log('-----------------------')
      try {
        await executeTransaction(suiClient, keypair)
        console.log('mint 成功', keypair.toSuiAddress())
      } catch (err) {
        console.log('mint 失败：', keypair.toSuiAddress(), err)
      }
      await sleepMS(Math.random() * 1.5 * 1000)
    }
    await sleepMS(config.sleepTime + Math.random() * 0.5 * 1000)
  }
}

main()
