// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorkAgreementNFT is ERC721URIStorage, Ownable {
    uint256 public tokenIds;

    struct Agreement {
        address client;
        address freelancer;
        uint256 jobId;
        uint256 amount;
        string  status;
        uint256 createdAt;
    }

    mapping(uint256 => Agreement) public agreements;
    mapping(uint256 => uint256)   public jobToToken;

    event AgreementMinted(uint256 indexed tokenId, uint256 indexed jobId, address indexed client, address indexed freelancer);
    event AgreementStatusUpdated(uint256 indexed tokenId, string newStatus);

    constructor(address initialOwner)
        Ownable(initialOwner)
        ERC721("QuaiWork Agreement", "QWA") {}

    function mintAgreement(
        address client, address freelancer,
        uint256 jobId, uint256 amount, string memory tokenURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIds;
        _safeMint(freelancer, tokenId);
        _setTokenURI(tokenId, tokenURI);
        agreements[tokenId] = Agreement(client, freelancer, jobId, amount, "active", block.timestamp);
        jobToToken[jobId] = tokenId;
        tokenIds++;
        emit AgreementMinted(tokenId, jobId, client, freelancer);
        return tokenId;
    }

    function updateStatus(uint256 jobId, string memory newStatus) external onlyOwner {
        uint256 tokenId = jobToToken[jobId];
        agreements[tokenId].status = newStatus;
        emit AgreementStatusUpdated(tokenId, newStatus);
    }

    function getAgreement(uint256 tokenId) external view returns (Agreement memory) {
        return agreements[tokenId];
    }
}
