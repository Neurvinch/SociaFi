import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaWallet, 
  FaCheckCircle, 
  FaSpinner 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const StakeIt = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    if (!username) {
      toast.error("Please enter a username", {
        position: "top-right",
        theme: "colored"
      });
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS_STAKEIT, ABI, signer);

      const tx = await contract.createAccount(username, {
        value: ethers.parseUnits("1", "wei")
      });

      const receipt = await tx.wait();

      // Event parsing
      const iface = new ethers.Interface(ABI);
      receipt.logs.forEach((log) => {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog && parsedLog.name === "AccountCreated") {
            toast.success(`Account Created: ${username}`, {
              position: "top-right",
              theme: "colored"
            });
          }
        } catch (error) {
          console.error("Event parsing error", error);
        }
      });

      // Additional account verification
      const userAddress = await signer.getAddress();
      const userData = await contract.users(userAddress);

      if (userData.isActive) {
        // Store user data in local storage or context
        localStorage.setItem('userAccount', JSON.stringify({
          username: userData.username,
          address: userAddress
        }));
      }

    } catch (error) {
      toast.error(error.data?.message || error.message || "Account creation failed", {
        position: "top-right",
        theme: "colored"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-6">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
          >
            <FaWallet className="text-4xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">StakeIt Account</h1>
          <p className="text-gray-500 mt-2">Create your Web3 identity</p>
        </div>

        <div className="space-y-4">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              placeholder='Enter Your Username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createAccount}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="mr-2 animate-spin" />
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaCheckCircle className="mr-2" />
                Create Account
              </div>
            )}
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default StakeIt;