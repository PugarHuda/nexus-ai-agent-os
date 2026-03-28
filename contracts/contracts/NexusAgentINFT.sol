// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IERC7857.sol";
import "./interfaces/IOracle.sol";

/**
 * @title NexusAgentINFT
 * @notice Core INFT contract for Nexus AI Agent OS.
 *         Every agent born in Nexus gets an INFT containing its encrypted brain.
 *
 * Key features:
 * - Mint agent with encrypted metadata stored on 0G Storage
 * - Secure transfer with oracle-verified re-encryption
 * - Clone agents (fork with same intelligence)
 * - Authorize usage (AI-as-a-Service subscription model)
 */
contract NexusAgentINFT is ERC721Enumerable, Ownable, ReentrancyGuard, IERC7857 {

    // ─── State ───────────────────────────────────────────────
    uint256 private _nextTokenId = 1;
    address public oracle;

    struct AgentMetadata {
        string encryptedURI;      // 0G Storage URI for encrypted agent brain
        bytes32 metadataHash;     // Integrity hash of the metadata
        uint256 createdAt;
        uint256 clonedFrom;       // 0 if original, parent tokenId if cloned
        string[] skillIds;        // Equipped skill INFT references
    }

    mapping(uint256 => AgentMetadata) private _agents;
    mapping(uint256 => mapping(address => bytes)) private _authorizations;
    mapping(uint256 => address[]) private _authorizedUsers;

    // ─── Events ──────────────────────────────────────────────
    event AgentMinted(uint256 indexed tokenId, address indexed owner, bytes32 metadataHash);
    event SkillEquipped(uint256 indexed agentId, string skillId);
    event SkillUnequipped(uint256 indexed agentId, string skillId);

    // ─── Constructor ─────────────────────────────────────────
    constructor(
        address _oracle
    ) ERC721("Nexus AI Agent", "NEXUS") Ownable(msg.sender) {
        oracle = _oracle;
    }

    // ─── Mint ────────────────────────────────────────────────
    /// @notice Birth a new agent — mint INFT with encrypted brain
    function mintAgent(
        address to,
        string calldata _encryptedURI,
        bytes32 _metadataHash
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        _agents[tokenId] = AgentMetadata({
            encryptedURI: _encryptedURI,
            metadataHash: _metadataHash,
            createdAt: block.timestamp,
            clonedFrom: 0,
            skillIds: new string[](0)
        });

        emit AgentMinted(tokenId, to, _metadataHash);
        return tokenId;
    }

    // ─── Secure Transfer (ERC-7857) ──────────────────────────
    function secureTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata sealedKey,
        bytes calldata proof
    ) external override nonReentrant {
        require(ownerOf(tokenId) == from, "Not owner");
        require(to != address(0), "Zero address");
        require(
            msg.sender == from || isApprovedForAll(from, msg.sender) || getApproved(tokenId) == msg.sender,
            "Not authorized to transfer"
        );
        require(IOracle(oracle).verifyProof(proof), "Invalid oracle proof");

        // Update metadata access for new owner
        _updateMetadata(tokenId, sealedKey, proof);

        // Clear all usage authorizations on transfer
        _clearAuthorizations(tokenId);

        // Transfer ownership
        _transfer(from, to, tokenId);
    }

    // ─── Clone (ERC-7857) ────────────────────────────────────
    function clone(
        address to,
        uint256 tokenId,
        bytes calldata sealedKey,
        bytes calldata proof
    ) external override nonReentrant returns (uint256 newTokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(IOracle(oracle).verifyProof(proof), "Invalid oracle proof");

        newTokenId = _nextTokenId++;
        _safeMint(to, newTokenId);

        AgentMetadata storage original = _agents[tokenId];
        _agents[newTokenId] = AgentMetadata({
            encryptedURI: original.encryptedURI, // Oracle will re-encrypt
            metadataHash: keccak256(sealedKey),
            createdAt: block.timestamp,
            clonedFrom: tokenId,
            skillIds: original.skillIds // Clone inherits skills
        });

        _updateMetadata(newTokenId, sealedKey, proof);

        emit AgentCloned(tokenId, newTokenId, to);
    }

    // ─── Authorized Usage (ERC-7857) ─────────────────────────
    function authorizeUsage(
        uint256 tokenId,
        address executor,
        bytes calldata permissions
    ) external override {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(executor != address(0), "Zero address");

        _authorizations[tokenId][executor] = permissions;
        _authorizedUsers[tokenId].push(executor);

        emit UsageAuthorized(tokenId, executor);
    }

    function revokeUsage(uint256 tokenId, address executor) external override {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        delete _authorizations[tokenId][executor];
        emit UsageRevoked(tokenId, executor);
    }

    function isAuthorized(uint256 tokenId, address executor) external view override returns (bool) {
        return _authorizations[tokenId][executor].length > 0;
    }

    // ─── Skill Management ────────────────────────────────────
    function equipSkill(uint256 agentId, string calldata skillId) external {
        require(ownerOf(agentId) == msg.sender, "Not owner");
        _agents[agentId].skillIds.push(skillId);
        emit SkillEquipped(agentId, skillId);
    }

    function unequipSkill(uint256 agentId, uint256 skillIndex) external {
        require(ownerOf(agentId) == msg.sender, "Not owner");
        string[] storage skills = _agents[agentId].skillIds;
        require(skillIndex < skills.length, "Invalid index");

        string memory removedSkill = skills[skillIndex];
        skills[skillIndex] = skills[skills.length - 1];
        skills.pop();

        emit SkillUnequipped(agentId, removedSkill);
    }

    function getAgentSkills(uint256 agentId) external view returns (string[] memory) {
        return _agents[agentId].skillIds;
    }

    // ─── View Functions ──────────────────────────────────────
    function encryptedURI(uint256 tokenId) external view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _agents[tokenId].encryptedURI;
    }

    function metadataHash(uint256 tokenId) external view override returns (bytes32) {
        return _agents[tokenId].metadataHash;
    }

    function getAgent(uint256 tokenId) external view returns (
        string memory uri,
        bytes32 hash_,
        uint256 createdAt,
        uint256 clonedFrom,
        string[] memory skills
    ) {
        AgentMetadata storage a = _agents[tokenId];
        return (a.encryptedURI, a.metadataHash, a.createdAt, a.clonedFrom, a.skillIds);
    }

    // ─── Admin ───────────────────────────────────────────────
    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    // ─── Internal ────────────────────────────────────────────
    function _updateMetadata(
        uint256 tokenId,
        bytes calldata sealedKey,
        bytes calldata proof
    ) internal {
        _agents[tokenId].metadataHash = keccak256(sealedKey);
        // If proof contains new URI (length > 64), update it
        if (proof.length > 64) {
            _agents[tokenId].encryptedURI = string(proof[64:]);
        }
        emit MetadataUpdated(tokenId, _agents[tokenId].metadataHash);
    }

    function _clearAuthorizations(uint256 tokenId) internal {
        address[] storage users = _authorizedUsers[tokenId];
        for (uint256 i = 0; i < users.length; i++) {
            delete _authorizations[tokenId][users[i]];
        }
        delete _authorizedUsers[tokenId];
    }

    // ─── Required Overrides ──────────────────────────────────
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
