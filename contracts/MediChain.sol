pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

// 1. Do not keep track of policy details
// 2. There will be insurer staff accounts (mainly used to keep track of who approve/reject claims)
// 3. Policyholder/Insurer accounts will be preloaded.
//    - May or may not do registration.
contract MediChain {
    address _owner = msg.sender; // System Adminstrator

    enum ClaimStatus {PENDING, PROCESSED, APPROVED, REJECTED}

    event userRegistration(address user);
    event claimUpdate(uint256 claimId, ClaimStatus claimStatus);

    modifier contractOwnerOnly() {
        require(msg.sender == _owner, "Only MediChain owner can perform registration!");
        _;
    }

    modifier validClaimId(uint256 claimId) {
        require(claimId < claims.length, "Invalid claim ID!");
        _;
    }

    modifier insurerOnly() {
        require(insurersMapping[msg.sender].insurerAddress != address(0), "User is not an insurer!");
        _;
    }

    modifier differentInsurer(address claimant) {
        require(msg.sender != claimant, "Insurer cannot update his/her own claim!");
        _;
    }

    modifier differentVerifier(address verifier) {
        require(msg.sender != verifier, "The claim cannot be endorsed by the same insurer!");
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
        address endorser; // 2nd insurer to approve/reject
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

    // When registering a new account for Policyholder/Insurer, the platform owner will specify an address for the user (in private MediChain network)
    function registerPolicyholder(address policyholder) public contractOwnerOnly returns (uint256) {
        require(policyholdersMapping[policyholder].policyholderAddress == address(0), "Policyholder has already been registered!");

        Policyholder memory newPolicyholder;
        newPolicyholder.policyholderAddress = policyholder;

        policyholders.push(newPolicyholder);
        policyholdersMapping[policyholder] = newPolicyholder;

        emit userRegistration(policyholder);

        return policyholders.length - 1;
    }

    function registerInsurer(address insurer) public contractOwnerOnly returns (uint256) {
        require(insurersMapping[insurer].insurerAddress == address(0), "Insurer has already been registered!");

        Insurer memory newInsurer;
        newInsurer.insurerAddress = insurer;

        insurers.push(newInsurer);
        insurersMapping[insurer] = newInsurer;

        emit userRegistration(insurer);

        return insurers.length - 1;
    }

    function submitClaim(uint256 medicalAmount, uint256 claimDate, string memory token, string memory medicalRecordRefIds) public returns (uint256) {
        require(policyholdersMapping[msg.sender].policyholderAddress != address(0), "Policyholder has not been registered yet!");

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
        policyholdersMapping[msg.sender].submittedClaims[claims.length - 1] = newClaim;
        // policyholders[policyholderId].submittedClaims[claims.length - 1] = newClaim;

        emit claimUpdate(claims.length - 1, newClaim.claimStatus);

        return claims.length - 1;
    }

    function processClaim(uint256 claimId, uint256 claimAmount, string memory remarks, string memory policyNumber) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) {
        require(claims[claimId].claimStatus == ClaimStatus.PENDING, "The claim has already been processed!");

        claims[claimId].claimAmount = claimAmount;
        claims[claimId].claimStatus = ClaimStatus.PROCESSED;
        claims[claimId].verifier = msg.sender;
        claims[claimId].remarks = remarks;
        claims[claimId].policyNumber = policyNumber;

        emit claimUpdate(claimId, claims[claimId].claimStatus);
    }

    function approveClaim(uint256 claimId, string memory remarks) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) differentVerifier(claims[claimId].verifier) {
        require(claims[claimId].claimStatus == ClaimStatus.PROCESSED, "The claim has not been processed or has already been endorsed!");

        claims[claimId].claimStatus = ClaimStatus.APPROVED;
        claims[claimId].endorser = msg.sender;
        claims[claimId].remarks = remarks;
        
        emit claimUpdate(claimId, claims[claimId].claimStatus);
    }

    function rejectClaim(uint256 claimId, string memory remarks) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) differentVerifier(claims[claimId].verifier) {
        require(claims[claimId].claimStatus == ClaimStatus.PROCESSED, "The claim has not been processed or has already been endorsed!");

        claims[claimId].claimStatus = ClaimStatus.REJECTED;
        claims[claimId].endorser = msg.sender;
        claims[claimId].remarks = remarks;
        
        emit claimUpdate(claimId, claims[claimId].claimStatus);    
    }

    function getClaimsByInsurer() public view insurerOnly returns(Claim[] memory claimRecords) {
        return claims;
    }

    // function getClaimsByPolicyholder() public view returns(mapping(uint256 => Claim) memory claimRecords) {
    //     require(policyholdersMapping[msg.sender].policyholderAddress != address(0), "Caller must be a policyholder!");
    //     // Claim[] memory claimRecords = new Claim[](numClaims);
    //     // for(uint256 i = 0; i < numClaims; i++) {
    //     //     claimRecords[i] = policyholdersMapping[msg.sender].submittedClaims[i];
    //     // }
    //     return policyholdersMapping[msg.sender].submittedClaims;
    // }

    function getClaim(uint256 claimId) public view returns(Claim memory claim) {
        require(insurersMapping[msg.sender].insurerAddress != address(0) || msg.sender == claims[claimId].claimant, "Only insurer or claimant can view the claim!");
        return claims[claimId];
    }
}
