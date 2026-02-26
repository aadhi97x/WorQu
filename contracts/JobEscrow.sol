// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IWorkAgreementNFT {
    function mintAgreement(address, address, uint256, uint256, string memory) external returns (uint256);
    function updateStatus(uint256, string memory) external;
}

contract JobEscrow is ReentrancyGuard {
    enum Status { Open, Funded, Active, Completed, Disputed, Refunded }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        string  title;
        string  description;
        uint256 budget;
        uint256 deadline;
        Status  status;
        uint256 createdAt;
        string  category;
    }

    uint256 public jobCount;
    mapping(uint256 => Job) public jobs;
    IWorkAgreementNFT public nftContract;

    event JobPosted(uint256 indexed jobId, address indexed client, uint256 budget, string title);
    event ProposalAccepted(uint256 indexed jobId, address indexed freelancer);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event JobRefunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event DisputeRaised(uint256 indexed jobId);

    modifier onlyClient(uint256 jobId) {
        require(jobs[jobId].client == msg.sender, "Not the client");
        _;
    }

    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid address");
        nftContract = IWorkAgreementNFT(_nftContract);
    }

    function postJob(string memory title, string memory description, string memory category, uint256 deadline)
        external payable returns (uint256)
    {
        require(msg.value > 0, "Must fund job");
        require(deadline > block.timestamp, "Bad deadline");
        uint256 jobId = jobCount++;
        jobs[jobId] = Job(jobId, msg.sender, address(0), title, description, msg.value, deadline, Status.Funded, block.timestamp, category);
        emit JobPosted(jobId, msg.sender, msg.value, title);
        return jobId;
    }

    function acceptProposal(uint256 jobId, address freelancer, string memory tokenURI)
        external onlyClient(jobId)
    {
        Job storage job = jobs[jobId];
        require(job.status == Status.Funded, "Not available");
        require(freelancer != job.client, "Freelancer cannot be client");
        
        job.freelancer = freelancer;
        job.status = Status.Active;
        nftContract.mintAgreement(job.client, freelancer, jobId, job.budget, tokenURI);
        emit ProposalAccepted(jobId, freelancer);
    }

    function releasePayment(uint256 jobId) external onlyClient(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        require(job.status == Status.Active, "Not active");
        job.status = Status.Completed;
        nftContract.updateStatus(jobId, "completed");
        (bool ok,) = job.freelancer.call{value: job.budget}("");
        require(ok, "Transfer failed");
        emit PaymentReleased(jobId, job.freelancer, job.budget);
    }

    function raiseDispute(uint256 jobId) external onlyClient(jobId) {
        require(jobs[jobId].status == Status.Active, "Not active");
        jobs[jobId].status = Status.Disputed;
        nftContract.updateStatus(jobId, "disputed");
        emit DisputeRaised(jobId);
    }

    function markJobDelivered(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.freelancer, "Not the freelancer");
        require(job.status == Status.Active, "Not active");
        nftContract.updateStatus(jobId, "review_pending");
    }

    function refund(uint256 jobId) external onlyClient(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        require(job.status == Status.Funded && block.timestamp > job.deadline, "Not refundable");
        job.status = Status.Refunded;
        (bool ok,) = job.client.call{value: job.budget}("");
        require(ok, "Refund failed");
        emit JobRefunded(jobId, job.client, job.budget);
    }

    function getJob(uint256 jobId) external view returns (Job memory) { return jobs[jobId]; }

    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory all = new Job[](jobCount);
        for (uint256 i = 0; i < jobCount; i++) all[i] = jobs[i];
        return all;
    }
}
