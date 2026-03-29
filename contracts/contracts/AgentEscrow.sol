// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentEscrow
 * @notice Trustless escrow for agent-to-agent and agent-to-user transactions.
 *
 * Flow:
 * 1. Requester creates task with payment locked in escrow
 * 2. Agent executes task via 0G Compute (TeeML verified)
 * 3. Proof of completion posted to 0G DA
 * 4. Payment released to agent owner (or refunded on dispute)
 *
 * Supports automatic release after timeout if no dispute raised.
 */
contract AgentEscrow is Ownable, ReentrancyGuard {

    enum TaskStatus { Created, InProgress, Completed, Disputed, Refunded, Released }

    struct Task {
        uint256 id;
        address requester;
        uint256 agentId;          // INFT token ID of the executing agent
        address agentOwner;
        uint256 payment;
        string description;
        bytes32 resultHash;       // Hash of result stored on 0G Storage
        bytes32 daProofHash;      // Hash of proof posted to 0G DA
        TaskStatus status;
        uint256 createdAt;
        uint256 completedAt;
        uint256 disputeDeadline;
    }

    uint256 private _nextTaskId = 1;
    uint256 public disputePeriod = 3 days;
    uint256 public platformFeePercent = 3;

    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userTasks;
    mapping(uint256 => uint256[]) public agentTasks; // agentId => taskIds

    uint256 public accumulatedFees;

    event TaskCreated(uint256 indexed taskId, address indexed requester, uint256 indexed agentId, uint256 payment);
    event TaskStarted(uint256 indexed taskId);
    event TaskCompleted(uint256 indexed taskId, bytes32 resultHash, bytes32 daProofHash);
    event TaskDisputed(uint256 indexed taskId, address indexed disputer);
    event PaymentReleased(uint256 indexed taskId, address indexed recipient, uint256 amount);
    event PaymentRefunded(uint256 indexed taskId, address indexed requester, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // ─── Create Task ─────────────────────────────────────────
    function createTask(
        uint256 agentId,
        address agentOwner,
        string calldata description
    ) external payable nonReentrant returns (uint256) {
        require(msg.value > 0, "Payment required");
        require(agentOwner != address(0), "Invalid agent owner");

        uint256 taskId = _nextTaskId++;

        tasks[taskId] = Task({
            id: taskId,
            requester: msg.sender,
            agentId: agentId,
            agentOwner: agentOwner,
            payment: msg.value,
            description: description,
            resultHash: bytes32(0),
            daProofHash: bytes32(0),
            status: TaskStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0,
            disputeDeadline: 0
        });

        userTasks[msg.sender].push(taskId);
        agentTasks[agentId].push(taskId);

        emit TaskCreated(taskId, msg.sender, agentId, msg.value);
        return taskId;
    }

    // ─── Start Task ──────────────────────────────────────────
    function startTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Created, "Invalid status");
        require(msg.sender == task.agentOwner, "Not agent owner");

        task.status = TaskStatus.InProgress;
        emit TaskStarted(taskId);
    }

    // ─── Complete Task ───────────────────────────────────────
    function completeTask(
        uint256 taskId,
        bytes32 resultHash,
        bytes32 daProofHash
    ) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.InProgress, "Invalid status");
        require(msg.sender == task.agentOwner, "Not agent owner");

        task.resultHash = resultHash;
        task.daProofHash = daProofHash;
        task.status = TaskStatus.Completed;
        task.completedAt = block.timestamp;
        task.disputeDeadline = block.timestamp + disputePeriod;

        emit TaskCompleted(taskId, resultHash, daProofHash);
    }

    // ─── Release Payment ─────────────────────────────────────
    /// @notice Release payment after dispute period or by requester approval
    function releasePayment(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Completed, "Not completed");
        require(
            msg.sender == task.requester ||
            block.timestamp > task.disputeDeadline,
            "Dispute period active"
        );

        uint256 fee = (task.payment * platformFeePercent) / 100;
        uint256 payout = task.payment - fee;
        accumulatedFees += fee;

        task.status = TaskStatus.Released;
        payable(task.agentOwner).transfer(payout);

        emit PaymentReleased(taskId, task.agentOwner, payout);
    }

    // ─── Dispute ─────────────────────────────────────────────
    function disputeTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Completed, "Not completed");
        require(msg.sender == task.requester, "Not requester");
        require(block.timestamp <= task.disputeDeadline, "Dispute period ended");

        task.status = TaskStatus.Disputed;
        emit TaskDisputed(taskId, msg.sender);
    }

    /// @notice Owner resolves dispute (in production: replaced by AI judge or DAO)
    function resolveDispute(uint256 taskId, bool refund) external onlyOwner nonReentrant {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Disputed, "Not disputed");

        if (refund) {
            task.status = TaskStatus.Refunded;
            payable(task.requester).transfer(task.payment);
            emit PaymentRefunded(taskId, task.requester, task.payment);
        } else {
            uint256 fee = (task.payment * platformFeePercent) / 100;
            uint256 payout = task.payment - fee;
            accumulatedFees += fee;
            task.status = TaskStatus.Released;
            payable(task.agentOwner).transfer(payout);
            emit PaymentReleased(taskId, task.agentOwner, payout);
        }
    }

    // ─── View Functions ──────────────────────────────────────
    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    function getUserTaskCount(address user) external view returns (uint256) {
        return userTasks[user].length;
    }

    function getAgentTaskCount(uint256 agentId) external view returns (uint256) {
        return agentTasks[agentId].length;
    }

    function getNextTaskId() external view returns (uint256) {
        return _nextTaskId;
    }

    function getUserTasks(address user) external view returns (uint256[] memory) {
        return userTasks[user];
    }

    function getAgentTasks(uint256 agentId) external view returns (uint256[] memory) {
        return agentTasks[agentId];
    }

    // ─── Admin ───────────────────────────────────────────────
    function setDisputePeriod(uint256 newPeriod) external onlyOwner {
        disputePeriod = newPeriod;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(amount);
    }
}
