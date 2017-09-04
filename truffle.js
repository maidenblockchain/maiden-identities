module.exports = {
  networks: {
    development: {
      network_id: "*", // Match any network id
      host: "localhost",
      port: 8545,
      gasPrice: 10e9,
    },
    live: {
      network_id: 1,
      host: "localhost",
      port: 8545,
      gasPrice: 10e9,
      from: "0xB965e30C2CBbE74276C8C95a2C512893c4F78515"
    }
  }
};
