// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IOracle — TEE/ZKP Oracle for INFT metadata re-encryption
 * @notice Verifies proofs generated during secure transfer or clone operations.
 *         In production, this is backed by a TEE enclave (Intel TDX / NVIDIA H100).
 */
interface IOracle {
    /// @notice Verify a transfer/clone proof
    function verifyProof(bytes calldata proof) external view returns (bool);

    /// @notice Get oracle type (1 = TEE, 2 = ZKP)
    function oracleType() external view returns (uint8);
}
