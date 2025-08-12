// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IAgriCreditToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract InvoiceFactoring is ReentrancyGuard, Ownable {
    enum InvoiceStatus { Created, Tokenized, Factored, Paid, Defaulted }
    
    struct Invoice {
        uint256 id;
        string lotId;
        address farmer;
        address offtaker;
        uint256 amount;
        uint256 dueDate;
        InvoiceStatus status;
        uint256 createdAt;
        string ipfsHash;
        uint256 qualityGrade;
        uint256 agriCreditAmount;
        address currentHolder;
    }
    
    struct FactoringOffer {
        uint256 invoiceId;
        address lender;
        uint256 advanceRate; // Percentage in basis points (e.g., 8000 = 80%)
        uint256 interestRate; // Annual interest rate in basis points
        uint256 offerExpiry;
        bool isActive;
    }
    
    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => FactoringOffer[]) public factoringOffers;
    mapping(string => uint256) public lotToInvoice;
    
    uint256 public nextInvoiceId = 1;
    IAgriCreditToken public agriCreditToken;
    
    event InvoiceCreated(uint256 indexed invoiceId, string lotId, address farmer, uint256 amount);
    event InvoiceTokenized(uint256 indexed invoiceId, uint256 agriCreditAmount);
    event FactoringOfferMade(uint256 indexed invoiceId, address lender, uint256 advanceRate);
    event InvoiceFactored(uint256 indexed invoiceId, address lender, uint256 advanceAmount);
    event InvoicePaid(uint256 indexed invoiceId, uint256 amount);
    
    modifier onlyFarmer(uint256 invoiceId) {
        require(invoices[invoiceId].farmer == msg.sender, "Only farmer can call this");
        _;
    }
    
    modifier onlyOfftaker(uint256 invoiceId) {
        require(invoices[invoiceId].offtaker == msg.sender, "Only offtaker can call this");
        _;
    }
    
    constructor(address _agriCreditToken) {
        agriCreditToken = IAgriCreditToken(_agriCreditToken);
    }
    
    function createInvoice(
        string memory _lotId,
        address _offtaker,
        uint256 _amount,
        uint256 _dueDate,
        string memory _ipfsHash,
        uint256 _qualityGrade
    ) external returns (uint256) {
        require(_offtaker != address(0), "Invalid offtaker address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in future");
        require(lotToInvoice[_lotId] == 0, "Invoice already exists for this lot");
        
        uint256 invoiceId = nextInvoiceId++;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            lotId: _lotId,
            farmer: msg.sender,
            offtaker: _offtaker,
            amount: _amount,
            dueDate: _dueDate,
            status: InvoiceStatus.Created,
            createdAt: block.timestamp,
            ipfsHash: _ipfsHash,
            qualityGrade: _qualityGrade,
            agriCreditAmount: 0,
            currentHolder: msg.sender
        });
        
        lotToInvoice[_lotId] = invoiceId;
        
        emit InvoiceCreated(invoiceId, _lotId, msg.sender, _amount);
        return invoiceId;
    }
    
    function tokenizeInvoice(uint256 invoiceId) external onlyFarmer(invoiceId) {
        Invoice storage invoice = invoices[invoiceId];
        require(invoice.status == InvoiceStatus.Created, "Invoice not in created state");
        
        // Calculate AgriCredit amount based on quality grade and risk factors
        uint256 agriCreditAmount = _calculateAgriCreditAmount(invoice.amount, invoice.qualityGrade);
        
        // Mint AgriCredit tokens to farmer
        agriCreditToken.mint(msg.sender, agriCreditAmount);
        
        invoice.agriCreditAmount = agriCreditAmount;
        invoice.status = InvoiceStatus.Tokenized;
        
        emit InvoiceTokenized(invoiceId, agriCreditAmount);
    }
    
    function makeFactoringOffer(
        uint256 invoiceId,
        uint256 advanceRate,
        uint256 interestRate,
        uint256 offerExpiry
    ) external {
        require(invoices[invoiceId].status == InvoiceStatus.Tokenized, "Invoice not tokenized");
        require(advanceRate <= 9000, "Advance rate cannot exceed 90%");
        require(offerExpiry > block.timestamp, "Offer expiry must be in future");
        
        factoringOffers[invoiceId].push(FactoringOffer({
            invoiceId: invoiceId,
            lender: msg.sender,
            advanceRate: advanceRate,
            interestRate: interestRate,
            offerExpiry: offerExpiry,
            isActive: true
        }));
        
        emit FactoringOfferMade(invoiceId, msg.sender, advanceRate);
    }
    
    function acceptFactoringOffer(
        uint256 invoiceId,
        uint256 offerIndex
    ) external onlyFarmer(invoiceId) nonReentrant {
        Invoice storage invoice = invoices[invoiceId];
        require(invoice.status == InvoiceStatus.Tokenized, "Invoice not tokenized");
        
        FactoringOffer storage offer = factoringOffers[invoiceId][offerIndex];
        require(offer.isActive, "Offer not active");
        require(offer.offerExpiry > block.timestamp, "Offer expired");
        
        // Calculate advance amount
        uint256 advanceAmount = (invoice.amount * offer.advanceRate) / 10000;
        
        // Transfer USDC from lender to farmer
        IERC20(address(0x1234)).transferFrom(offer.lender, msg.sender, advanceAmount); // Placeholder USDC address
        
        // Transfer AgriCredit tokens from farmer to lender
        agriCreditToken.transfer(offer.lender, invoice.agriCreditAmount);
        
        invoice.status = InvoiceStatus.Factored;
        invoice.currentHolder = offer.lender;
        offer.isActive = false;
        
        emit InvoiceFactored(invoiceId, offer.lender, advanceAmount);
    }
    
    function payInvoice(uint256 invoiceId) external onlyOfftaker(invoiceId) nonReentrant {
        Invoice storage invoice = invoices[invoiceId];
        require(
            invoice.status == InvoiceStatus.Tokenized || invoice.status == InvoiceStatus.Factored,
            "Invoice not payable"
        );
        
        // Transfer payment from offtaker to current holder
        IERC20(address(0x1234)).transferFrom(msg.sender, invoice.currentHolder, invoice.amount); // Placeholder USDC
        
        // Burn AgriCredit tokens
        agriCreditToken.burn(invoice.agriCreditAmount);
        
        invoice.status = InvoiceStatus.Paid;
        
        emit InvoicePaid(invoiceId, invoice.amount);
    }
    
    function _calculateAgriCreditAmount(uint256 invoiceAmount, uint256 qualityGrade) internal pure returns (uint256) {
        // Base amount with quality adjustment
        uint256 baseAmount = invoiceAmount;
        
        // Quality grade affects token amount (higher grade = higher token value)
        if (qualityGrade >= 90) {
            return (baseAmount * 95) / 100; // 95% for premium quality
        } else if (qualityGrade >= 80) {
            return (baseAmount * 90) / 100; // 90% for good quality
        } else if (qualityGrade >= 70) {
            return (baseAmount * 85) / 100; // 85% for average quality
        } else {
            return (baseAmount * 75) / 100; // 75% for below average
        }
    }
    
    function getInvoiceDetails(uint256 invoiceId) external view returns (
        string memory lotId,
        address farmer,
        address offtaker,
        uint256 amount,
        InvoiceStatus status,
        uint256 agriCreditAmount,
        address currentHolder
    ) {
        Invoice storage invoice = invoices[invoiceId];
        return (
            invoice.lotId,
            invoice.farmer,
            invoice.offtaker,
            invoice.amount,
            invoice.status,
            invoice.agriCreditAmount,
            invoice.currentHolder
        );
    }
    
    function getFactoringOffers(uint256 invoiceId) external view returns (FactoringOffer[] memory) {
        return factoringOffers[invoiceId];
    }
}
