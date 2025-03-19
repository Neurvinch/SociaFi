import React , {useState} from 'react'
import { useAccount , useSimulateContract , useWaitForTransactionReceipt , useWriteContract
 } from 'wagmi'
 import { eventRegistrationContractAddress } from '../utils/EventRegister';
 import ABI  from "../abi/eventregistration.json"
import { sepolia } from 'viem/chains';

const EventRegistration = () => {
    const {address} = useAccount();
    const[username , setUSername] = useState("");
    const {WriteContractAsync} = useWriteContract();

    // const {config : registerConfig} = useSimulateContract({
    //     address : eventRegistrationContractAddress,
    //     abi : ABI,
    //     functionName : "registerUser" ,
    //     args : [username],
    //     enabled : Boolean(address) && username !== ""
    // });

    // const {data : registerData , write : registerWrite} = useWriteContract(registerConfig);

    // const {isLoading: registerLoading , isSuccess : registerSuccess} = useWaitForTransactionReceipt({
    //     hash : registerData?.hash
    // });
       
      
    const [eventName, setEventName] = useState("");
    const[eventDescription , setEventDescription] = useState("");
    const [entryFee , setEntryFee] = useState("");
    const [isPublic , setIsPublic] = useState(true);
    const[startTime , setStartTime] = useState(0);
    const [endTime , setEndTime] = useState(0);

    const {config : createEventConfig} = useSimulateContract({
        address : eventRegistrationContractAddress,
        abi : ABI,
        functionName : "createEvent" ,
        args : [eventName , eventDescription , entryFee , isPublic , startTime , endTime],
        enabled : Boolean(address) && eventName !== "" && eventDescription !== "" && entryFee !== "" && startTime !== "" && endTime !== ""
    });

    const {data : createEventData , write : createEventWrite} = useWriteContract(createEventConfig);

    const {isLoading: createEventLoading , isSuccess : createEventSuccess} = useWaitForTransactionReceipt({
        hash : createEventData?.hash
    });
    // console.log(hash)

    const handleCreateEvent =  async () => {

      try {
         const tx = await WriteContractAsync({
          address : "",
          abi :ABI,
          functionName : "createEvent" ,
          args: [eventName , eventDescription , entryFee , isPublic , startTime , endTime],
          chain: sepolia,
          account : address
         })
        
      } catch (error) {
        console.log(error);
        
      }
    }
     
    
     



    const [registerEventId , setRegisterEventId] = useState(0);

    const {config : registerEventConfig} = useSimulateContract({
        address : eventRegistrationContractAddress,
        abi : ABI,
        functionName : "registerForEvent" ,
        args : [registerEventId],
        enabled : Boolean(address) && registerEventId > 0
    });
     
         const {data : registerEventData , write : registerEventWrite} = useWriteContract(registerEventConfig);

         const {isLoading: registerEventLoading , isSuccess : registerEventSuccess} = useWaitForTransactionReceipt({
            hash : registerEventData?.hash
            });
            const handleRegisterToEvent = async () => {
              try {
                 const tx = await WriteContractAsync({
                  address : "",
                  abi: ABI,
                  functionName : "registerForEvent" ,
                  args :[registerEventId],
                  chain : sepolia,
                  account: address,

                 })

                
              } catch (error) {
                console.log(error)
              }
            }

            

            const [grantEventId , setGrantEventId] = useState(0);
            const[grantUsername, setGrantUsername] = useState("");

            const {config : grantConfig} = useSimulateContract({
                address : eventRegistrationContractAddress,
                abi : ABI,
                functionName : "grantAccess" ,
                args : [grantEventId , grantUsername],
                enabled : Boolean(address) && grantEventId > 0 && grantUsername !== ""
            });
            
            const {data : grantData , write : grantWrite} = useWriteContract(grantConfig);
            const {isLoading: grantLoading , isSuccess : grantSuccess} = useWaitForTransactionReceipt({
                hash : grantData?.hash
               
            } )
            // console.log(hash)
             
            const handleGrandAccess = async () => {
               try { 
                 const tx = await WriteContractAsync({
                  address : "",
                  abi : ABI,
                  functionName : "grantAccess" ,
                  args : [grantEventId , grantUsername],
                  chain: sepolia,
                  account : address
                 })
                
               } catch (error) {
                 console.log(error)
               }
            }

  return (
   <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Decentralized Event Management</h1>
    

      <hr style={{ margin: "2rem 0" }} />

      {/* User Registration Section */}
      <section>
        <h2>Register as a User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUSername(e.target.value)}
        />
        <button onClick={() => registerWrite?.()} disabled={registerLoading}>
          {registerLoading ? "Registering..." : "Register"}
        </button>
        {registerSuccess && (
          <p style={{ color: "green" }}>
            Registration successful! Tx hash: {registerData?.hash}
          </p>
        )}
      </section>

      <hr style={{ margin: "2rem 0" }} />

      {/* Create Event Section */}
      <section>
        <h2>Create an Event</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Event Description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Entry Fee (in wei)"
          value={entryFee}
          onChange={(e) => setEntryFee(Number(e.target.value))}
        />
        <label>
          Is Public?{" "}
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
        <input
          type="number"
          placeholder="Start Time (Unix timestamp)"
          value={startTime}
          onChange={(e) => setStartTime(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="End Time (Unix timestamp)"
          value={endTime}
          onChange={(e) => setEndTime(Number(e.target.value))}
        />
        <button onClick={() => createEventWrite?.()} disabled={createEventLoading}>
          {createEventLoading ? "Creating Event..." : "Create Event"}
        </button>
        {createEventSuccess && (
          <p style={{ color: "green" }}>
            Event created! Tx hash: {createEventData?.hash}
          </p>
        )}
      </section>

      <hr style={{ margin: "2rem 0" }} />

      {/* Register for Event Section */}
      <section>
        <h2>Register for an Event</h2>
        <input
          type="number"
          placeholder="Event ID"
          value={registerEventId}
          onChange={(e) => setRegisterEventId(Number(e.target.value))}
        />
        <button onClick={() => registerWrite?.()} disabled={registerLoading}>
          {registerLoading ? "Registering..." : "Register for Event"}
        </button>
        {registerSuccess && (
          <p style={{ color: "green" }}>
            Registered! Tx hash: {registerData?.hash}
          </p>
        )}
      </section>

      <hr style={{ margin: "2rem 0" }} />

      {/* Grant Access Section */}
      <section>
        <h2>Grant Access to Private Event</h2>
        <input
          type="number"
          placeholder="Event ID"
          value={grantEventId}
          onChange={(e) => setGrantEventId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Username to Grant Access"
          value={grantUsername}
          onChange={(e) => setUSername(e.target.value)}
        />
        <button onClick={() => grantAccessWrite?.()} disabled={grantLoading}>
          {grantLoading ? "Granting Access..." : "Grant Access"}
        </button>
        {grantSuccess && (
          <p style={{ color: "green" }}>
            Access granted! Tx hash: {grantAccessData?.hash}
          </p>
        )}
      </section>
    </div>
  )
}

export default EventRegistration