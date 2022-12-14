/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
 */

const Helpers = require('../test/helpers');
const Utils = require('./utils');

const BridgeContract = artifacts.require("Bridge");
const PermissionlessGenericHandlerContract = artifacts.require("PermissionlessGenericHandler");
const FeeRouterContract = artifacts.require("FeeHandlerRouter");
const BasicFeeHandlerContract = artifacts.require("BasicFeeHandler");
const FeeHandlerWithOracleContract = artifacts.require("FeeHandlerWithOracle");

module.exports = async function(deployer, network) {
    const networksConfig = Utils.getNetworksConfig()
    // trim suffix from network name and fetch current network config
    let currentNetworkName = network.split("-")[0];
    let currentNetworkConfig = networksConfig[currentNetworkName];
    delete networksConfig[currentNetworkName]

    // fetch deployed contracts addresses
    const bridgeInstance = await BridgeContract.deployed();
    const feeRouterInstance = await FeeRouterContract.deployed();
    const basicFeeHandlerInstance = await BasicFeeHandlerContract.deployed();
    const feeHandlerWithOracleInstance = await FeeHandlerWithOracleContract.deployed();

    // deploy generic handler
    const permissionlessGenericHandlerInstance = await deployer.deploy(PermissionlessGenericHandlerContract, bridgeInstance.address);

    console.log("-------------------------------------------------------------------------------")
    console.log("Permissionless generic handler address:", "\t", permissionlessGenericHandlerInstance.address);
    console.log("Permissionless generic handler resourceID:", "\t", currentNetworkConfig.permissionlessGeneric.resourceID);
    console.log("-------------------------------------------------------------------------------")

    // setup permissionless generic handler
    if (currentNetworkConfig.permissionlessGeneric && currentNetworkConfig.permissionlessGeneric.resourceID) {
      const genericHandlerSetResourceData = Helpers.constructGenericHandlerSetResourceData(
        Helpers.blankFunctionSig,
        Helpers.blankFunctionDepositorOffset,
        Helpers.blankFunctionSig
      );
      await bridgeInstance.adminSetResource(permissionlessGenericHandlerInstance.address, currentNetworkConfig.permissionlessGeneric.resourceID, bridgeInstance.address, genericHandlerSetResourceData);
      await Utils.setupFee(networksConfig, feeRouterInstance, feeHandlerWithOracleInstance, basicFeeHandlerInstance, currentNetworkConfig.permissionlessGeneric);
    }
}
