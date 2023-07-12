"use client";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { useEffect, useRef, useState } from "react";
import { abi } from "./NftMinterDapp.json";
import { ethers } from "ethers";
import { supabase } from "../../supaBaseClient";
import Notiflix from "notiflix";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const Mint = () => {
  // Router
  const router = useRouter();

  // Refs
  const hiddenFileInput = useRef(null);

  // State variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageData, setImageData] = useState("");
  const [metaData, setMetaData] = useState([]);
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

  // Mint NFT
  const mintNFT = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsMintLoading(true);

    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const transaction = await contract.mint({
          value: ethers.parseEther("0.01"),
        });
        const result = await transaction.wait();
        console.log("Transaction:", transaction);
        console.log("Result:", result);
        Notiflix.Notify.success("NFT minted successfully!");

        await handleSavePersistentStorage();

        setIsMintLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsMintLoading(false);
      Notiflix.Report.failure(`NFT failed to mint!`, `${error}`);
    }
  };

  // Save Data to Database
  const handleSavePersistentStorage = async () => {
    const data = {
      name: name,
      meta: metaData,
      address: walletAddress,
      data: imageData,
    };

    let result = await supabase.from("nft").insert(data, { upsert: true });

    if (result.status === 201) {
      Notiflix.Notify.success("NFT saved to database!");
    } else {
      Notiflix.Notify.failure("NFT failed to save to database!");
    }
  };

  // Handle uploaded file
  const handleFileChange = async (event) => {
    const fileUploaded = event.target.files[0];
    if (!isFileValid(fileUploaded)) {
      return;
    } else {
      convertBase64(fileUploaded).then((hashedImageData) => {
        setImageData(hashedImageData);
      });
    }
  };

  // check if file is valid
  const isFileValid = (fileUploaded) => {
    let result = false;

    if (!fileUploaded) {
      return false;
    }

    if (fileUploaded["type"].split("/")[0] !== "image") {
      Notiflix.Notify.failure("File must be an image!");
      return false;
    }

    if (fileUploaded?.size > 1024 * 1024 * 1) {
      Notiflix.Notify.failure(
        "Maximum file size exceeded. You can only add files up to 1 MB in size!"
      );
      return false;
    }

    const fileUrl = URL.createObjectURL(fileUploaded);
    let image = new Image();
    image.src = fileUrl;
    image.onload = function () {
      setImage(fileUrl);
    };
    result = true;
    return result;
  };

  // convert file to base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // check if form is valid to submit
  const isFormValid = () => {
    let result = false;
    if (name?.length === 0) {
      Notiflix.Notify.failure("Name is required!");
      return false;
    }
    if (imageData?.length === 0) {
      Notiflix.Notify.failure("Image is required!");
      return false;
    }
    // if (price?.length === 0) {
    //   Notiflix.Notify.failure("Price is required!");
    //   return false;
    // }
    result = true;
    return result;
  };

  // Await render until isLoaded is true
  if (!isLoaded) return;

  return (
    <main className={styles.maincenter}>
      <div
        className={styles.description}
        style={{ cursor: "pointer" }}
        onClick={() => {
          router.push("/");
        }}
      >
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.row}>
                <p>Upload</p>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <input
                  type="button"
                  className={styles.uploadButton}
                  value={"Select File"}
                  onClick={() => {
                    hiddenFileInput.current.click();
                  }}
                />
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
                  <img
                    src={
                      image?.length > 0
                        ? image
                        : "https://via.placeholder.com/300x300"
                    }
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
                  value={0.01}
                  disabled={true}
                  placeholder="Amount"
                  className={styles.input}
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
          {isMintLoading ? (
            <h2>Minting...</h2>
          ) : (
            <button
              className={styles.buttonWallet}
              style={{ padding: "15px 50px" }}
              onClick={() => {
                mintNFT();
              }}
            >
              <h2>Mint!</h2>
            </button>
          )}
        </>
      ) : null}

      <div className={styles.grid}></div>
    </main>
  );
};

export default Mint;
