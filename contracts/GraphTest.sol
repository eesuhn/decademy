// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import { Attestation } from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import { DataLocation } from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import "hardhat/console.sol";

contract GraphTest is Ownable {
    ISP public spInstance;
    uint64 public schemaId;
    address public trustedRelayer;
    uint256 private topicIdCounter = 0;
    uint256 private moduleIdCounter = 0;

    struct Topic {
        string topic;
        string description;
        string image;
        address learner;
        bool isAttested;
    }

    mapping (address => bool) public whoIsVerified;
    mapping (address => uint256) private educatorPayout;
    mapping(string => bool) private existingTopics;
    mapping(uint256 => Topic) public topics;
    mapping(address => bool) public educators;
    mapping(address => mapping(uint256 => bool)) public isStaked;
    mapping(uint256 => uint256) public topicStakedPool;
    mapping(address => mapping(uint256 => uint256)) public userStakeAmount;

    event createUser(address userWalletAddr, string name, string[] socials, bool isVerified);
    event learnerJoinTopic(address userWalletAddr, uint256 topicId);
    event learnerJoinModule(address userWalletAddr, uint256 moduleId);
    event createEducator(address userWalletAddr);
    event createTopic(uint256 topicId, string title, string description, string topicIMG, bool isAttested);
    event createModule(
        address indexed eduWalletAddr,
        uint256 indexed topicId,
        uint256 indexed moduleId,
        uint256 pageAmount,
        string title,
        string description,
        string moduleIMG
    );
    event updateLearnerProgress(address indexed userWalletAddr, uint256 indexed moduleId, uint256 pageAmount, uint256 rating);
    event updateWorldIdStatus(address indexed walletAddr);
    event updateTopicAttestationStatus(uint256 indexed topicId, bool isAttested);
    event Staked(
        address indexed user,
        uint256 indexed topicId,
        uint256 amount,
        uint256 timestamp
    );
    event StakePoolUpdated(
        uint256 indexed topicId,
        uint256 newTotalAmount,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyEducator() {
        require(educators[msg.sender], "Caller is not an educator");
        _; 
    }
    modifier onlyRelayerOrUser() {
        require(msg.sender == trustedRelayer || msg.sender == tx.origin, "Unauthorized");
        _;
    }
    modifier validStakeAmount() {
        require(msg.value > 0.0001 ether, "Stake amount must be greater than 0.0001 ETH");
        _;
    }

    // Constructor
    constructor(address instance, uint64 schema) Ownable(_msgSender()) {
        spInstance = ISP(instance);
        schemaId = schema;
    }
}
