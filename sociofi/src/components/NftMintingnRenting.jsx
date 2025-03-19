import React , {useState , useEffect} from 'react'
import {ethers} from 'ethers'
import { useAccount,useSimulateContract, useWaitForTransactionReceipt, useWriteContract} from 'wagmi'
import { NFtRentingAddress } from '../utils/NFTRenting'
import ABI from '../abi/NFTRenting.json'
const NftMintingnRenting = () => {
       const {address} = useAccount();

       const [mintTokenId, setMintTokenId] = useState("");
       const[descriptions , setDescriptions] = useState("");
       const [rentalPricePerSecond, setRentalPricePerSecond] = useState("");

       const {
         config : mintTokenIdData,
       } = useSimulateContract({
        address: NFtRentingAddress,
        abi : ABI,
        functionName : "mintPost",
        args : [
            address,
            Number(mintTokenId),
            descriptions,
            Number(rentalPricePerSecond)
        ],
        // enabled : Boolean(address) && mintTokenId !== "" && descriptions !== "" && rentalPricePerSecond !== "",

       })

       const {data : mintData , write : mintWrite } = useWriteContract(mintTokenIdData?.request ? mintTokenIdData : undefined);
        
       const {isLoading: mintLoading , isSuccess: mintSuccess} = useWaitForTransactionReceipt({
        hash: mintData?.hash,
       })

       const [rentTokenId , setRentTokenId] = useState("");
       const[duration , setDuration] = useState("");

       const dummyFeePerSecond = 0.00000001;
       const computedRentalFee = duration ?  ethers.parseUnits((parseFloat(dummyFeePerSecond) * Number(duration)).toString(),18) : "0"

       const {
        data  } = useSimulateContract({
         address: NFtRentingAddress,
         abi : ABI,
         functionName : "rentPost",
         args : [
             Number(rentTokenId),
             Number(duration)
         ],
         overrides : {
             value : computedRentalFee,
         },
         enabled : Boolean(address) && rentTokenId !== "" && duration !== "",
         })

         const {data : rentData} = useWriteContract(data);
        
         const {isLoading: rentLoading , isSuccess: rentSuccess} = useWaitForTransactionReceipt({
          hash: rentData?.hash,
         })

         

  return (
    <div className="App">
      <header className="App-header">
        <h1>NFT Renting & Minting Platform</h1>
        
      </header>
      <main>
        {/* Mint Post Section */}
        <section>
          <h2>Mint a Post NFT</h2>
          <input
            type="number"
            placeholder="Token ID"
            value={mintTokenId}
            onChange={(e) => setMintTokenId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rental Price per Second (in wei)"
            value={rentalPricePerSecond}
            onChange={(e) => setRentalPricePerSecond(e.target.value)}
          />
          <button onClick={() => mintWrite?.()} disabled={mintLoading}>
            {mintLoading ? "Minting..." : "Mint Post NFT"}
          </button>
          {mintSuccess && (
            <p style={{ color: "green" }}>
              Mint successful! Transaction hash: {mintData?.hash}
            </p>
          )}
        </section>

        <hr />

        {/* Rent Post Section */}
        <section>
          <h2>Rent a Post NFT</h2>
          <input
            type="number"
            placeholder="Token ID"
            value={rentTokenId}
            onChange={(e) => setRentTokenId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rental Duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <p>
            Rental Fee:{" "}
            {duration ? ethers.utils.formatEther(computedRentalFee) : "0"} ETH
          </p>
          <button onClick={() => rentWrite?.()} disabled={rentLoading}>
            {rentLoading ? "Processing Rental..." : "Rent Post NFT"}
          </button>
          {rentSuccess && (
            <p style={{ color: "green" }}>
              Rental successful! Transaction hash: {rentData?.hash}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default NftMintingnRenting