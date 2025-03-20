import React, { useState } from 'react';
import { parseUnits } from 'ethers';
import { useAccount, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// You need to define your ABI somewhere
import ABI from '../abi/LiveAcess.json';

const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; // Replace with your actual contract address

const LiveShowAccess = () => {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const { writeContractAsync } = useWriteContract();
   
  const handleCreateShow = async () => {
    if (!title || !fee) {
      alert("Please enter both title and fee");
      return;
    }
    
    setIsLoading(true);
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "createLiveShow", // fixed typo
        args: [title, parseUnits(fee, "wei")],
        chain: sepolia,
        account: address
      });
      
      setTxHash(tx);
      setIsLoading(false);
      alert("Live show created successfully!");
      
      // Reset form
      setTitle("");
      setFee("");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Error creating live show");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Live Show</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Show Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter show title"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Fee (in wei)</label>
        <input
          type="text"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter fee amount"
        />
      </div>
      
      <button
        onClick={handleCreateShow}
        disabled={isLoading || !address}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isLoading ? "Creating..." : "Create Live Show"}
      </button>
      
      {txHash && (
        <div className="mt-4">
          <p className="text-green-600">Transaction submitted!</p>
          <p className="text-sm text-gray-500 break-all">{txHash}</p>
        </div>
      )}
    </div>
  );
};

export default LiveShowAccess;