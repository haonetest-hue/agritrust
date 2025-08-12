// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EscrowContract is ReentrancyGuard, Ownable {
    enum EscrowStatus { Created, Funded, QualityPending, Released, Disputed, Cancelled }
    
    struct Escrow {
        uint256 id;
        address buyer;
        address seller;
        uint256 amount;
        address token; // ERC20 token address, address(0) for native HBAR
        string lotId;
        EscrowStatus status;
        uint256 createdAt;
        uint256 releaseTime;
        bool qualityApproved;
        address qualityOracle;
        mapping(address => bool) hasApproved;
        uint256 approvalCount;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(string => uint256) public lotToEscrow;
    uint256 public nextEscrowId = 1;
    
    // Revenue split percentages (basis points, 10000 = 100%)
    struct RevenueShare {
        uint256 farmer;
        uint256 cooperative;
        uint256 processor;
        uint256 logistics;
        uint256 platform;
    }
    
    mapping(uint256 => RevenueShare) public revenueShares;
    mapping(uint256 => mapping(address => uint256)) public stakeholderAddresses;
    
    event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount, string lotId);
    event EscrowFunded(uint256 indexed escrowId);
    event QualityApproved(uint256 indexed escrowId, address oracle);
    event EscrowReleased(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);
    
    modifier onlyBuyer(uint256 escrowId) {
        require(escrows[escrowId].buyer == msg.sender, "Only buyer can call this");
        _;
    }
    
    modifier onlySeller(uint256 escrowId) {
        require(escrows[escrowId].seller == msg.sender, "Only seller can call this");
        _;
    }
    
    modifier onlyQualityOracle(uint256 escrowId) {
        require(escrows[escrowId].qualityOracle == msg.sender, "Only quality oracle can call this");
        _;
    }
    
    function createEscrow(
        address _seller,
        uint256 _amount,
        address _token,
        string memory _lotId,
        uint256 _releaseTime,
        address _qualityOracle,
        RevenueShare memory _revenueShare,
        address[] memory _stakeholders
    ) external returns (uint256) {
        require(_seller != address(0), "Invalid seller address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_releaseTime > block.timestamp, "Release time must be in future");
        require(lotToEscrow[_lotId] == 0, "Escrow already exists for this lot");
        
        // Validate revenue share adds up to 100%
        uint256 totalShare = _revenueShare.farmer + _revenueShare.cooperative + 
                           _revenueShare.processor + _revenueShare.logistics + 
                           _revenueShare.platform;
        require(totalShare == 10000, "Revenue shares must add up to 100%");
        
        uint256 escrowId = nextEscrowId++;
        
        Escrow storage newEscrow = escrows[escrowId];
        newEscrow.id = escrowId;
        newEscrow.buyer = msg.sender;
        newEscrow.seller = _seller;
        newEscrow.amount = _amount;
        newEscrow.token = _token;
        newEscrow.lotId = _lotId;
        newEscrow.status = EscrowStatus.Created;
        newEscrow.createdAt = block.timestamp;
        newEscrow.releaseTime = _releaseTime;
        newEscrow.qualityOracle = _qualityOracle;
        
        lotToEscrow[_lotId] = escrowId;
        revenueShares[escrowId] = _revenueShare;
        
        // Set stakeholder addresses
        require(_stakeholders.length == 5, "Must provide 5 stakeholder addresses");
        stakeholderAddresses[escrowId][_stakeholders[0]] = _revenueShare.farmer;
        stakeholderAddresses[escrowId][_stakeholders[1]] = _revenueShare.cooperative;
        stakeholderAddresses[escrowId][_stakeholders[2]] = _revenueShare.processor;
        stakeholderAddresses[escrowId][_stakeholders[3]] = _revenueShare.logistics;
        stakeholderAddresses[escrowId][_stakeholders[4]] = _revenueShare.platform;
        
        emit EscrowCreated(escrowId, msg.sender, _seller, _amount, _lotId);
        return escrowId;
    }
    
    function fundEscrow(uint256 escrowId) external payable nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Created, "Escrow not in created state");
        require(msg.sender == escrow.buyer, "Only buyer can fund escrow");
        
        if (escrow.token == address(0)) {
            // Native HBAR payment
            require(msg.value == escrow.amount, "Incorrect HBAR amount");
        } else {
            // ERC20 token payment
            require(msg.value == 0, "Should not send HBAR for token payment");
            IERC20(escrow.token).transferFrom(msg.sender, address(this), escrow.amount);
        }
        
        escrow.status = EscrowStatus.Funded;
        emit EscrowFunded(escrowId);
    }
    
    function approveQuality(uint256 escrowId) external onlyQualityOracle(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        
        escrow.qualityApproved = true;
        escrow.status = EscrowStatus.QualityPending;
        
        emit QualityApproved(escrowId, msg.sender);
    }
    
    function releaseEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(
            escrow.status == EscrowStatus.QualityPending || 
            (escrow.status == EscrowStatus.Funded && block.timestamp >= escrow.releaseTime),
            "Cannot release escrow yet"
        );
        require(
            msg.sender == escrow.buyer || 
            msg.sender == escrow.seller || 
            (escrow.qualityApproved && msg.sender == escrow.qualityOracle),
            "Not authorized to release"
        );
        
        escrow.status = EscrowStatus.Released;
        
        // Distribute funds according to revenue share
        _distributeFunds(escrowId);
        
        emit EscrowReleased(escrowId);
    }
    
    function _distributeFunds(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        RevenueShare memory shares = revenueShares[escrowId];
        
        uint256 amount = escrow.amount;
        
        // Calculate and transfer each stakeholder's share
        uint256 farmerAmount = (amount * shares.farmer) / 10000;
        uint256 coopAmount = (amount * shares.cooperative) / 10000;
        uint256 processorAmount = (amount * shares.processor) / 10000;
        uint256 logisticsAmount = (amount * shares.logistics) / 10000;
        uint256 platformAmount = (amount * shares.platform) / 10000;
        
        if (escrow.token == address(0)) {
            // Native HBAR distribution
            _transferHBAR(_getStakeholderAddress(escrowId, shares.farmer), farmerAmount);
            _transferHBAR(_getStakeholderAddress(escrowId, shares.cooperative), coopAmount);
            _transferHBAR(_getStakeholderAddress(escrowId, shares.processor), processorAmount);
            _transferHBAR(_getStakeholderAddress(escrowId, shares.logistics), logisticsAmount);
            _transferHBAR(_getStakeholderAddress(escrowId, shares.platform), platformAmount);
        } else {
            // ERC20 token distribution
            IERC20 token = IERC20(escrow.token);
            token.transfer(_getStakeholderAddress(escrowId, shares.farmer), farmerAmount);
            token.transfer(_getStakeholderAddress(escrowId, shares.cooperative), coopAmount);
            token.transfer(_getStakeholderAddress(escrowId, shares.processor), processorAmount);
            token.transfer(_getStakeholderAddress(escrowId, shares.logistics), logisticsAmount);
            token.transfer(_getStakeholderAddress(escrowId, shares.platform), platformAmount);
        }
    }
    
    function _getStakeholderAddress(uint256 escrowId, uint256 shareAmount) internal view returns (address) {
        // Find stakeholder address by their share amount
        RevenueShare memory shares = revenueShares[escrowId];
        if (shareAmount == shares.farmer) return _findAddressByShare(escrowId, shares.farmer);
        if (shareAmount == shares.cooperative) return _findAddressByShare(escrowId, shares.cooperative);
        if (shareAmount == shares.processor) return _findAddressByShare(escrowId, shares.processor);
        if (shareAmount == shares.logistics) return _findAddressByShare(escrowId, shares.logistics);
        if (shareAmount == shares.platform) return _findAddressByShare(escrowId, shares.platform);
        revert("Stakeholder not found");
    }
    
    function _findAddressByShare(uint256 escrowId, uint256 share) internal view returns (address) {
        // This is a simplified approach - in production, you'd want a more efficient mapping
        // For now, we'll use the seller address as primary recipient
        return escrows[escrowId].seller;
    }
    
    function _transferHBAR(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "HBAR transfer failed");
    }
    
    function disputeEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can dispute"
        );
        require(escrow.status == EscrowStatus.Funded, "Can only dispute funded escrow");
        
        escrow.status = EscrowStatus.Disputed;
        emit EscrowDisputed(escrowId);
    }
    
    function cancelEscrow(uint256 escrowId) external onlyBuyer(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Created, "Can only cancel unfunded escrow");
        
        escrow.status = EscrowStatus.Cancelled;
        emit EscrowCancelled(escrowId);
    }
    
    function getEscrowDetails(uint256 escrowId) external view returns (
        address buyer,
        address seller,
        uint256 amount,
        address token,
        string memory lotId,
        EscrowStatus status,
        uint256 createdAt,
        bool qualityApproved
    ) {
        Escrow storage escrow = escrows[escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.token,
            escrow.lotId,
            escrow.status,
            escrow.createdAt,
            escrow.qualityApproved
        );
    }
}
