import React from 'react'
 import ethers from 'ethers'    

import { useAccount , useWriteContract , useSimulateContract } from 'wagmi'
const LiveShowAcess = () => {
    const { address} = useAccount();
    const [ title , setTitle] = useState("");
    const [fee , setFee] = useState("");
 
   const { writeContractAsync} = useWriteContract();
   
   const handlecreateShow = async () =>{
    try {
        const tx = await writeContractAsync({
            address : "",
            abi : ABI,
            functionname : "createLiveShow",
            args: [title, ethers.parseUnits(fee, "wei")],
            chain : sepolia,
            account : address
        })

        
    } catch (error) {
        console.log(error)
    }
   }
  return (
    <div>LiveShowAcess</div>
  )
}

export default LiveShowAcess