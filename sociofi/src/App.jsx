import { ConnectButton } from '@rainbow-me/rainbowkit'
import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import StakeIt from './componentsOne/StakeIt'

// import {HuddleClient, HuddleProvider} from "@huddle01/react"
import NftMintingnRenting from './componentsOne/NFTRenting'
import EventRegistration from './componentsOne/EventRegistration'
import Voting from './componentsOne/Voting'
import LiveShowAccess from './componentsOne/LiveShowAcess'
import Navbar from './componentsOne/Navbar'
import SocialFiHomepage from './componentsOne/Home'
// import Home from './api/client-sideInfo.jsx'
// import HomePage from './pages/HomePage'
 
// const huddleClient = new HuddleClient({
//   projectId : "pi_jsEqHjJhpSzWkhJi",
//   options:{
//     activeSpeakers : {
//       size : 12
//     }
//   }
// });

function App() {
  
  return (
    <>
    {/* // <HuddleProvider  client={huddleClient}> */}
    <BrowserRouter>
    {/* <Navbar/> */}
   
    <Routes>
      <Route path="/event"  element ={ <EventRegistration/>} />
      <Route path="/stake"  element ={  <StakeIt/>} />
      <Route path="/"  element ={<SocialFiHomepage/>} />
      
      <Route path="/posts"  element ={ <NftMintingnRenting/>} />
      <Route path="/voting"  element ={ <Voting/>} />
      <Route path="/liveshow"  element ={ <LiveShowAccess/>} />
   
    {/* <NftMintingnRenting/>
    <Voting/>
    <LiveShowAccess/> */}
    {/* <HomePage/> */}
    {/* <Home/> */}
    {/* // </HuddleProvider> */}
    </Routes>
    </BrowserRouter>
     {/* <ConnectButton/> */}
     </>
  )
}

export default App
