import React, { useState , useEffect } from 'react';
import { CalendarDays, Clock, Users, Ticket, Lock, Unlock, PlusCircle, UserPlus, ChevronRight } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import ABI from '../abi/eventregistration.json';
import { sepolia } from 'viem/chains';
import { ethers } from 'ethers';
import {getContract} from '../utils/EventRegister';
const EventRegistration = () => {
  // Simulated connected address
  const { address } = useAccount();
  const { writeContractAsync 
   } = useWriteContract();

  
  const [activeTab, setActiveTab] = useState('create');
  const [transactionStatus, setTransactionStatus] = useState({ loading: false, success: false, hash: '', error: '' });
  
  // Event creation state
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Event registration state
  const [registerEventId, setRegisterEventId] = useState("");
  
  // User registration state
  const [username, setUsername] = useState("");
  
  // Grant access state
  const [grantEventId, setGrantEventId] = useState("");
  const [grantUsername, setGrantUsername] = useState("");

  const resetStatus = () => {
    setTransactionStatus({ loading: false, success: false, hash: '', error: '' });
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventDescription || !entryFee || !startTime || !endTime) {
      setTransactionStatus({ ...transactionStatus, error: 'Please fill all required fields' });
      return;
    }
    
    setTransactionStatus({ ...transactionStatus, loading: true, error: '' });
    try {
      const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);
      
      // This would be replaced with your actual contract interaction
      const tx = await writeContractAsync({
        address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        abi: ABI,
        functionName: "createEvent",
        args: [eventName, eventDescription, entryFee, isPublic, startTimeUnix, endTimeUnix],
        chain: sepolia,
        account: address
      });
      
      setTransactionStatus({ loading: false, success: true, hash: tx, error: '' });
      
      // Reset form after successful creation
      setEventName("");
      setEventDescription("");
      setEntryFee("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error(error);
      setTransactionStatus({ loading: false, success: false, hash: '', error: 'Transaction failed. Check console for details.' });
    }
  };

  const handleRegisterToEvent = async () => {
    if (!registerEventId) {
      setTransactionStatus({ ...transactionStatus, error: 'Please enter an event ID' });
      return;
    }
    
    setTransactionStatus({ ...transactionStatus, loading: true, error: '' });
    try {
      const tx = await writeContractAsync({
        address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        abi: ABI,
        functionName: "registerForEvent",
        args: [registerEventId],
        chain: sepolia,
        account: address
      });
      
      setTransactionStatus({ loading: false, success: true, hash: tx, error: '' });
      setRegisterEventId("");
    } catch (error) {
      console.error(error);
      setTransactionStatus({ loading: false, success: false, hash: '', error: 'Registration failed. Check console for details.' });
    }
  };

  const handleRegisterUser = async () => {
    if (!username) {
      setTransactionStatus({ ...transactionStatus, error: 'Please enter a username' });
      return;
    }
    
    setTransactionStatus({ ...transactionStatus, loading: true, error: '' });
    try {
      const tx = await writeContractAsync({
        address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        abi: ABI,
        functionName: "registerUser",
        args: [username],
        chain: sepolia, 
          
        account: address,
      });
      
      setTransactionStatus({ loading: false, success: true, hash: tx, error: '' });
      setUsername("");
    } catch (error) {
      console.error(error);
      setTransactionStatus({ loading: false, success: false, hash: '', error: 'User registration failed. Check console for details.' });
    }
  };

  const handleGrantAccess = async () => {
    if (!grantEventId || !grantUsername) {
      setTransactionStatus({ ...transactionStatus, error: 'Please fill all required fields' });
      return;
    }
    
    setTransactionStatus({ ...transactionStatus, loading: true, error: '' });
    try {
      const tx = await writeContractAsync({
        address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        abi: ABI,
        functionName: "grantAccess",
        args: [grantEventId, grantUsername],
        chain: sepolia,
        account: address
      });
      
      setTransactionStatus({ loading: false, success: true, hash: tx, error: '' });
      setGrantEventId("");
      setGrantUsername("");
    } catch (error) {
      console.error(error);
      setTransactionStatus({ loading: false, success: false, hash: '', error: 'Grant access failed. Check console for details.' });
    }
  };

  const [events , setEvents] = useState([]);
  const fetchEvents = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getContract(provider);

    try {
      const eventList = await contract.getAllEvents();
      setEvents(eventList);
      console.log(eventList);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-white"></div>
          <div className="absolute bottom-10 left-1/2 w-30 h-30 rounded-full bg-white"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">SocialFi Events</h1>
          <p className="mt-3 text-lg opacity-90 font-light">Create and join events using tokens on the blockchain</p>
          <div className="mt-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm inline-block px-4 py-2 rounded-full shadow-sm">
            <span className="flex items-center text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Connected: {address ? address.substring(0, 6) + '...' + address.substring(address.length - 4) : 'Not connected'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button 
          onClick={() => { setActiveTab('create'); resetStatus(); }}
          className={`flex-1 py-5 font-medium flex items-center justify-center transition-all duration-200 ${activeTab === 'create' 
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <PlusCircle size={18} className="mr-2" />
          Create Event
        </button>
        <button 
          onClick={() => { setActiveTab('join'); resetStatus(); }}
          className={`flex-1 py-5 font-medium flex items-center justify-center transition-all duration-200 ${activeTab === 'join' 
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <Ticket size={18} className="mr-2" />
          Join Event
        </button>
        <button 
          onClick={() => { setActiveTab('user'); resetStatus(); }}
          className={`flex-1 py-5 font-medium flex items-center justify-center transition-all duration-200 ${activeTab === 'user' 
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <Users size={18} className="mr-2" />
          User Profile
        </button>
        <button 
          onClick={() => { setActiveTab('access'); resetStatus(); }}
          className={`flex-1 py-5 font-medium flex items-center justify-center transition-all duration-200 ${activeTab === 'access' 
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <UserPlus size={18} className="mr-2" />
          Grant Access
        </button>
      </div>

      {/* Transaction Status */}
      {transactionStatus.loading && (
        <div className="bg-blue-50 text-blue-700 p-4 flex items-center justify-center border-l-4 border-blue-500">
          <div className="animate-spin mr-3 h-5 w-5 border-2 border-blue-700 border-t-transparent rounded-full"></div>
          <span className="font-medium">Processing transaction...</span>
        </div>
      )}
      
      {transactionStatus.success && (
        <div className="bg-green-50 text-green-700 p-4 border-l-4 border-green-500 animate-fadeIn">
          <p className="font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transaction successful!
          </p>
          <p className="text-sm mt-1 ml-7 font-mono">{transactionStatus.hash}</p>
        </div>
      )}
      
      {transactionStatus.error && (
        <div className="bg-red-50 text-red-700 p-4 border-l-4 border-red-500 animate-fadeIn">
          <p className="font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Error:
          </p>
          <p className="text-sm mt-1 ml-7">{transactionStatus.error}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="p-8">
        {/* Create Event */}
        {activeTab === 'create' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <PlusCircle size={20} />
              </span>
              Create a New Event
            </h2>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Event Name</label>
                <input
                  type="text"
                  placeholder="Enter a catchy event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Event Description</label>
                <textarea
                  placeholder="Describe your event"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 bg-gray-50 focus:bg-white"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                    <div className="flex items-center">
                      <Ticket size={16} className="mr-2 text-blue-500" />
                      Entry Fee (in wei)
                    </div>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                
                <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center cursor-pointer w-full">
                    <div className="mr-3">
                      {isPublic ? 
                        <Unlock size={24} className="text-green-500" /> : 
                        <Lock size={24} className="text-orange-500" />
                      }
                    </div>
                    <div className="mr-auto">
                      <span className="font-medium text-gray-700">
                        {isPublic ? "Public Event" : "Private Event"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {isPublic ? "Anyone can join" : "Invitation only"}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${isPublic ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out shadow-md transform ${isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                    <div className="flex items-center">
                      <CalendarDays size={16} className="mr-2 text-blue-500" />
                      Start Date & Time
                    </div>
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      End Date & Time
                    </div>
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleCreateEvent}
                disabled={transactionStatus.loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 shadow-md"
              >
                {transactionStatus.loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Event...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Event
                    <ChevronRight size={18} className="ml-2" />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Join Event */}
        {activeTab === 'join' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <Ticket size={20} />
              </span>
              Join an Event
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
              <p className="text-gray-700">Enter the event ID to join an existing event. Public events are open to all, while private events require access to be granted by the event creator.</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Event ID</label>
                <input
                  type="number"
                  placeholder="Enter event ID number"
                  value={registerEventId}
                  onChange={(e) => setRegisterEventId(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                />
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleRegisterToEvent}
                  disabled={transactionStatus.loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 shadow-md"
                >
                  {transactionStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Joining Event...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Join Event
                      <ChevronRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* User Registration */}
        {activeTab === 'user' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <Users size={20} />
              </span>
              Register User Profile
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
              <p className="text-gray-700">Create your unique username to participate in events. Your username will be linked to your wallet address and used for event access control.</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Username</label>
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                />
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleRegisterUser}
                  disabled={transactionStatus.loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 shadow-md"
                >
                  {transactionStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Registering Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Register Profile
                      <ChevronRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Grant Access */}
        {activeTab === 'access' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                <UserPlus size={20} />
              </span>
              Grant Access to Private Event
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
              <p className="text-gray-700">As an event creator, you can grant specific users access to your private events. Enter the event ID and username to provide access.</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Event ID</label>
                <input
                  type="number"
                  placeholder="Enter private event ID"
                  value={grantEventId}
                  onChange={(e) => setGrantEventId(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">Username</label>
                <input
                  type="text"
                  placeholder="Username to grant access to"
                  value={grantUsername}
                  onChange={(e) => setGrantUsername(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleGrantAccess}
                  disabled={transactionStatus.loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transform hover:-translate-y-1 active:translate-y-0 shadow-md"
                >
                  {transactionStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Granting Access...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Grant Access
                      <ChevronRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
                <div>
      <button onClick={fetchEvents}>Load Events</button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.name} - {ethers.formatUnits(event.entryFee)} ETH</li>
        ))}
      </ul>
    </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;