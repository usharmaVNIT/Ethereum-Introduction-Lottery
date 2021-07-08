const Web3 = require("web3");

// Web3 need a provider to talk to a node in the network//      WEB3 <----------------> Provider( by network)  <----------------> NETWORK
//              Provider is basically a pipeline to communicate with the network

const HDWalletProvider = require("@truffle/hdwallet-provider");
// So we will be using truffle's hd wallet provider

// now we actually need an account with ether (on that network)
//  to deploy it on any network and we will get the account address from
// our account mnumonic
// Basically mnumonoc can generate both public and private keys
// and 1 mnumonic can generate many accounts in series

const provider = new HDWalletProvider(
  // your 12 mnumonic , 
  // infura api for any network if deploying using infura
)

// Example 

// const provider = new HDWalletProvider(
//   "famous crane matrix shift quality employ buyer clinic test may consider thirty",
//   "https://rinkeby.infura.io/v3/.............."
// );

//  Now this provider also takes the node in which we want to deploy our
// contract so we will use infura.io to do this
// instead of hosting a node ourselves we will use the nodes that
// infura has already deployed

// Passing the provider to web3
const web3 = new Web3(provider);

const { interface, bytecode } = require("./compile");

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("\n Account fetched : \n", accounts, "\n\n");
  console.log("Attempting to deploy from account : ", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: "0x" + bytecode,
      arguments: [],
    })
    .send({
      from: accounts[0],
    });

  console.log();
  console.log();
  console.log(interface);
  console.log("\n\nContract deployed at : ", result.options.address);
};

deploy();
