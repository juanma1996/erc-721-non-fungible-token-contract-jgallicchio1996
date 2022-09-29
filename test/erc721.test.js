const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

const chai = require("chai");
const { solidity } = require( "ethereum-waffle");
const { ConstructorFragment } = require("ethers/lib/utils");
const { sign } = require("crypto");
chai.use(solidity);
const { expect } = chai;

const contractPath = "contracts/ERC721.sol:ERC721";
const confirmations_number  =  1;
const zeroAddress = '0x0000000000000000000000000000000000000000';
let contractInstance;

// Constructor parameters
const name = "MyERC721_NFT";
const symbol = "PCIB";

describe("Contract tests", () => {
    before(async () => {
        console.log("-----------------------------------------------------------------------------------");
        console.log(" -- Contract tests start");
        console.log("-----------------------------------------------------------------------------------");

        // Get Signer and provider
        [signer, account1, account2, account3] = await ethers.getSigners();
        provider = ethers.provider;

        // Deploy contract
        const contractFactory = await ethers.getContractFactory(contractPath, signer);
        contractInstance = await contractFactory.deploy(name, symbol);
    });

    describe("Constructor tests", () => {
        it("Try send empty name", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath, signer);
            await expect(contractFactory.deploy("", "")).to.be.revertedWith("constructor - Invalid parameter: _name");
        });

        it("Try send empty symbol", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath, signer);
            await expect(contractFactory.deploy("Test", "")).to.be.revertedWith("constructor - Invalid parameter: _symbol");
        });

        it("Initialization test", async () => {
            const receivedName = await contractInstance.name();
            const receivedSymbol = await contractInstance.symbol();

            expect(receivedName).to.be.equals(name);
            expect(receivedSymbol).to.be.equals(symbol);
        });
    });

    describe("Mint tests", () => {
        it("Try mint less that 2 amount", async () => {
            const amountToMint = ethers.utils.parseEther("1");
            const _uri = "test";
            await expect(contractInstance.mint(signer.address, _uri, {value: amountToMint})).to.be.revertedWith("mint - Invalid ether amount");
        });
        
        it("Try mint _recipient is zero address ", async () => {
            const amountToMint = ethers.utils.parseEther("2");
            const _uri = "test";
            await expect(contractInstance.mint(zeroAddress, _uri, {value: amountToMint})).to.be.revertedWith("mint - Invalid parameter: _recipient");
        });

        it("Try mint _uri is empty ", async () => {
            const amountToMint = ethers.utils.parseEther("2");
            const _uri = "";
            await expect(contractInstance.mint(signer.address, _uri, {value: amountToMint})).to.be.revertedWith("mint - Invalid parameter: _uri");
        });

        it("Mint successful", async () => {
            const signerBalanceBefore = await contractInstance.balanceOf(signer.address);
            const totalSupplyBefore = await contractInstance.totalSupply();
            const tokenIndexBefore = await contractInstance.tokenIndex();

            const _uri = "test";
            const amountToMint = ethers.utils.parseEther("2");

            const tx = await contractInstance.mint(signer.address, _uri, {value: amountToMint});

            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const signerBalanceAfter = await contractInstance.balanceOf(signer.address);
            const totalSupplyAfter = await contractInstance.totalSupply();
            const tokenIndexAfter = await contractInstance.tokenIndex();
            
            expect(parseInt(signerBalanceAfter)).to.be.equals(parseInt(signerBalanceBefore) + 1);           
            expect(parseInt(totalSupplyAfter)).to.be.equals(parseInt(totalSupplyBefore) + 1);
            expect(parseInt(tokenIndexAfter)).to.be.equals(parseInt(tokenIndexBefore) + 1);
            
            // Check event emited
            const eventSignature = "Transfer(address,address,uint256)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventToParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['uint256'], tx_result.logs[0].data)[0];
            
            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(zeroAddress);
            // Check event _to parameter
            expect(eventToParametrReceived).to.be.equals(signer.address);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(tokenIndexBefore);
        });

        it("Mint 2 successful", async () => {
            const signerBalanceBefore = await contractInstance.balanceOf(signer.address);
            const totalSupplyBefore = await contractInstance.totalSupply();
            const tokenIndexBefore = await contractInstance.tokenIndex();

            const _uri = "test2";
            const amountToMint = ethers.utils.parseEther("2");

            const tx = await contractInstance.mint(signer.address, _uri, {value: amountToMint});

            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const signerBalanceAfter = await contractInstance.balanceOf(signer.address);
            const totalSupplyAfter = await contractInstance.totalSupply();
            const tokenIndexAfter = await contractInstance.tokenIndex();
            
            expect(parseInt(signerBalanceAfter)).to.be.equals(parseInt(signerBalanceBefore) + 1);           
            expect(parseInt(totalSupplyAfter)).to.be.equals(parseInt(totalSupplyBefore) + 1);
            expect(parseInt(tokenIndexAfter)).to.be.equals(parseInt(tokenIndexBefore) + 1);
            
            // Check event emited
            const eventSignature = "Transfer(address,address,uint256)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventToParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['uint256'], tx_result.logs[0].data)[0];
            
            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(zeroAddress);
            // Check event _to parameter
            expect(eventToParametrReceived).to.be.equals(signer.address);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(tokenIndexBefore);
        });
    });

    describe("Approval for All tests", () => {
        // it("Try msg.sender is not the current owner or an authorized operator", async () => {
        //     const setApproved = true;
        //     const newInstance = await contractInstance.connect(account1);
        //     await expect(newInstance.setApprovalForAll(signer.address, setApproved)).to.be.revertedWith("setApprovalForAll - Not authorized");
        // });

        it("Try use _operator zero address", async () => {
            const setApproved = true;
            await expect(contractInstance.setApprovalForAll(zeroAddress, setApproved)).to.be.revertedWith("setApprovalForAll - Invalid parameter: _operator");
        });

        it("Approval for All successful", async () => {     
            const operatorBefore = await contractInstance.operator(signer.address, account1.address);

            const setApproved = true;
            const tx = await contractInstance.setApprovalForAll(account1.address, setApproved);
            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const operatorAfter = await contractInstance.operator(signer.address, account1.address);
            expect(operatorAfter).to.be.not.equal(operatorBefore);
            expect(operatorAfter).to.be.equal(setApproved);

            // Check event emited
            const eventSignature = "ApprovalForAll(address,address,bool)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventToParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['bool'], tx_result.logs[0].data)[0];

            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(signer.address);
            // Check event _to parameter
            expect(eventToParametrReceived).to.be.equals(account1.address);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(setApproved);
        });
    });

    describe("Approve tests", () => {
        it("Try use msg.sender not authorized", async () => {
            const tokenId = 0;
            const newInstance = await contractInstance.connect(account1);
            await expect(newInstance.approve(signer.address, tokenId)).to.be.revertedWith("approve - Not authorized");
        });

        it("Try use _approved zero address", async () => {
            const tokenId = 0;
            await expect(contractInstance.approve(zeroAddress, tokenId)).to.be.revertedWith("approve - Invalid parameter: _approved");
        });

        it("Try _tokenId is invalid", async () => {
            const tokenId = 110;
            await expect(contractInstance.approve(signer.address, tokenId)).to.be.revertedWith("approve - Invalid parameter: _tokenId");
        });

        it("Approve _approved successful", async () => {           
            const tokenId = 0;
            const tx = await contractInstance.approve(account1.address, tokenId);
            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const addressApproveAfter = await contractInstance.approved(tokenId);
            expect(addressApproveAfter).to.be.equal(account1.address);

            // Check event emited
            const eventSignature = "Approval(address,address,uint256)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventToParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['uint256'], tx_result.logs[0].data)[0];

            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(signer.address);
            // Check event _to parameter
            expect(eventToParametrReceived).to.be.equals(account1.address);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(tokenId);
        });
    });

    describe("Safe Transfer From tests", () => {
        it("Try use msg.sender not authorized", async () => {
            const tokenId = 0;
            const newInstance = await contractInstance.connect(account1);
            await expect(newInstance.safeTransferFrom(account2.address, account3.address, tokenId)).to.be.revertedWith("safeTransferFrom - Not authorized");
        });

        it("Try use _from zero address", async () => {
            const tokenId = 0;
            await expect(contractInstance.safeTransferFrom(zeroAddress, account2.address, tokenId)).to.be.revertedWith("safeTransferFrom - Invalid parameter: _from");
        });

        it("Try use _to zero address", async () => {
            const tokenId = 0;
            await expect(contractInstance.safeTransferFrom(account1.address, zeroAddress, tokenId)).to.be.revertedWith("safeTransferFrom - Invalid parameter: _to");
        });

        it("Try use _tokenId is invalid", async () => {
            const tokenId = 11110;
            await expect(contractInstance.safeTransferFrom(account1.address, account2.address, tokenId)).to.be.revertedWith("safeTransferFrom - Invalid parameter: _tokenId");
        });

        it("Transfer successful", async () => {
            const account1BalanceBefore = await contractInstance.balanceOf(signer.address);
            const account2BalanceBefore = await contractInstance.balanceOf(account2.address);
            
            const tokenId = 0;
            const tx = await contractInstance.safeTransferFrom(signer.address, account2.address, tokenId);

            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const account1BalanceAfter = await contractInstance.balanceOf(signer.address);
            const account2BalanceAfter = await contractInstance.balanceOf(account2.address);
            expect(parseInt(account1BalanceAfter)).to.be.equals(parseInt(account1BalanceBefore) - 1);
            expect(parseInt(account2BalanceAfter)).to.be.equals(parseInt(account2BalanceBefore) + 1);

            const newOwner = await contractInstance.ownerOf(tokenId);
            expect(account2.address).to.be.equals(newOwner);

            // Check event emited
            const eventSignature = "Transfer(address,address,uint256)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventToParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['uint256'], tx_result.logs[0].data)[0];

            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(signer.address);
            // Check event _to parameter
            expect(eventToParametrReceived).to.be.equals(account2.address);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(tokenId);
        });
    });

    describe("Burn tests", () => {
        it("Try _from is zero address", async () => {
            const tokenId = 0;
            await expect(contractInstance.burn(zeroAddress, tokenId)).to.be.revertedWith("burn - Invalid parameter: _from");
        });

        it("Try use msg.sender not authorized", async () => {
            const tokenId = 0;
            const newInstance = await contractInstance.connect(account1);
            await expect(newInstance.burn(account1.address, tokenId)).to.be.revertedWith("burn - Not authorized");
        });

        // it("Try _from account is not the owner of _tokenId", async () => {
        //     const tokenId = 0;
        //     await expect(contractInstance.burn(account1.address, tokenId)).to.be.revertedWith("burn - Not the owner");
        // });

        it("Burn NFT from _from account", async () => {
            const signerBalanceBefore = await contractInstance.balanceOf(signer.address);
            const totalSupplyBefore = await contractInstance.totalSupply();

            const tokenId = 1;
            const tx = await contractInstance.burn(signer.address, tokenId);

            tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
            if(tx_result.confirmations < 0 || tx_result === undefined) {
                throw new Error("Transaction failed");
            }

            // Check balance
            const signerBalanceAfter = await contractInstance.balanceOf(signer.address);
            const totalSupplyAfter = await contractInstance.totalSupply();

            expect(parseInt(signerBalanceAfter)).to.be.equals(parseInt(signerBalanceBefore) - 1);
            expect(parseInt(totalSupplyAfter)).to.be.equals(parseInt(totalSupplyBefore) - 1);

            // Check event emited
            const eventSignature = "Transfer(address,address,uint256)";
            const eventSignatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventSignature));
                        
            // Receipt information
            const eventSignatureHashReceived = tx_result.logs[0].topics[0];
            const eventFromParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[1])[0];
            const eventCommandedByParametrReceived = ethers.utils.defaultAbiCoder.decode(['address'], tx_result.logs[0].topics[2])[0];
            const eventValueParametrReceived = ethers.utils.defaultAbiCoder.decode(['uint256'], tx_result.logs[0].data)[0];

            // Check event signayure
            expect(eventSignatureHashReceived).to.be.equals(eventSignatureHash);
            // Check event _from parameter
            expect(eventFromParametrReceived).to.be.equals(signer.address);
            // Check event _to parameter
            expect(eventCommandedByParametrReceived).to.be.equals(zeroAddress);
            // Check event _value parameter
            expect(eventValueParametrReceived).to.be.equals(tokenId);
        });
    });
});