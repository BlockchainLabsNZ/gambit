module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    morden: {
      network_id: 2, // Official Ethereum test network
      from: "0x44561E4d41c567f13e862dBbFc181bfB93A53B9C"
    },
    live: {
      network_id: 1, // Official Ethereum network
      // Address that will be associated as the token creator.
      from: "0xEfb32e82CF9d65a828D6d99e12f0BEAb01a467A6"
    }
  }
};
