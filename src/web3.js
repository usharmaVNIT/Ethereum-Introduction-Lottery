// For this app we need metamaskto be installed on the client
// browser
// Now metamask injects a web3 instance on any active page with a
// preconfigured provider so our first workis to hijack that
// provider and use it in our web3 instance because metamask
// installs old version ^0.** that doesnot have support for
// promises and we use version 1.* that has the support for promises

// This web3 is our web3 version 1.
import Web3 from "web3";

// now we plug the provider that metamask has injected in the browser
async function fun1() {
  await window.ethereum.request({
    method: "eth_requestAccounts",
  });
}

fun1();
const web3 = new Web3(window.ethereum);

export default web3;
