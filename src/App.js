import "./App.css";
import web3 from "./web3";

import lottery from "./lottery";
import { useEffect, useState } from "react";

function App() {
  web3.eth.getAccounts().then(console.log);
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactionMessage, setTransactionMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setTransactionMessage("Waiting on transaction success ...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, "ether"),
    });

    setTransactionMessage("You have been entered !");
  };

  const pickWinner = async (event) => {
    const accounts = await web3.eth.getAccounts();

    setTransactionMessage("Waiting on transaction success ... ");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setTransactionMessage("A Winner has been picked ");
  };

  useEffect(() => {
    const fetchData = async () => {
      // whenever we are using the provider from metamask we need not to specify
      // from property as it is by default set by metamask
      // in this case first account

      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2> Lottery Contract </h2>
      <p> This lottery is managed by {manager}</p>
      <p>
        There are currently {players.length} people competing to win{" "}
        {web3.utils.fromWei(`${balance}`, "ether")} ether
      </p>
      <hr></hr>
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr></hr>
      <h4>Pick a Winner</h4>
      <button onClick={pickWinner}>Pick Winner !</button>
      <hr></hr>

      <h1>{transactionMessage}</h1>
    </div>
  );
}

export default App;
