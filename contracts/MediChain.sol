pragma solidity ^0.5.0;

// 1. Do not keep track of policy details
// 2. There will be insurer staff accounts (mainly used to keep track of who approve/reject claims)
// 3. Policyholder/Insurer accounts will be preloaded.
//    - May or may not do registration.
contract MediChain {
    address _owner = msg.sender; // System Adminstrator

    enum ClaimStatus { PENDING, PROCESSED, APPROVED, REJECTED }
    
    event registerUser(address user);

    modifier contractOwnerOnly() {
        require(msg.sender == _owner, "Only MediChain owner can perform registration!");
        _;
    }

    struct Claim {
        uint256 claimDate;
        address claimant;
        uint256 medicalAmount;
        uint256 claimAmount;
        ClaimStatus claimStatus;
        string remarks;
        address verifier; // 1st insurer to verify and process
        address endorse; // 2nd insurer to approve/reject
        string policyNumber;
        string token;
        string medicalRecordRefIds; // Array not well supported, use ";" to delimit different Ids
    }

    struct Policyholder {
        address policyholderAddress;
        mapping(uint256 => Claim) submittedClaims;
    }

    struct Insurer {
        address insurerAddress;
        mapping(uint256 => Claim) verifiedClaims; // Claims that were processed and verified by this insurer
        mapping(uint256 => Claim) endorsedClaims; // Claims that were approved or rejected by this insurer
    }

    Claim[] private claims;

    Policyholder[] public policyholders; // For off-chain database to easily retrieve policyholder details
    mapping(address => Policyholder) private policyholdersMapping; // To allow fast checking of the existence of policyholder
    
    Insurer[] public insurers;
    mapping(address => Insurer) private insurersMapping;

    function registerPolicyholder(address policyholder) public contractOwnerOnly returns (uint256) {
        require(policyholdersMapping[policyholder].policyholderAddress == address(0), "Policyholder has already been registered!");

        Policyholder memory newPolicyholder;
        newPolicyholder.policyholderAddress = policyholder;

        policyholders.push(newPolicyholder);
        policyholdersMapping[policyholder] = newPolicyholder;

        emit registerUser(policyholder);

        return policyholders.length - 1;
    }

    function registerInsurer(address insurer) public contractOwnerOnly returns (uint256) {
        require(insurersMapping[insurer].insurerAddress == address(0), "Insurer has already been registered!");

        Insurer memory newInsurer;
        newInsurer.insurerAddress = insurer;

        insurers.push(newInsurer);
        insurersMapping[insurer] = newInsurer;

        emit registerUser(insurer);

        return insurers.length - 1;
    }

    function submitClaim(uint256 medicalAmount, uint256 claimDate, string memory token, string memory medicalRecordRefIds) public {
        Claim memory newClaim = Claim(
            claimDate,
            msg.sender,
            medicalAmount,
            medicalAmount, // Originally, claimAmount == medicalAmount (but subject to approval and changes)
            ClaimStatus.PENDING,
            "",
            address(0),
            address(0),
            "",
            token,
            medicalRecordRefIds
        );
        
        claims.push(newClaim);
    }

    // To be done by insurer
    // function approveClaim(uint256 claimId, string memory remarks) public {
    //     require(claimId < claimRecords.length - 1, "Invalid claim record ID!");
    //     ClaimRecord memory claimRecord = claimRecords[claimId - 1];

    //     require(claimRecord.approver == address(0) && claimRecord.rejecter == address(0), "This claim record has already been processed!");
    //     claimRecord.remarks = remarks;
    //     claimRecord.approver = msg.sender;
    //     claimRecord.claimStatus = ClaimStatus.APPROVED;

    // }
}




