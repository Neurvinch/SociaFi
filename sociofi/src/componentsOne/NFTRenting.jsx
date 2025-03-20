import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { NFtRentingAddress } from '../utils/NFTRenting';
import ABI from '../abi/NFTRenting.json';
import { sepolia } from 'viem/chains';

const NftMintingnRenting = () => {
    const { address } = useAccount();
    const { writeContractAsync, isPending: isWritePending } = useWriteContract();

    // Mint state
    const [mintTokenId, setMintTokenId] = useState("");
    const [descriptions, setDescriptions] = useState("");
    const [rentalPricePerSecond, setRentalPricePerSecond] = useState("");
    const [mintTxHash, setMintTxHash] = useState("");

    // Rent state
    const [rentTokenId, setRentTokenId] = useState("");
    const [duration, setDuration] = useState("");
    const [rentTxHash, setRentTxHash] = useState("");

    // Calculate rental fee
    const dummyFeePerSecond = "0.00000001";
    const computedRentalFee = duration ? ethers.parseUnits((parseFloat(dummyFeePerSecond) * Number(duration)).toFixed(18), 18) : "0";

    // Transaction receipts
    const { isLoading: mintLoading, isSuccess: mintSuccess } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });

    const { isLoading: rentLoading, isSuccess: rentSuccess } = useWaitForTransactionReceipt({
        hash: rentTxHash,
    });

    const handleMint = async () => {
        console.log("Minting with values:", { mintTokenId, descriptions, rentalPricePerSecond });
        try {
            const hash = await writeContractAsync({
                address: NFtRentingAddress || "0x3328358128832A260C76A4141e19E2A943CD4B6D",
                abi: ABI,
                functionName: "mintPost",
                args: [
                    address,
                    Number(mintTokenId),
                    descriptions,
                    Number(rentalPricePerSecond)
                ],
                chain: sepolia,
                account: address
            });
            
            setMintTxHash(hash);
        } catch (error) {
            console.error("Minting error:", error);
        }
    };

    const handleRent = async () => {
        console.log("Renting with values:", { rentTokenId, duration });
        try {
            const hash = await writeContractAsync({
                address: NFtRentingAddress || "0x3328358128832A260C76A4141e19E2A943CD4B6D",
                abi: ABI,
                functionName: "rentPost",
                args: [
                    Number(rentTokenId),
                    Number(duration)
                ],
                value: computedRentalFee, // Changed from overrides to value
                chain: sepolia,
                account: address
            });
            
            setRentTxHash(hash);
        } catch (error) {
            console.error("Renting error:", error);
        }
    };

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
                    <button 
                        onClick={handleMint} 
                        disabled={!address || mintLoading || isWritePending}
                    >
                        {mintLoading ? "Minting..." : "Mint Post NFT"}
                    </button>
                    {mintSuccess && (
                        <p style={{ color: "green" }}>
                            Mint successful! Transaction hash: {mintTxHash}
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
                        {duration && computedRentalFee !== "0" ? ethers.formatUnits(computedRentalFee) : "0"} ETH
                    </p>
                    <button 
                        onClick={handleRent} 
                        disabled={!address || rentLoading || isWritePending}
                    >
                        {rentLoading ? "Processing Rental..." : "Rent Post NFT"}
                    </button>
                    {rentSuccess && (
                        <p style={{ color: "green" }}>
                            Rental successful! Transaction hash: {rentTxHash}
                        </p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default NftMintingnRenting;