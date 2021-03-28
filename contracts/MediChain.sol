pragma solidity ^0.5.0;

import './Claim.sol';

// 1. Are we going to keep track of the policies?
//   - a. Yes, can do register policy to policyholder also (since we can also view medical records).
//        This also has added benefit of trust, since changes to policy will be tracked.
//   - b. No, we just do the claim approval/rejection part.
// 2. Should we have insurer staff accounts?
//   - I think we should, to keep track of who approve/reject which claim
// 3. Registration
//   - Company to register for policyholder/insurer
//   - NRIC to register policyholder
contract MediChain {
    address _owner = msg.sender; // Insurance Company

    struct Policyholder {
        uint256 policyholderDbId;
        Claim[] claims;
    }

    struct Insurer {
        uint256 insurerDbId;
        Claim[] approvedClaims;
        Claim[] rejectedClaims;
    }

    uint256 public numPolicyholders = 0;
    uint256 public numInsurers = 0;

    mapping(address => Policyholder) public policyholders;
    mapping(address => Insurer) public insurers;

    modifier contractOwnerOnly() {
        require(msg.sender == _owner, "Only MediChain owner can perform registration!");
        _;
    }

    function registerPolicyholder(address policyholder) public contractOwnerOnly {
        require(policyholders[policyholder].policyholderDbId == 0, "Policyholder has already been registered!");

        Policyholder memory newPolicyholder;
        newPolicyholder.policyholderDbId = ++numPolicyholders;

        policyholders[policyholder] = newPolicyholder;
    }

    function registerInsurer(address insurer) public contractOwnerOnly {
        require(insurers[insurer].insurerDbId == 0, "Insurer has already been registered!");

        Insurer memory newInsurer;
        newInsurer.insurerDbId = ++numInsurers;

        insurers[insurer] = newInsurer;
    }
}