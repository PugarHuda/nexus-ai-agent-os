// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationEngine
 * @notice On-chain reputation system for Nexus AI agents.
 *
 * Reputation is computed from verified action proofs posted via 0G DA.
 * Scores are on-chain, immutable, and transferable with the agent INFT.
 *
 * Dimensions:
 * - accuracy: how often agent predictions/outputs are correct
 * - reliability: uptime, response consistency
 * - safety: inverse of flagged incidents
 * - collaboration: successful multi-agent interactions
 *
 * Only authorized reporters (backend services, other contracts) can submit scores.
 */
contract ReputationEngine is Ownable {

    struct Reputation {
        uint256 accuracy;       // 0-10000 (basis points, 10000 = 100%)
        uint256 reliability;
        uint256 safety;
        uint256 collaboration;
        uint256 totalActions;
        uint256 lastUpdated;
    }

    struct ActionProof {
        uint256 agentId;
        uint8 dimension;        // 0=accuracy, 1=reliability, 2=safety, 3=collaboration
        uint256 score;          // 0-10000
        bytes32 daProofHash;    // Hash of proof posted to 0G DA
        uint256 timestamp;
    }

    mapping(uint256 => Reputation) public reputations;
    mapping(address => bool) public authorizedReporters;

    // History of all action proofs for auditability
    mapping(uint256 => ActionProof[]) public actionHistory;

    event ReputationUpdated(uint256 indexed agentId, uint8 dimension, uint256 newScore);
    event ActionRecorded(uint256 indexed agentId, bytes32 daProofHash);
    event ReporterAdded(address indexed reporter);
    event ReporterRemoved(address indexed reporter);

    modifier onlyReporter() {
        require(authorizedReporters[msg.sender], "Not authorized reporter");
        _;
    }

    constructor() Ownable(msg.sender) {
        authorizedReporters[msg.sender] = true;
    }

    // ─── Record Action ───────────────────────────────────────
    /// @notice Record a verified action and update reputation
    /// @param agentId The INFT token ID of the agent
    /// @param dimension 0=accuracy, 1=reliability, 2=safety, 3=collaboration
    /// @param score Score for this action (0-10000 basis points)
    /// @param daProofHash Hash of the proof posted to 0G DA
    function recordAction(
        uint256 agentId,
        uint8 dimension,
        uint256 score,
        bytes32 daProofHash
    ) external onlyReporter {
        require(dimension <= 3, "Invalid dimension");
        require(score <= 10000, "Score out of range");

        Reputation storage rep = reputations[agentId];

        // Exponential moving average: new = (old * totalActions + score) / (totalActions + 1)
        uint256 total = rep.totalActions;
        if (dimension == 0) {
            rep.accuracy = (rep.accuracy * total + score) / (total + 1);
        } else if (dimension == 1) {
            rep.reliability = (rep.reliability * total + score) / (total + 1);
        } else if (dimension == 2) {
            rep.safety = (rep.safety * total + score) / (total + 1);
        } else {
            rep.collaboration = (rep.collaboration * total + score) / (total + 1);
        }

        rep.totalActions = total + 1;
        rep.lastUpdated = block.timestamp;

        // Store proof for auditability
        actionHistory[agentId].push(ActionProof({
            agentId: agentId,
            dimension: dimension,
            score: score,
            daProofHash: daProofHash,
            timestamp: block.timestamp
        }));

        emit ReputationUpdated(agentId, dimension, score);
        emit ActionRecorded(agentId, daProofHash);
    }

    // ─── Batch Record ────────────────────────────────────────
    function batchRecordActions(
        uint256[] calldata agentIds,
        uint8[] calldata dimensions,
        uint256[] calldata scores,
        bytes32[] calldata daProofHashes
    ) external onlyReporter {
        require(
            agentIds.length == dimensions.length &&
            agentIds.length == scores.length &&
            agentIds.length == daProofHashes.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < agentIds.length; i++) {
            this.recordAction(agentIds[i], dimensions[i], scores[i], daProofHashes[i]);
        }
    }

    // ─── View Functions ──────────────────────────────────────
    function getReputation(uint256 agentId) external view returns (Reputation memory) {
        return reputations[agentId];
    }

    /// @notice Composite score (weighted average of all dimensions)
    function getCompositeScore(uint256 agentId) external view returns (uint256) {
        Reputation storage rep = reputations[agentId];
        if (rep.totalActions == 0) return 0;

        // Weights: accuracy 30%, reliability 25%, safety 30%, collaboration 15%
        return (
            rep.accuracy * 30 +
            rep.reliability * 25 +
            rep.safety * 30 +
            rep.collaboration * 15
        ) / 100;
    }

    function getActionCount(uint256 agentId) external view returns (uint256) {
        return actionHistory[agentId].length;
    }

    function getActionProof(uint256 agentId, uint256 index) external view returns (ActionProof memory) {
        return actionHistory[agentId][index];
    }

    // ─── Admin ───────────────────────────────────────────────
    function addReporter(address reporter) external onlyOwner {
        authorizedReporters[reporter] = true;
        emit ReporterAdded(reporter);
    }

    function removeReporter(address reporter) external onlyOwner {
        authorizedReporters[reporter] = false;
        emit ReporterRemoved(reporter);
    }
}
