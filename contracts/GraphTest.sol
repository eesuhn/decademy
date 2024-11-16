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

    // Admin functions
    function setTrustedRelayer(address _relayer) external onlyOwner {
        require(_relayer != address(0), "Invalid relayer address");
        trustedRelayer = _relayer;
    }

    // Getter
    // emitTopicAttestationStatus
    function getTopic(uint256 topicId) external view returns (string memory, string memory, address, string memory, bool) {
        require(topicId > 0 && topicId <= topicIdCounter, "Invalid topic ID");
        Topic memory t = topics[topicId];
        return (t.topic, t.description, t.learner, t.image, t.isAttested);
    }

    function getTopicCount() external view returns (uint256) {
        return topicIdCounter;
    }

    function getPayout(
        uint256 topicId,
        uint256 engagement,
        uint256 totalEngagement,
        uint256 rating,
        uint256 totalRating,
        uint256 learner,
        uint256 totalLearner
    ) external view returns (uint256 payoutAmount) {
        require(totalEngagement > 0, "Total engagement cannot be zero");
        require(totalRating > 0, "Total rating cannot be zero");
        require(totalLearner > 0, "Total learners cannot be zero");

        uint256 numerator = engagement * rating * learner * topicStakedPool[topicId]; 
        uint256 denominator = totalEngagement * totalRating * totalLearner;
        payoutAmount = numerator / denominator;
        return payoutAmount;
    }

    function getTopicStakedPool(uint256 _topicId) external view returns (uint256) {
        require(_topicId > 0 && _topicId <= topicIdCounter, "Invalid topic ID");
        return topicStakedPool[_topicId];
    }

    // Main Functions
    function emitCreateUser(address walletAddr, string calldata name, string[] calldata socials) public {
        whoIsVerified[walletAddr] = false;
        emit createUser(walletAddr, name, socials, whoIsVerified[walletAddr]);
    }

    function emitAddUserToModule(address walletAddr, uint256 moduleId) public {
        require(moduleId > 0 && moduleId <= moduleIdCounter, "Error: Invalid moduleId");
        emit learnerJoinModule(walletAddr, moduleId);
    }

    function emitAddUserToTopic(address walletAddr, uint256 topicId) public {
        require(topicId > 0 && topicId <= topicIdCounter, "Error: Invalid topicId");
        emit learnerJoinTopic(walletAddr, topicId);
    }

    function emitVerifyWorldID(address walletAddr) public {
        require(whoIsVerified[walletAddr] == false, "Error: User already verified");
        whoIsVerified[walletAddr] = true;
        emit updateWorldIdStatus(walletAddr);
    }

    function emitCreateModule(
        uint256 topicId, address eduWalletAddr, uint256 totalPages,
        string calldata title, string calldata description, string calldata moduleIMG
    ) public {
        require(topicId > 0 && topicId <= topicIdCounter, "Error: Invalid topicId");
        moduleIdCounter++;
        emit createModule(eduWalletAddr, topicId, moduleIdCounter, totalPages, title, description, moduleIMG);
    }

    function emitUpdateLearnerProgress(address walletAddr, uint256 moduleId, uint256 pageAmount, uint256 rating) public {
        require(moduleId > 0 && moduleId <= moduleIdCounter, "Error: Invalid moduleId");
        emit updateLearnerProgress(walletAddr, moduleId, pageAmount, rating);
    }

    function submitTopic(string memory topic, string memory description, address learner, string memory topicIMG) external {
        require(!existingTopics[topic], "Topic already submitted");
        require(learner != address(0), "Invalid learner address");
        topicIdCounter++;
        topics[topicIdCounter] = Topic({
            topic: topic,
            description: description,
            image: topicIMG,
            learner: learner,
            isAttested: false
        });
        existingTopics[topic] = true;
        emit createTopic(topicIdCounter, topic, description, topicIMG, false);
    }

    function emitAttestTopic(uint256 topicId) external onlyEducator returns (uint64) {
        require(topicId > 0 && topicId <= topicIdCounter, "Invalid topic ID");
        require(!topics[topicId].isAttested, "Topic already attested");
        require(msg.sender != topics[topicId].learner, "Educator cannot be the learner");
        require(msg.sender != owner(), "Owner cannot attest to the topic");

        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(topics[topicId].learner);
        bytes memory data = abi.encode(
            topics[topicId].topic,
            topics[topicId].description,
            topics[topicId].image
        );
        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: data
        });
        topics[topicId].isAttested = true;
        uint64 attestationId = spInstance.attest(a, "", "", "");
        emit updateTopicAttestationStatus(topicId, true);
        return attestationId;
    }

    function emitAddEducator(address educator) external {
        require(msg.sender != owner(), "Contract owner cannot be educator");
        require(educator != owner(), "Contract owner cannot be educator");
        require(!educators[educator], "Address is already an educator");
        educatorPayout[educator] = 0;
        educators[educator] = true;
        emit createEducator(educator);
    }

    function stake(uint256 _topicId) external payable validStakeAmount {
        require(_topicId <= topicIdCounter && _topicId > 0, "Invalid topic ID");
        require(!isStaked[msg.sender][_topicId], "Already staked for this topic");
        isStaked[msg.sender][_topicId] = true;
        userStakeAmount[msg.sender][_topicId] += msg.value;
        topicStakedPool[_topicId] += msg.value;
        emit Staked(
            msg.sender,
            _topicId,
            msg.value,
            block.timestamp
        );
        emit StakePoolUpdated(_topicId,topicStakedPool[_topicId],block.timestamp);
        emit learnerJoinTopic(msg.sender, _topicId);
    }

    function withdraw(uint256 _topicId, uint256 amount, address payable recipient) external onlyEducator {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0 && amount <= topicStakedPool[_topicId], "Insufficient balance for this topic");
        topicStakedPool[_topicId] -= amount;
        recipient.transfer(amount);
    }
}
