import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useEthersSigner } from '../hooks/useEthersSigner'
import {CONTRACT_ABI_STAKEIT,CONTRACT_ADDRESS_STAKEIT } from "../utils/stakeIt"

const StakeIt = () => {
    const signer = useEthersSigner();

    const [username , setUSername] = useState("");
    const [loading , setLoading] = useState(false);

    const createAccoount = async () => {

        if(!signer){
            alert("Say My Name Then Connect Your Wallet First");
            return;
        }

        if(!username) {
            alert("Please Enter Your Username");
            return;
        }

        try {
            setLoading(true);

            const contract = new ethers.Contract( CONTRACT_ADDRESS_STAKEIT, CONTRACT_ABI_STAKEIT, signer);

            const tx = await contract.createAccount(username,{value : ethers.parseUnits("1", "wei")});

            await tx.wait();
            // contract.on("AcoountCreated", (user , name , amount) => {
            //     console.log(user , name , amount);
            // })
            // console.log(tx);

            
            
        } catch (error) {
            
            console.log(error);
            alert("Something went wrong")
        } finally{
            setLoading(false);
        }
    }
    
  return (
    <div>
        <h2>Stake It</h2>

        <input
          placeholder='Enter Your Username'
          type='text'
          value={username}
          onChange={(e) => setUSername(e.target.value)}
        />

        <button
          onClick={createAccoount}
          disabled={loading}
        >
            {loading? "Creating Account..." : "Create Account"}
        </button>
    </div>
  )
}

export default StakeIt