const path = require("path");

const fs = require("fs");

const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "Contracts", "Lottery.sol");

const source = fs.readFileSync(lotteryPath, "utf-8");

const compiled = solc.compile(source);

module.exports = compiled.contracts[":Lottery"];
