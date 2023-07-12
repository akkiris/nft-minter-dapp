// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMinterDapp is ERC721, Ownable {
    address public ownerAddress;
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    bool public isPublicMintEnabled;
    address payable public treasuryWallet;
    address payable public liquidityWallet;
    mapping(address => uint256) public walletMints;

    receive() external payable {}

    constructor() payable ERC721("NftMinterDapp", "NFTMD") {
        mintPrice = 0.01 ether;
        totalSupply = 0;
        maxSupply = 2 ** 256 - 1;
        isPublicMintEnabled = true;
        treasuryWallet = payable(0xB925775aba3209194Da897dd545d346FeE010a4E);
        liquidityWallet = payable(0x27ab9102b4EEDA76022fCCF284461bBA348a1f9C);
        ownerAddress = msg.sender;
    }

    function setIsPublicMintEnabled(
        bool _isPublicMintEnabled
    ) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function withDrawTreasury() external onlyOwner {
        require(treasuryWallet != payable(0x0), "Treasury wallet not set");
        (bool success, ) = treasuryWallet.call{value: address(this).balance}(
            ""
        );
        require(success, "withDrawTreasury failed");
    }

    function mint() external payable {
        require(isPublicMintEnabled, "Public mint is not enabled");
        require(totalSupply <= maxSupply, "Max supply reached");
        require(msg.value == mintPrice, "Incorrect price");
        require(walletMints[msg.sender] == 0, "Wallet mint limit reached");

        uint256 tokenId = totalSupply + 1;
        totalSupply++;

        // set isPublicMintEnabled to false when maxSupply is reached
        if (totalSupply == maxSupply) {
            isPublicMintEnabled = false;
        }

        // mint token
        _safeMint(msg.sender, tokenId);

        // increment walletMints
        walletMints[msg.sender]++;

        // transfer %6 to treasury wallet and %4 to liquidity wallet
        uint256 treasuryAmount = (msg.value * 6) / 100;
        uint256 liquidityAmount = (msg.value * 4) / 100;
        require(
            payable(treasuryWallet).send(treasuryAmount),
            "Treasury transfer failed"
        );
        require(
            payable(liquidityWallet).send(liquidityAmount),
            "Liquidity transfer failed"
        );
    }
}
