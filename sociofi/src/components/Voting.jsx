import React, { useState } from 'react'
import { useAccount , useSimulateContract ,useWriteContract } from 'wagmi'

const Voting = () => {
    const { address } = useAccount();
    const[questions , setQuestions] = useState("");
    const[options, setOptions] = useState(["",""]);
    const[startTime , setStartTime] = useState("");
    const[endTIme , setEndTime] = useState("");
    const[pollId , setPollId] = useState("");
    const[selectedOptions , setSelectedOptions] = useState("");

     const {WriteContractAsync} = useWriteContract();
      
     const handleCreatePoll = async ()=>{
         try {
            const tx = await WriteContractAsync({
                 address : "",
                 abi : ABI,
                 functionName : "createPoll",
                 args:[questions, options , startTime , endTIme],
                 chain : sepolia,
                 account : address,

            })
            
         } catch (error) {
             console.log(error)
            
         }
     }

      const handleVote =  async () => {
        try {
            const tx = await WriteContractAsync({
                address : "",
                abi : ABI,
                functionName: "vote",
                args:[pollId , optionIndex],
                chain : sepolia,
                account : address
            })
            
        } catch (error) {
            console.log(error)
        }
      }
  return (
    <div>Voting</div>
  )
}

export default Voting