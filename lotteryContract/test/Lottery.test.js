const assert = require("assert");

// This is a test so we need a network to test our contract so to know how it
// Behaves in the network so we use ganache cli to create a local
// test network

const ganache = require("ganache-cli");

// Now Web3 has 2 versionings
//      1 ->    0.*.*  this uses callbacks to deal with async calls
//      2 ->    1.*.* this has promises so we can use async await syntax to make it more sync in codeing

// Web3 is a library that connects to the www so it needs a provider as to connect
// to specific networks
//      WEB3 <----------------> Provider( by network)  <----------------> NETWORK
//              Provider is basically a pipeline to communicate with the network

const Web3 = require("web3");

const provider = ganache.provider();

const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");

let accounts;
let lottery;

// Note that each test will start with a new contract deployed
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // All the calls for web3 is async
  // This Contract property helps to deploy a contract or interact with the contract
  // We parse the string rep of interface and tell it that this is the interface
  // of the contract that we want to communnicate (already deployed)
  // with or to to deploy
  // The deploy method creates an object ( copy or transaction ) that is
  // needed to be deployed
  // Then the send method actually creates a transaction and send it to the
  // Network and then the network  will deploy the contract
  // In this cases the to: field in the transaction is empty
  // and it tells the network that it is infact a contract that needs to be deployed

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Contract Lottery", () => {
  it("gets Accounts", () => {
    console.log(accounts);
  });
  it("deploys contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows 1 account to enter", async () => {
    // Note this is a transaction that is why it has a send from a account
    //   const message = await lottery.methods.message().call();
    const transactionHash = await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    // So This is basically calling a message and inside the
    // function name we pass argument and then call the .call()
    // method to actually call the unction of the contract that
    // is deployed at a block chain
    // Now if this was a transaction then you would have to actually
    // specify the from parameter inside the send() method
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    console.log(players);
    assert.ok(players.length, 1);
  });

  it("allows multiple accounts to enter", async () => {
    // Note this is a transaction that is why it has a send from a account
    //   const message = await lottery.methods.message().call();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    // So This is basically calling a message and inside the
    // function name we pass argument and then call the .call()
    // method to actually call the unction of the contract that
    // is deployed at a block chain
    // Now if this was a transaction then you would have to actually
    // specify the from parameter inside the send() method
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    console.log(players);
    assert.ok(players.length, 3);

    assert.strictEqual(players[0], accounts[0]);
    assert.strictEqual(players[1], accounts[1]);
    assert.strictEqual(players[2], accounts[2]);
  });
  it("requires minimum amount (0.01 ether) to enter", async () => {
    // We will try and if try fails so our test will pass
    // because it should give an error so assert(true) for passing test
    // and assert(false) to fail so ..
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200,
      });
      assert(false);
    } catch (err) {
      console.log(err.message);
      assert(true);
    }
  });
  it("manager can call pickWinner ", async () => {
    // Note that pickWinner changes the block chain so it is a
    // transaction

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const winner = await lottery.methods.pickWinner().send({
      from: accounts[0],
      value: 0,
    });
    assert(winner);
  });
  it("only manager can call pickWinner ", async () => {
    // We will try and if try fails so our test will pass
    // because it should give an error so assert(true) for passing test
    // and assert(false) to fail so ..
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      console.log(err.message);
      assert(true);
    }
  });

  it("Sends money to the winner and resets the players array", async () => {
    let transactionHash = await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    // enter the person
    assert(transactionHash);

    // returns in wei

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    transactionHash = await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    assert(transactionHash);

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    // Now the difference between finalBalance and initialBalance
    // is less than 10 ether as we also had to pay gas for changes in
    // block chain

    const difference = finalBalance - initialBalance;
    console.log(difference);
    console.log("Gas Used ", web3.utils.toWei("10", "ether") - difference);
    assert(difference > web3.utils.toWei("9.8", "ether"));
  });
});
