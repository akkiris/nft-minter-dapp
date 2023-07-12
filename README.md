## Nft Minter DApp

This project is developed by [Ali Kaan Kiris](mailto://kaan.kiris@softtech.com.tr) for the [Softtech-Akademi Solidity Development Program](https://akademi.softtech.com.tr/softtech/eep/main/activity/10473) as use case purpose.

---

This is a DApp for minting NFTs on the Ethereum blockchain. It uses;

[Next.js](https://nextjs.org/) for the frontend.

[notiflix](https://www.npmjs.com/package/notiflix) for the notifications.

[supabase](https://supabase.io) for the database.

[ethers](https://www.npmjs.com/package/ethers) for the Ethereum wallet.

[openzeppelin/contracts](https://www.npmjs.com/package/@openzeppelin/contracts) for the NFT contract.

[Solidity](https://soliditylang.org/) for contract development.

[hardhat](https://hardhat.org/) for contract testing and deployment.

[sepolia-testnet](https://sepolia.dev/) for the testnet.

[infura](https://infura.io/) for the testnet node.

[MetaMask](https://metamask.io/) for the wallet.

[etherscan](https://etherscan.io/) for the testnet explorer.

## Getting Started

You can skip steps (3, 4, 5) if you have already have exist `.env` file. Do not forget keys might be expired.

**1. First, move to the project directory:**

```bash
cd nft-minter-dapp
```

**2. Install dependencies:**

- you have to install [Node.js](https://nodejs.org/en/) first.
- then run the following command:

```bash
npm install
```

**3. Create a `.env` file (whether not exists) in the root directory of the project and add the following variables:**

```bash
NEXT_PUBLIC_RPC_URL=''
NEXT_PUBLIC_ETHERSCAN_KEY=''
NEXT_PUBLIC_PRIVATE_KEY=''
NEXT_PUBLIC_CONTRACT_ADDRESS=''
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS=''
NEXT_PUBLIC_LIQUIDITY_CONTRACT_ADDRESS=''
NEXT_PUBLIC_SUPABASE_URL=''
NEXT_PUBLIC_SUPABASE_ANON_KEY=''
```

**4. Register your own account to related apps and get your own keys:**

- NEXT_PUBLIC_RPC_URL register infura [here](https://infura.io/).
- NEXT_PUBLIC_ETHERSCAN_KEY register etherscan [here](https://etherscan.io/).
- NEXT_PUBLIC_PRIVATE_KEY install metamask, create an account and set private key [here](https://metamask.io/).
- NEXT_PUBLIC_CONTRACT_ADDRESS your main contract address.
- NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS your treasury contract address %6 of the minted NFTs will be sent to this address.
- NEXT_PUBLIC_LIQUIDITY_CONTRACT_ADDRESS your liquidity contract address %4 of the minted NFTs will be sent to this address.
- NEXT_PUBLIC_SUPABASE_URL register supabase [here](https://supabase.io/).
- NEXT_PUBLIC_SUPABASE_ANON_KEY your supabase anon key.

**5. Create nft table in supabase:**

- Create a table named `nft` in supabase and add the following columns:
  - `data` type: `jsonb`
  - `name` type: `text`
  - `address` type: `text`
  - `meta` type: `json`

**6. Change NftMinterDapp.sol Contract Addresses in the `contracts` directory.**

- Change treasuryWallet with your own address inside constructor.
- Change liquidityWallet with your own address inside constructor.

**7. Clean Compile Deploy Contracts with hardhat:**

- run the following commands whenever you change the contract:

```bash
npm run sol:clean
npm run sol:compile
```

- run the following command to deploy the contract to sepolia testnet:

```bash
npm run sol:deploy
```

**8. Run the app in the development mode:**

```bash
npm run dev
```

**9. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.**

## Pages

- main page: `app/page.js`

  - You you have to install MetaMask to use this page.
  - You can see random NFTs on this page.

- mint page: `app/mint/page.js`
  - You can mint NFTs on this page.
  - Give name and meta data list to your NFTs.
