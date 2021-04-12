pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract MediChain {
    address _owner = msg.sender; // System Adminstrator

    enum ClaimStatus { PENDING, PROCESSED, APPROVED, REJECTED, DISBURSED }

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

    modifier policyholderOnly() {
        require(policyholders[msg.sender], "User is not a policyholder!");
        _;
    }

    modifier insurerOnly() {
        require(insurers[msg.sender], "User is not an insurer!");
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

    modifier processedClaim(ClaimStatus claimStatus) {
        require(claimStatus == ClaimStatus.PROCESSED, "The claim has not been processed or has already been endorsed!");
        _;
    }

    struct Claim {
        uint256 claimId;
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

    Claim[] private claims;

    uint256 private numPolicyholders;
    mapping(address => bool) private policyholders; 

    uint256 private numInsurers;
    mapping(address => bool) private insurers;

    // When registering a new account for Policyholder/Insurer, the platform owner will specify an address for the user (in private MediChain network)
    function registerPolicyholder(address policyholder) public contractOwnerOnly returns (uint256) {
        require(!policyholders[policyholder], "Policyholder has already been registered!");

        policyholders[policyholder] = true;
        emit userRegistration(policyholder);

        return numPolicyholders++;
    }

    function registerInsurer(address insurer) public contractOwnerOnly returns (uint256) {
        require(!insurers[insurer], "Insurer has already been registered!");

        insurers[insurer] = true;
        emit userRegistration(insurer);

        return numInsurers++;
    }

    function submitClaim(uint256 medicalAmount, uint256 claimDate, string memory token, string memory medicalRecordRefIds) public policyholderOnly returns (uint256) {
        for (uint256 claimId = 0; claimId < claims.length; claimId++) {
            string memory retrievedMedicalRecordRefIds = claims[claimId].medicalRecordRefIds;
            require(keccak256(abi.encodePacked(medicalRecordRefIds)) != keccak256(abi.encodePacked(retrievedMedicalRecordRefIds)), "Policyholder cannot submit a claim for the same medical records!");
        }
                
        Claim memory newClaim = Claim(
            claims.length,
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

    function approveClaim(uint256 claimId, string memory remarks) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) differentVerifier(claims[claimId].verifier) processedClaim(claims[claimId].claimStatus) {
        claims[claimId].claimStatus = ClaimStatus.APPROVED;
        endorseClaim(claimId, remarks);
    }

    function rejectClaim(uint256 claimId, string memory remarks) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) differentVerifier(claims[claimId].verifier) processedClaim(claims[claimId].claimStatus) {
        claims[claimId].claimStatus = ClaimStatus.REJECTED;
        endorseClaim(claimId, remarks);
    }

    function disburseClaim(uint256 claimId, string memory remarks) public validClaimId(claimId) insurerOnly differentInsurer(claims[claimId].claimant) differentVerifier(claims[claimId].verifier) {
        require(claims[claimId].claimStatus == ClaimStatus.APPROVED, "The claim has not been approved!");
        claims[claimId].claimStatus = ClaimStatus.DISBURSED;
        claims[claimId].remarks = remarks;
        emit claimUpdate(claimId, claims[claimId].claimStatus);
    }

    function endorseClaim(uint256 claimId, string memory remarks) private {
        claims[claimId].endorser = tx.origin;
        claims[claimId].remarks = remarks;
        emit claimUpdate(claimId, claims[claimId].claimStatus);    
    }

    // Filter claims at Node.js backend!
    function getClaims() public view returns(Claim[] memory claimRecords) {
        return claims;
    }

    function getClaim(uint256 claimId) public view returns(Claim memory claim) {
        require(insurers[msg.sender] || msg.sender == claims[claimId].claimant, "Only insurer or claimant can view the claim!");
        return claims[claimId];
    }
}
