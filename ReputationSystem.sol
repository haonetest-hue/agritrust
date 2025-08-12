// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationSystem is Ownable {
    enum StakeholderType { Farmer, Cooperative, Offtaker, Processor, Logistics }
    
    struct Stakeholder {
        address addr;
        StakeholderType stakeholderType;
        uint256 reputationScore;
        uint256 totalTransactions;
        uint256 successfulTransactions;
        uint256 joinedAt;
        bool isActive;
    }
    
    struct Transaction {
        uint256 id;
        address from;
        address to;
        string lotId;
        bool isSuccessful;
        uint256 timestamp;
        uint8 rating; // 1-5 stars
        string feedback;
    }
    
    mapping(address => Stakeholder) public stakeholders;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public stakeholderTransactions;
    
    uint256 public nextTransactionId = 1;
    uint256 public constant INITIAL_REPUTATION = 100;
    uint256 public constant MAX_REPUTATION = 1000;
    
    event StakeholderRegistered(address indexed stakeholder, StakeholderType stakeholderType);
    event TransactionRecorded(uint256 indexed transactionId, address from, address to, string lotId);
    event ReputationUpdated(address indexed stakeholder, uint256 newScore);
    
    function registerStakeholder(StakeholderType _type) external {
        require(stakeholders[msg.sender].addr == address(0), "Stakeholder already registered");
        
        stakeholders[msg.sender] = Stakeholder({
            addr: msg.sender,
            stakeholderType: _type,
            reputationScore: INITIAL_REPUTATION,
            totalTransactions: 0,
            successfulTransactions: 0,
            joinedAt: block.timestamp,
            isActive: true
        });
        
        emit StakeholderRegistered(msg.sender, _type);
    }
    
    function recordTransaction(
        address _from,
        address _to,
        string memory _lotId,
        bool _isSuccessful,
        uint8 _rating,
        string memory _feedback
    ) external onlyOwner {
        require(stakeholders[_from].isActive, "From stakeholder not active");
        require(stakeholders[_to].isActive, "To stakeholder not active");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        uint256 transactionId = nextTransactionId++;
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            from: _from,
            to: _to,
            lotId: _lotId,
            isSuccessful: _isSuccessful,
            timestamp: block.timestamp,
            rating: _rating,
            feedback: _feedback
        });
        
        stakeholderTransactions[_from].push(transactionId);
        stakeholderTransactions[_to].push(transactionId);
        
        // Update transaction counts
        stakeholders[_from].totalTransactions++;
        stakeholders[_to].totalTransactions++;
        
        if (_isSuccessful) {
            stakeholders[_from].successfulTransactions++;
            stakeholders[_to].successfulTransactions++;
        }
        
        // Update reputation scores
        _updateReputation(_from, _isSuccessful, _rating);
        _updateReputation(_to, _isSuccessful, _rating);
        
        emit TransactionRecorded(transactionId, _from, _to, _lotId);
    }
    
    function _updateReputation(address stakeholder, bool isSuccessful, uint8 rating) internal {
        Stakeholder storage s = stakeholders[stakeholder];
        
        if (isSuccessful) {
            // Positive reputation change based on rating
            uint256 increase = rating * 2; // 2-10 points based on rating
            if (s.reputationScore + increase <= MAX_REPUTATION) {
                s.reputationScore += increase;
            } else {
                s.reputationScore = MAX_REPUTATION;
            }
        } else {
            // Negative reputation change
            uint256 decrease = (6 - rating) * 3; // 3-15 points decrease
            if (s.reputationScore > decrease) {
                s.reputationScore -= decrease;
            } else {
                s.reputationScore = 1; // Minimum reputation
            }
        }
        
        emit ReputationUpdated(stakeholder, s.reputationScore);
    }
    
    function getStakeholderReputation(address stakeholder) external view returns (
        uint256 reputationScore,
        uint256 totalTransactions,
        uint256 successfulTransactions,
        uint256 successRate
    ) {
        Stakeholder memory s = stakeholders[stakeholder];
        require(s.addr != address(0), "Stakeholder not found");
        
        uint256 rate = s.totalTransactions > 0 ? 
            (s.successfulTransactions * 100) / s.totalTransactions : 0;
        
        return (s.reputationScore, s.totalTransactions, s.successfulTransactions, rate);
    }
    
    function getStakeholderTransactions(address stakeholder) external view returns (uint256[] memory) {
        return stakeholderTransactions[stakeholder];
    }
    
    function isStakeholderTrusted(address stakeholder) external view returns (bool) {
        Stakeholder memory s = stakeholders[stakeholder];
        return s.isActive && s.reputationScore >= 80 && s.totalTransactions >= 5;
    }
    
    function deactivateStakeholder(address stakeholder) external onlyOwner {
        require(stakeholders[stakeholder].addr != address(0), "Stakeholder not found");
        stakeholders[stakeholder].isActive = false;
    }
    
    function reactivateStakeholder(address stakeholder) external onlyOwner {
        require(stakeholders[stakeholder].addr != address(0), "Stakeholder not found");
        stakeholders[stakeholder].isActive = true;
    }
}
