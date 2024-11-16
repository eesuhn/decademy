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
}
