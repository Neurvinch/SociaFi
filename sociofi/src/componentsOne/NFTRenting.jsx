
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Wallet, 
  Gem, 
  Clock, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { NFtRentingAddress } from '../utils/NFTRenting';
import ABI from '../abi/NFTRenting.json';
import { sepolia } from 'viem/chains';

const NftMintingnRenting = () => {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // State management (same as previous code)
    const [mintTokenId, setMintTokenId] = useState("");
    const [descriptions, setDescriptions] = useState("");
    const [rentalPricePerSecond, setRentalPricePerSecond] = useState("");
    const [mintTxHash, setMintTxHash] = useState("");
    const [rentTokenId, setRentTokenId] = useState("");
    const [duration, setDuration] = useState("");
    const [rentTxHash, setRentTxHash] = useState("");

    // Transaction hooks (same as previous code)
    const { isLoading: mintLoading, isSuccess: mintSuccess } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });

    const { isLoading: rentLoading, isSuccess: rentSuccess } = useWaitForTransactionReceipt({
        hash: rentTxHash,
    });

    // Calculation and handlers (same as previous code)
    const dummyFeePerSecond = "0.00000001";
    const computedRentalFee = duration 
        ? ethers.parseUnits((parseFloat(dummyFeePerSecond) * Number(duration)).toFixed(18), 18) 
        : "0";

        const handleMint = async () => {
            console.log("Minting with values:", { mintTokenId, descriptions, rentalPricePerSecond });
            try {
                const hash = await writeContractAsync({
                    address: NFtRentingAddress || "0x5ac26c00D09A88042e85Ddeea61d656D97139c40",
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
                    address: NFtRentingAddress || "0x5ac26c00D09A88042e85Ddeea61d656D97139c40",
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <Gem className="mr-3" /> NFT Renting Platform
                        </h1>
                        {address && (
                            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                                <Wallet className="mr-2 text-white" />
                                <span className="text-white text-sm">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Mint Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-700">
                            <Upload className="mr-3" /> Mint NFT Post
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">
                                    Token ID
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Token ID"
                                    value={mintTokenId}
                                    onChange={(e) => setMintTokenId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe your NFT"
                                    value={descriptions}
                                    onChange={(e) => setDescriptions(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 transition"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">
                                    Rental Price per Second
                                </label>
                                <input
                                    type="number"
                                    placeholder="Price in wei"
                                    value={rentalPricePerSecond}
                                    onChange={(e) => setRentalPricePerSecond(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 transition"
                                />
                            </div>

                            <button 
                                onClick={handleMint}
                                disabled={!address || mintLoading }
                                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center"
                            >
                                {mintLoading ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin mr-2">○</span> Minting...
                                    </span>
                                ) : (
                                    <>Mint NFT <ArrowRight className="ml-2" /></>
                                )}
                            </button>

                            {mintSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center">
                                    <CheckCircle2 className="mr-2" />
                                    Mint successful!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rent Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-700">
                            <Clock className="mr-3" /> Rent NFT Post
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">
                                    Token ID
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Token ID to Rent"
                                    value={rentTokenId}
                                    onChange={(e) => setRentTokenId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">
                                    Rental Duration
                                </label>
                                <input
                                    type="number"
                                    placeholder="Duration in seconds"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 transition"
                                />
                            </div>

                            <div className="bg-blue-100 border border-blue-200 p-3 rounded-xl flex items-center">
                                <Info className="mr-2 text-blue-600" />
                                <p className="text-sm text-blue-700">
                                    Rental Fee: {duration && computedRentalFee !== "0" 
                                        ? ethers.formatUnits(computedRentalFee) 
                                        : "0"} ETH
                                </p>
                            </div>

                            <button 
                                onClick={handleRent}
                                disabled={!address || rentLoading }
                                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
                            >
                                {rentLoading ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin mr-2">○</span> Renting...
                                    </span>
                                ) : (
                                    <>Rent NFT <ArrowRight className="ml-2" /></>
                                )}
                            </button>

                            {rentSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center">
                                    <CheckCircle2 className="mr-2" />
                                    Rental successful!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NftMintingnRenting;