// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/IOracle.sol";

/**
 * @title MockOracle
 * @notice Mock oracle for testing. Always returns true.
 *         In production, replaced by TEE-backed oracle (Intel TDX / NVIDIA H100).
 */
contract MockOracle is IOracle {
    function verifyProof(bytes calldata) external pure override returns (bool) {
        return true;
    }

    function oracleType() external pure override returns (uint8) {
        return 1; // TEE
    }
}
