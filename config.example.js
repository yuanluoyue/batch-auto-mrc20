const config = {
  packageID:
    "0xebbba763f5fc01d90c2791c03536a373791b634600e81d4e08b85f275f1274fa", // 合约 id
  recordID:
    "0x9273c998c38720b95769331fd506084879e128161f976ba2c3666526c0e73175", // token id
  content: "IKUN", // 铭文字符
  mintFee: 0, // 100000000; // 0.01 SUI // 要质押的 sui
  walletMemonicSeedList: [], // 助记词
  repeatCount: 500, // 单个钱包要 mint 几张
  sleepTime: 1000 * 65, // 时间间隔，毫秒
  rpcUrl: "https://mainnet.sui.rpcpool.com",
  // rpcUrlList: [],
};

// https://sui-mainnet-us-1.cosmostation.io
// https://sui-mainnet-us-2.cosmostation.io
// https://sui-mainnet-ca-1.cosmostation.io
// https://sui-mainnet-ca-2.cosmostation.io
// https://sui-mainnet-eu-1.cosmostation.io
// https://sui-mainnet-eu-2.cosmostation.io
// https://sui-mainnet-eu-3.cosmostation.io
// https://sui-mainnet-eu-4.cosmostation.io
// https://mainnet.sui.rpcpool.com
// https://sui-mainnet-endpoint.blockvision.org
// https://rpc-mainnet.suiscan.xyz

module.exports = config;
