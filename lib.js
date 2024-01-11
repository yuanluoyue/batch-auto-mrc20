const config = require('./config')

async function sleepMS(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkIsMintFinished(suiClient, mrc20TokenID) {
  try {
    const obj = await suiClient.getObject({
      id: mrc20TokenID,
      options: { showContent: true, showDisplay: true },
    })

    const fields = obj?.data?.content?.fields
    const totalEpoch = Number(fields?.epoch_count)
    const curEpoch = Number(fields?.current_epoch)
    const process = ((curEpoch / totalEpoch) * 100).toFixed(2)
    const isFinished = curEpoch + 2 >= totalEpoch

    console.log('current_epoch: ', curEpoch, ' | ', 'epoch_count: ', totalEpoch)
    console.log(`进度: ${process}% | Finished: ${isFinished} `)

    return isFinished
  } catch (err) {
    console.log('铸造进度获取失败', err)
  }
  return false
}

const SuiToG = suiCount => {
  return suiCount * 10 ** 9
}

const GToSui = gCount => {
  return gCount / 10 ** 9
}

module.exports = {
  sleepMS,
  checkIsMintFinished,
  SuiToG,
  GToSui,
}
