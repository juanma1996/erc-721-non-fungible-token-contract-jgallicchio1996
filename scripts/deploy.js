const { ethers } = require("hardhat");

// Contract to deploy
const CONTRACT_NAME = "ERC721";
let contractInstance;

async function main() {

    console.log("---------------------------------------------------------------------------------------");
    console.log("-- Deploy contracts process start...");
    console.log("---------------------------------------------------------------------------------------");

    /// --------------------------------------------------------------------------------------------------
    /// ToDo: Place your deploy code here
    /// --------------------------------------------------------------------------------------------------


    console.log("-- Contract Address:\t", contractInstance.address);
    console.log("---------------------------------------------------------------------------------------");
    console.log("-- Contracts have been successfully deployed");
    console.log("---------------------------------------------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });