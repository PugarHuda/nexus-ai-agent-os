// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IERC7857 — Intelligent NFT Standard for AI Agents
 * @notice Extends ERC-721 with encrypted metadata, secure transfers,
 *         clone functionality, and authorized usage (AI-as-a-Service).
 */
interface IERC7857 is IERC721 {
    /// @notice Transfer with metadata re-encryption via oracle proof
    function secureTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata sealedKey,
        bytes calldata proof
    ) external;

    /// @notice Clone token — new INFT with same encrypted metadata
    function clone(
        address to,
        uint256 tokenId,
        bytes calldata sealedKey,
        bytes calldata proof
    ) external returns (uint256 newTokenId);

    /// @notice Grant usage rights without ownership transfer
    function authorizeUsage(
        uint256 tokenId,
        address executor,
        bytes calldata permissions
    ) external;

    /// @notice Revoke usage rights
    function revokeUsage(uint256 tokenId, address executor) external;

    /// @notice Check if address has usage authorization
    function isAuthorized(uint256 tokenId, address executor) external view returns (bool);

    /// @notice Get encrypted metadata URI
    function encryptedURI(uint256 tokenId) external view returns (string memory);

    /// @notice Get metadata integrity hash
    function metadataHash(uint256 tokenId) external view returns (bytes32);

    event MetadataUpdated(uint256 indexed tokenId, bytes32 newHash);
    event UsageAuthorized(uint256 indexed tokenId, address indexed executor);
    event UsageRevoked(uint256 indexed tokenId, address indexed executor);
    event AgentCloned(uint256 indexed originalId, uint256 indexed newId, address indexed owner);
}
