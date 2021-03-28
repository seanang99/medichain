pragma solidity ^0.5.0;

contract Claim {
    address _owner = msg.sender; // System Administrator

    enum ClaimStatus { PENDING, APPROVED, REJECTED }

    
    struct ClaimRecord {
        uint256 claimId;
        address claimant;
        uint256 claimAmount;
        ClaimStatus claimStatus;
        string remarks;
        address approver;
        address rejecter;
        string token;
        // date tokenExpiryDate;
        string medicalRecordRefId;
    }

    ClaimRecord[] public claimRecords;

    // To be done by policyholder
    function submitClaim(uint256 claimAmount, string memory medicalRecordRefId) public {
        ClaimRecord memory newClaimRecord = ClaimRecord(
            claimRecords.length + 1,
            msg.sender,
            claimAmount,
            ClaimStatus.PENDING,
            "",
            address(0),
            address(0),
            medicalRecordRefId
        );

        claimRecords.push(newClaimRecord);
    }

    // To be done by insurer
    function approveClaim(uint256 claimId, string memory remarks) public {
        require(claimId < claimRecords.length - 1, "Invalid claim record ID!");
        ClaimRecord memory claimRecord = claimRecords[claimId - 1];

        require(claimRecord.approver == address(0) && claimRecord.rejecter == address(0), "This claim record has already been processed!");
        claimRecord.remarks = remarks;
        claimRecord.approver = msg.sender;
        claimRecord.claimStatus = ClaimStatus.APPROVED;

    }
}