// SPDX-License-Identifier: GPL-3.0

// FOR TEST PURPOSES ONLY. NOT PRODUCTION SAFE
// Source: https://github.com/gnosis/canonical-weth/blob/0dd1ea3e295eef916d0c6223ec63141137d22d67/contracts/WETH9.sol
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("NounsTest", "NT") {
        _mint(msg.sender, initialSupply);
    }
}
