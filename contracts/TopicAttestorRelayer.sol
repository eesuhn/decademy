// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "./GraphTest.sol";

contract TopicAttestorRelayer is Ownable {
    GraphTest public graphTest;
    mapping(address => uint256) public nonces;

    event RelayedTransaction(address indexed user, bool success);
    event LogBytes32(bytes32 data);
    constructor(address _graphTest) Ownable(_msgSender()) {
        graphTest = GraphTest(_graphTest);
    }

    modifier onlyRelayer() {
        require(msg.sender == owner(), "Only relayer can call this function");
        _;
    }

    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    function metaTxSubmitTopic(
        address user,
        string memory topic,
        string memory description,
        string memory topicIMG,
        bytes memory signature
    ) external onlyRelayer {
        require(address(msg.sender).balance >= 0.001 ether, "Relayer: Low balance");
        bytes32 messageHash = keccak256(abi.encodePacked(user, topic, description, topicIMG, nonces[user]));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(SignatureChecker.isValidSignatureNow(user, ethSignedMessageHash, signature), "Invalid signature");
        nonces[user]++;
        try graphTest.submitTopic(topic, description, user, topicIMG) {
        } catch {
            revert("Transaction failed");
        }
    }

    function metaTxAddEducator(
        address user,
        address educator,
        bytes memory signature
    ) external onlyRelayer {
        require(address(msg.sender).balance >= 0.001 ether, "Relayer: Low balance");
        bytes32 messageHash = keccak256(abi.encodePacked(user, educator, nonces[user]));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(SignatureChecker.isValidSignatureNow(user, ethSignedMessageHash, signature), "Invalid signature");
        nonces[user]++;
        try graphTest.emitAddEducator(educator) {
        } catch {
            revert("Transaction failed");
        }
    }

    function metaTxEmitAddUserToModule(
        address user,
        address walletAddr,
        uint256 moduleId,
        bytes memory signature
    ) external onlyRelayer {
        require(address(msg.sender).balance >= 0.001 ether, "Relayer: Low balance");
        bytes memory encodedParams = abi.encode(walletAddr, moduleId);
        bytes32 messageHash = keccak256(abi.encodePacked(user, encodedParams, nonces[user]));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(SignatureChecker.isValidSignatureNow(user, ethSignedMessageHash, signature), "Invalid signature");
        nonces[user]++;
        try graphTest.emitAddUserToModule(walletAddr, moduleId) {
        } catch {
            revert("Transaction failed");
        }
    }
}
