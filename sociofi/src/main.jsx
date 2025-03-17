import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { WagmiProvider } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { sepolia } from 'viem/chains'

const projectId = import.meta.env.VITE_PROJECT_ID

const CoreTestnet = {
  id: 1114,
  name: 'Core Blockchain Testnet',
  iconUrl: '/image.png',
  nativeCurrency: { name: 'Core testnet', symbol: 'tCORE2' , decimals: 18},
  rpcUrls: {
    default: { http: ['https://rpc.test2.btcs.network'] },
    public : { http: ['https://rpc.test2.btcs.network'] },
  },
  blockExplorers: {
    default: { url: 'https://scan.test2.btcs.network' },
  },
  testnet : true
} 

const config = getDefaultConfig({
  appName : "SocioFi",
  projectId: projectId,
  chains: [ sepolia , CoreTestnet],  
  transports : {
    [sepolia.id] : http("https://worldchain-sepolia.g.alchemy.com/v2/Ljr9rV6foCZ6EDtKt6z-d2Kiy0ahFvLs"),
    [CoreTestnet.id] : http("https://rpc.test2.btcs.network")
    

  }
});

const queryclient = new QueryClient()

const theme = darkTheme({
  accentColor: '#7b3fe4',
  accentColorForeground: "white",
  fontStack : "system",
  overlayBlur: "small",
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config = {config}>
      <QueryClientProvider client={queryclient}>
        <RainbowKitProvider theme={theme}chains={ [, sepolia , CoreTestnet]} >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    
  </StrictMode>,
)
