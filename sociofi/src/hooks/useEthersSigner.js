import {BrowserProvider, JsonRpcSigner} from "ethers";
import { useMemo } from "react";
import { useConnectorClient } from "wagmi";


export const clientToSigner = (client) => {
    const {account , chain , transport } = client

    const network = {
        chainId : chain.id,
        name : chain.name,
        ensAddress : chain.contracts?.ensRegistry?.address,
    };
  
     const  provider = new BrowserProvider(transport, network);

     const signer = new JsonRpcSigner(provider , account.address);

     return signer;

};


 export const useEthersSigner = ({chainId} = {}) => {
    const {data : client} = useConnectorClient({chainId});

    return useMemo( () => (
        client ? clientToSigner(client) : undefined
    ),[client]);

 }