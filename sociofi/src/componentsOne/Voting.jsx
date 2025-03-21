import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'viem/chains';
import ABI from '../abi/Voting.json'; // Assuming you have an ABI file
// import ABI from '../abi/Voting.json'; // Assuming you have an ABI file

const VOTING_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with your contract address

const Voting = () => {
    const { address } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    
    // Create poll states
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [createPollTxHash, setCreatePollTxHash] = useState("");
    
    // Vote states
    const [pollId, setPollId] = useState("");
    const [selectedOption, setSelectedOption] = useState("0");
    const [voteTxHash, setVoteTxHash] = useState("");
    
    // Transaction tracking
    const { isLoading: isCreatePollLoading, isSuccess: isCreatePollSuccess } = 
        useWaitForTransactionReceipt({ hash: createPollTxHash });
    
    const { isLoading: isVoteLoading, isSuccess: isVoteSuccess } = 
        useWaitForTransactionReceipt({ hash: voteTxHash });
    
    // Handle adding/removing options
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    
    const addOption = () => {
        setOptions([...options, ""]);
    };
    
    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = [...options];
            newOptions.splice(index, 1);
            setOptions(newOptions);
        }
    };
    
    // Convert string date to unix timestamp
    const dateToTimestamp = (dateString) => {
        return Math.floor(new Date(dateString).getTime() / 1000);
    };
    
    /**
     * Create a poll and save it on the blockchain
     */
    const handleCreatePoll = async () => {
        if (!question || options.some(opt => !opt) || !startTime || !endTime) {
            alert("Please fill all fields");
            return;
        }
        
        try {
            const startTimestamp = dateToTimestamp(startTime);
            const endTimestamp = dateToTimestamp(endTime);
            
            const hash = await writeContractAsync({
                address: VOTING_CONTRACT_ADDRESS,
                abi: ABI,
                functionName: "createPoll",
                args: [question, options, startTimestamp, endTimestamp],
                chain: sepolia,
                account: address,
            });
            
            setCreatePollTxHash(hash);
        } catch (error) {
            console.error("Error creating poll:", error);
        }
    };
    
    /**
     * Vote on an existing poll
     */
    const handleVote = async () => {
        if (!pollId) {
            alert("Please enter a poll ID");
            return;
        }
        
        try {
            const hash = await writeContractAsync({
                address: VOTING_CONTRACT_ADDRESS,
                abi: ABI,
                functionName: "vote",
                args: [pollId, parseInt(selectedOption)],
                chain: sepolia,
                account: address,
            });
            
            setVoteTxHash(hash);
        } catch (error) {
            console.error("Error voting:", error);
        }
    };
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Blockchain Voting System</h1>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
                
                <div className="mb-4">
                    <label className="block mb-2">Question</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter your question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block mb-2">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                className="flex-grow p-2 border rounded"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            {options.length > 2 && (
                                <button
                                    className="ml-2 bg-red-500 text-white px-3 rounded"
                                    onClick={() => removeOption(index)}
                                >
                                    -
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={addOption}
                    >
                        Add Option
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 border rounded"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 border rounded"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
                
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleCreatePoll}
                    disabled={!address || isPending || isCreatePollLoading}
                >
                    {isCreatePollLoading ? "Creating Poll..." : "Create Poll"}
                </button>
                
                {isCreatePollSuccess && (
                    <p className="mt-2 text-green-600">
                        Poll created successfully! Transaction: {createPollTxHash}
                    </p>
                )}
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vote on Poll</h2>
                
                <div className="mb-4">
                    <label className="block mb-2">Poll ID</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter poll ID"
                        value={pollId}
                        onChange={(e) => setPollId(e.target.value)}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block mb-2">Select Option</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        {[0, 1, 2, 3, 4].map((index) => (
                            <option key={index} value={index}>
                                Option {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleVote}
                    disabled={!address || isPending || isVoteLoading}
                >
                    {isVoteLoading ? "Voting..." : "Submit Vote"}
                </button>
                
                {isVoteSuccess && (
                    <p className="mt-2 text-green-600">
                        Vote submitted successfully! Transaction: {voteTxHash}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Voting;