pragma solidity ^0.5.0;

import './Claim.sol';

// 1. Do not keep track of policy details
// 2. There will be insurer staff accounts (mainly used to keep track of who approve/reject claims)
// 3. Policyholder/Insurer accounts will be preloaded.
//    - May or may not do registration.
contract MediChain {
    address _owner = msg.sender; // System Adminstrator

    struct Policyholder {
        address policyholderAddress;
        Claim[] claims;
    }

    struct Insurer {
        address insurerAddress;
        Claim[] verifiedClaims; // Claims that were processed and verified by this insurer
        Claim[] endorsedClaims; // Claims that were approved or rejected by this insurer
    }

    Policyholder[] public policyholders; // For off-chain database to easily retrieve policyholder details
    mapping(address => Policyholder) public policyholdersMapping; // To allow fast checking of the existence of policyholder
    
    Insurer[] public insurers;
    mapping(address => Insurer) public insurersMapping;

    modifier contractOwnerOnly() {
        require(msg.sender == _owner, "Only MediChain owner can perform registration!");
        _;
    }

    event registerUser(address user);

    function registerPolicyholder(address policyholder) public contractOwnerOnly {
        require(policyholdersMapping[policyholder].policyholderAddress == address(0), "Policyholder has already been registered!");

        Policyholder memory newPolicyholder;
        newPolicyholder.policyholderAddress = policyholder;

        policyholders.push(newPolicyholder);
        policyholdersMapping[policyholder] = newPolicyholder;

        emit registerUser(policyholder);
    }

    function registerInsurer(address insurer) public contractOwnerOnly {
        require(insurersMapping[insurer].insurerAddress == address(0), "Insurer has already been registered!");

        Insurer memory newInsurer;
        newInsurer.insurerAddress = insurer;

        insurers.push(newInsurer);
        insurersMapping[insurer] = newInsurer;

        emit registerUser(insurer);
    }
}