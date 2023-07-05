"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useEffect, useState } from "react";

const Mint = () => {
  // Router
  const router = useRouter();

  // State variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [metaData, setMetaData] = useState([{ key: "", value: "" }]);
  const [price, setPrice] = useState(0);

  // Check if browser is compatible with Ethereum
  useEffect(() => {
    if (window.ethereum) {
      console.log("Ethereum successfully detected!");
      setIsBrowserCompatible(true);
      checkLocalStorage();
    } else {
      router.push("/");
    }
  }, []);

  // Check local storage for wallet address
  const checkLocalStorage = () => {
    const walletAddress = localStorage.getItem("nft_mint_dapp_walletAddress");

    if (walletAddress) {
      setWalletAddress(walletAddress);
      setIsWalletConnected(true);
    } else {
      router.push("/");
    }
    setIsLoaded(true);
  };

  const mintNFT = async () => {
    console.table("mintNFT_metadata:", metaData);
    console.table("mintNFT_price:", price);
  };

  // Await render until isLoaded is true
  if (!isLoaded) return;

  return (
    <main className={styles.maincenter}>
      <div className={styles.description}>
        <p>NFT Minter DApp</p>
      </div>

      <div className={styles.center}>
        <div className={styles.gridcenter}>
          <div className={styles.container}>
            <div className={styles.col2}>
              <div className={styles.row}>
                <h2>General Info</h2>
              </div>
              <div className={styles.row}>
                <p>Name</p>
                <input
                  type="text"
                  placeholder="Name"
                  className={styles.input}
                />
              </div>
              <div className={styles.row}>
                <p>Upload</p>
                <input type="file" />
                {/* <input type="text" placeholder="Upload" /> */}
              </div>
            </div>
            <div className={styles.col2}>
              <div
                className={styles.customCardContentRow}
                style={{ alignItems: "flex-end" }}
              >
                <div style={{ textAlign: "center" }}>
                  <h2>Preview</h2>
                  <Image
                    src="https://via.placeholder.com/300x300"
                    alt="Vercel Logo"
                    className={styles.vercelLogo}
                    width={300}
                    height={300}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.gridcenter}>
          <div className={styles.container}>
            <div className={styles.col4}>
              <div className={styles.row}>
                <h2>Meta Data</h2>
              </div>
              {metaData?.map((item, index) => {
                return (
                  <div className={styles.row} key={index}>
                    <input
                      type="text"
                      placeholder="Key"
                      className={styles.input}
                      value={item.key}
                      onChange={(e) => {
                        let tempMetaData = [...metaData];
                        tempMetaData[index].key = e.target.value;
                        setMetaData(tempMetaData);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className={styles.input}
                      value={item.value}
                      onChange={(e) => {
                        let tempMetaData = [...metaData];
                        tempMetaData[index].value = e.target.value;
                        setMetaData(tempMetaData);
                      }}
                    />
                    <input
                      type="button"
                      value="Remove"
                      className={styles.removeButton}
                      onClick={() => {
                        let tempMetaData = [...metaData];
                        tempMetaData.splice(index, 1);
                        setMetaData(tempMetaData);
                      }}
                    />
                  </div>
                );
              })}
              <div className={styles.row} style={{ justifyContent: "right" }}>
                <input
                  type="button"
                  value="Add"
                  className={styles.addButton}
                  onClick={() => {
                    setMetaData([...metaData, { key: "", value: "" }]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.gridcenter}>
          <div className={styles.container}>
            <div className={styles.col4}>
              <div className={styles.row}>
                <h2>Price</h2>
              </div>
              <div className={styles.row}>
                <p>Amount</p>
                <input
                  type="number"
                  max={1000000000000}
                  min={0}
                  placeholder="Amount"
                  className={styles.input}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value ?? 0);
                  }}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBrowserCompatible && isWalletConnected ? (
        <>
          <button
            className={styles.buttonWallet}
            style={{ padding: "15px 50px" }}
            onClick={() => {
              mintNFT();
            }}
          >
            <h2>Mint!</h2>
          </button>
        </>
      ) : null}

      <div className={styles.grid}></div>
    </main>
  );
};

export default Mint;
