// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IOracle.sol";

/**
 * @title SkillRegistry
 * @notice Marketplace for AI agent skills as INFTs.
 *         Developers create skills, mint as INFT, others buy usage rights.
 *
 * Skills are modular capabilities (sentiment analysis, risk scoring, code review, etc.)
 * that agents can "equip" via authorizeUsage — pay subscription, get access without source code.
 *
 * Revenue model:
 * - Skill creator sets price per use or subscription fee
 * - Royalty automatically distributed on each usage payment
 * - Clone function allows forking skill templates
 */
contract SkillRegistry is ERC721Enumerable, Ownable, ReentrancyGuard {

    uint256 private _nextSkillId = 1;
    address public oracle;

    struct Skill {
        string name;
        string description;
        string encryptedURI;       // 0G Storage URI for encrypted skill weights
        bytes32 metadataHash;
        address creator;
        uint256 pricePerUse;       // In wei (0G tokens)
        uint256 subscriptionPrice; // Monthly subscription in wei
        uint256 totalUses;
        uint256 totalRevenue;
        uint256 createdAt;
        bool active;
    }

    struct Subscription {
        uint256 expiresAt;
        uint256 usesRemaining; // 0 = unlimited (subscription mode)
    }

    mapping(uint256 => Skill) public skills;
    mapping(uint256 => mapping(address => Subscription)) public subscriptions;
    mapping(uint256 => mapping(address => bytes)) private _authorizations;

    // Revenue tracking
    uint256 public platformFeePercent = 5; // 5% platform fee
    uint256 public accumulatedFees;

    event SkillCreated(uint256 indexed skillId, address indexed creator, string name);
    event SkillUsed(uint256 indexed skillId, address indexed user, uint256 payment);
    event SubscriptionPurchased(uint256 indexed skillId, address indexed subscriber, uint256 expiresAt);
    event SkillDeactivated(uint256 indexed skillId);
    event RevenueWithdrawn(address indexed creator, uint256 amount);

    constructor(address _oracle) ERC721("Nexus Skill", "NSKILL") Ownable(msg.sender) {
        oracle = _oracle;
    }

    // ─── Create Skill ────────────────────────────────────────
    function createSkill(
        string calldata name,
        string calldata description,
        string calldata _encryptedURI,
        bytes32 _metadataHash,
        uint256 _pricePerUse,
        uint256 _subscriptionPrice
    ) external returns (uint256) {
        uint256 skillId = _nextSkillId++;
        _safeMint(msg.sender, skillId);

        skills[skillId] = Skill({
            name: name,
            description: description,
            encryptedURI: _encryptedURI,
            metadataHash: _metadataHash,
            creator: msg.sender,
            pricePerUse: _pricePerUse,
            subscriptionPrice: _subscriptionPrice,
            totalUses: 0,
            totalRevenue: 0,
            createdAt: block.timestamp,
            active: true
        });

        emit SkillCreated(skillId, msg.sender, name);
        return skillId;
    }

    // ─── Pay Per Use ─────────────────────────────────────────
    function payForUse(uint256 skillId) external payable nonReentrant {
        Skill storage skill = skills[skillId];
        require(skill.active, "Skill inactive");
        require(msg.value >= skill.pricePerUse, "Insufficient payment");

        // Check if user has active subscription
        Subscription storage sub = subscriptions[skillId][msg.sender];
        if (sub.expiresAt > block.timestamp) {
            // Has subscription — free use
            revert("Active subscription exists, no payment needed");
        }

        // Distribute revenue
        uint256 fee = (msg.value * platformFeePercent) / 100;
        uint256 creatorShare = msg.value - fee;
        accumulatedFees += fee;

        payable(skill.creator).transfer(creatorShare);

        skill.totalUses++;
        skill.totalRevenue += msg.value;

        // Grant temporary authorization
        _authorizations[skillId][msg.sender] = abi.encodePacked(block.timestamp);

        emit SkillUsed(skillId, msg.sender, msg.value);
    }

    // ─── Subscribe ───────────────────────────────────────────
    function subscribe(uint256 skillId) external payable nonReentrant {
        Skill storage skill = skills[skillId];
        require(skill.active, "Skill inactive");
        require(msg.value >= skill.subscriptionPrice, "Insufficient payment");

        uint256 fee = (msg.value * platformFeePercent) / 100;
        uint256 creatorShare = msg.value - fee;
        accumulatedFees += fee;

        payable(skill.creator).transfer(creatorShare);

        subscriptions[skillId][msg.sender] = Subscription({
            expiresAt: block.timestamp + 30 days,
            usesRemaining: 0 // unlimited
        });

        skill.totalRevenue += msg.value;

        emit SubscriptionPurchased(skillId, msg.sender, block.timestamp + 30 days);
    }

    // ─── Authorization Check ─────────────────────────────────
    function isAuthorizedUser(uint256 skillId, address user) external view returns (bool) {
        // Owner always authorized
        if (ownerOf(skillId) == user) return true;
        // Check subscription
        if (subscriptions[skillId][user].expiresAt > block.timestamp) return true;
        // Check pay-per-use authorization
        return _authorizations[skillId][user].length > 0;
    }

    // ─── Skill Management ────────────────────────────────────
    function deactivateSkill(uint256 skillId) external {
        require(ownerOf(skillId) == msg.sender, "Not owner");
        skills[skillId].active = false;
        emit SkillDeactivated(skillId);
    }

    function updatePricing(
        uint256 skillId,
        uint256 newPricePerUse,
        uint256 newSubscriptionPrice
    ) external {
        require(ownerOf(skillId) == msg.sender, "Not owner");
        skills[skillId].pricePerUse = newPricePerUse;
        skills[skillId].subscriptionPrice = newSubscriptionPrice;
    }

    // ─── View Functions ──────────────────────────────────────
    function getSkill(uint256 skillId) external view returns (Skill memory) {
        return skills[skillId];
    }

    function getActiveSkillCount() external view returns (uint256 count) {
        for (uint256 i = 1; i < _nextSkillId; i++) {
            if (skills[i].active) count++;
        }
    }

    // ─── Admin ───────────────────────────────────────────────
    function withdrawFees() external onlyOwner {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(amount);
    }

    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 10, "Fee too high");
        platformFeePercent = newFeePercent;
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    // ─── Required Overrides ──────────────────────────────────
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
