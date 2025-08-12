// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract QualityOracle is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    enum QualityGrade { A, B, C, REJECTED }
    
    struct QualityReport {
        string lotId;
        QualityGrade grade;
        uint256 timestamp;
        address oracle;
        string ipfsHash; // Link to detailed report on IPFS
        bool isVerified;
        address verifier;
    }
    
    mapping(string => QualityReport) public qualityReports;
    mapping(address => uint256) public oracleReputationScore;
    mapping(string => bool) public lotExists;
    
    event QualityReported(string indexed lotId, QualityGrade grade, address oracle, string ipfsHash);
    event QualityVerified(string indexed lotId, address verifier);
    event OracleAdded(address oracle);
    event OracleRemoved(address oracle);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }
    
    function addOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ORACLE_ROLE, oracle);
        oracleReputationScore[oracle] = 100; // Starting reputation
        emit OracleAdded(oracle);
    }
    
    function removeOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ORACLE_ROLE, oracle);
        emit OracleRemoved(oracle);
    }
    
    function submitQualityReport(
        string memory lotId,
        QualityGrade grade,
        string memory ipfsHash
    ) external onlyRole(ORACLE_ROLE) {
        require(bytes(lotId).length > 0, "Lot ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(!lotExists[lotId], "Quality report already exists for this lot");
        
        qualityReports[lotId] = QualityReport({
            lotId: lotId,
            grade: grade,
            timestamp: block.timestamp,
            oracle: msg.sender,
            ipfsHash: ipfsHash,
            isVerified: false,
            verifier: address(0)
        });
        
        lotExists[lotId] = true;
        
        emit QualityReported(lotId, grade, msg.sender, ipfsHash);
    }
    
    function verifyQualityReport(string memory lotId) external onlyRole(AUDITOR_ROLE) {
        require(lotExists[lotId], "Quality report does not exist");
        require(!qualityReports[lotId].isVerified, "Report already verified");
        
        qualityReports[lotId].isVerified = true;
        qualityReports[lotId].verifier = msg.sender;
        
        // Increase oracle reputation for verified reports
        address oracle = qualityReports[lotId].oracle;
        oracleReputationScore[oracle] = oracleReputationScore[oracle] + 5;
        
        emit QualityVerified(lotId, msg.sender);
    }
    
    function getQualityReport(string memory lotId) external view returns (
        QualityGrade grade,
        uint256 timestamp,
        address oracle,
        string memory ipfsHash,
        bool isVerified,
        address verifier
    ) {
        require(lotExists[lotId], "Quality report does not exist");
        
        QualityReport memory report = qualityReports[lotId];
        return (
            report.grade,
            report.timestamp,
            report.oracle,
            report.ipfsHash,
            report.isVerified,
            report.verifier
        );
    }
    
    function isQualityAcceptable(string memory lotId, QualityGrade minimumGrade) external view returns (bool) {
        require(lotExists[lotId], "Quality report does not exist");
        require(qualityReports[lotId].isVerified, "Quality report not verified");
        
        return qualityReports[lotId].grade <= minimumGrade;
    }
    
    function updateOracleReputation(address oracle, int256 change) external onlyRole(AUDITOR_ROLE) {
        require(hasRole(ORACLE_ROLE, oracle), "Address is not an oracle");
        
        if (change > 0) {
            oracleReputationScore[oracle] += uint256(change);
        } else {
            uint256 decrease = uint256(-change);
            if (oracleReputationScore[oracle] > decrease) {
                oracleReputationScore[oracle] -= decrease;
            } else {
                oracleReputationScore[oracle] = 0;
            }
        }
    }
    
    function getOracleReputation(address oracle) external view returns (uint256) {
        return oracleReputationScore[oracle];
    }
}
