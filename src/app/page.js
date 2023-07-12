"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../supaBaseClient";
import Notiflix from "notiflix";

export default function Home() {
  // Router
  const router = useRouter();

  // State variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [randomNft, setRandomNft] = useState([]);

  // Check if browser is compatible with Ethereum
  useEffect(() => {
    if (window.ethereum) {
      Notiflix.Notify.info("Wallet detected!");
      console.log("Ethereum successfully detected!");
      setIsBrowserCompatible(true);
      checkLocalStorage();
    } else {
      Notiflix.Notify.failure("Wallet not detected!");
      console.log("Ethereum not detected!");
      setIsBrowserCompatible(false);
      setIsLoaded(true);
    }
  }, []);

  // Get random 3 nft from supabase
  useEffect(() => {
    getRandomNFT();
  }, []);

  // Check local storage for wallet address
  const checkLocalStorage = () => {
    const walletAddress = localStorage.getItem("nft_mint_dapp_walletAddress");

    if (walletAddress) {
      setWalletAddress(walletAddress);
      setIsWalletConnected(true);
    }
    setIsLoaded(true);
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (isBrowserCompatible) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        localStorage.setItem("nft_mint_dapp_walletAddress", accounts[0]);
      } catch (error) {
        console.log(error);
        setIsWalletConnected(false);
        setWalletAddress("");
        localStorage.removeItem("nft_mint_dapp_walletAddress");
      }
    }
  };

  // Redirect to mint page if wallet is connected
  const redirectToMintPage = () => {
    if (isWalletConnected) {
      router.push("/mint");
    }
  };

  // Get random 3 nft from supabase
  const getRandomNFT = async () => {
    const { data, error } = await supabase
      .from("nft")
      .select("*")
      .order("id", { ascending: true })
      .limit(100);
    if (error) {
      console.log(error);
    } else {
      setRandomNft(data ?? []);
      console.log(data);
    }
  };

  // Await render until isLoaded is true
  if (!isLoaded) return;

  // Render
  return (
    <main className={styles.maincenter}>
      <div className={styles.description}>
        <p>NFT Minter DApp</p>
      </div>

      <div className={styles.center}>
        <div className={styles.gridcenter}>
          {!isBrowserCompatible ? (
            <div className={styles.descriptionerror}>
              <p>
                Please install an Ethereum-compatible browser or extension like
                MetaMask to use this dApp!
              </p>
            </div>
          ) : null}
          {isBrowserCompatible && !isWalletConnected ? (
            <button className={styles.buttonWallet} onClick={connectWallet}>
              <h2>Connect to your Wallet</h2>
            </button>
          ) : null}
          {isBrowserCompatible && isWalletConnected ? (
            <div
              className={styles.description}
              style={{ display: "flex", gap: "10px" }}
            >
              <p>
                Your Wallet Address:
                <code className={styles.code}>{walletAddress}</code>
              </p>
              {
                // add disconnect wallet button
                <button
                  className={styles.removeButton}
                  onClick={() => {
                    setIsWalletConnected(false);
                    setWalletAddress("");
                    localStorage.removeItem("nft_mint_dapp_walletAddress");
                  }}
                >
                  <h2>Disconnect Wallet</h2>
                </button>
              }
            </div>
          ) : null}
        </div>
      </div>
      {isBrowserCompatible && isWalletConnected ? (
        <>
          <button className={styles.buttonWallet} onClick={redirectToMintPage}>
            <h2>Goto Mint!</h2>
          </button>
        </>
      ) : null}

      <h2 style={{ padding: "20px 0" }}>Random NFTs</h2>

      <div className={styles.gallery}>
        {randomNft.map((nft) => (
          <div key={nft.id} className={styles.galleryItem}>
            <div>
              <img
                src={nft.data}
                alt="NFT"
                width={300}
                height={300}
                onClick={() => {
                  Notiflix.Report.info(`Meta Data`, JSON.stringify(nft.meta));
                }}
              />
              <div>
                <h3 className={styles.cardTitle}>{nft.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
