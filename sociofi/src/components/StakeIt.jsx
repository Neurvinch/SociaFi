import React, { useState } from 'react'
import { ethers } from 'ethers'
// import { useEthersSigner } from '../hooks/useEthersSigner'
import {CONTRACT_ABI_STAKEIT,CONTRACT_ADDRESS_STAKEIT } from "../utils/stakeIt";
import ABI from '../abi/stakeIt.json'
import { useSigner } from '../context/SignerContext';

const StakeIt = () => {
    const signer = useSigner()
    // const provider = signer.provider

    const [username , setUSername] = useState("");
    const [loading , setLoading] = useState(false);

    const createAccoount = async () => {

        // if(!signer){
        //     alert("Say My Name Then Connect Your Wallet First");
        //     return;
        // }

        if(!username) {
            alert("Please Enter Your Username");
            return;
        }

        try {
            setLoading(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            
            const signer = await provider.getSigner();

            const contract = new ethers.Contract( CONTRACT_ADDRESS_STAKEIT, ABI, signer);
console.log("val",ethers.parseUnits("1", "wei"));

            const tx = await contract.createAccount(username,{value : ethers.parseUnits("1", "wei")});

            const receipt = await tx.wait(); // Wait for the transaction to be mined
            // contract.on("AcoountCreated", (user , name , amount) => {
            //     console.log(user , name , amount);
            // })

            console.log("receipt" , receipt);
            
            console.log(tx);

            const iface = new ethers.Interface(ABI); // Create an interface to decode logs
            receipt.logs.forEach((log) => {
              try {
                const parsedLog = iface.parseLog(log);
                if (parsedLog && parsedLog.name === "AccountCreated") {
                  console.log("🎉 AccountCreated Event Found!");
                  console.log("🆔 User Address:", parsedLog.args[0]); // Example: Address
                  console.log("🔗 Account ID:", parsedLog.args[1]);   // Example: Account ID
                }
              } catch (error) {
                // Ignore logs that don't match
              }
            });
        



            contract.once("AcoountCreated",(user, username , amount) => {
                console.log("Event:" ,{user, username , amount : amount.toString() });

            })
            
            const code = await provider.getCode(CONTRACT_ADDRESS_STAKEIT);
            console.log("Contract code:", code);

             const userAddress = await signer.getAddress();
             console.log(userAddress);

             const userData = await contract.users(userAddress)
             console.log(userData);
                
             if (userData.isActive) {
                alert(`Account Created Successfully: ${userData.username}`);
            } else {
                alert("Account creation failed. Please try again.");
            }

            const network = await signer.provider.getNetwork();
            console.log("Connected Network:", network);

        } catch (error) {
            
            console.log(error);
            alert(error.data?.message || error.message||"Something went wrong")
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