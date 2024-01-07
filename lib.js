const config = require('./config')

async function sleepMS(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function get_current_epoch(suiClient) {
  const tick_record = await suiClient.getObject({
    id: config.recordID,
    options: { showContent: true, showDisplay: true },
  })
  return parseInt(tick_record.data.content.fields.current_epoch)
}

module.exports = {
  sleepMS,
  get_current_epoch,
}
