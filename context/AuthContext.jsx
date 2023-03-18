import React, { useEffect, useState, createContext } from 'react'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { ComposeClient } from '@composedb/client'
import { definition } from '../schema/client'
import {sequence} from "0xsequence";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {

    const loadSession = async (authMethod) => {
        const sessionStr = localStorage.getItem('didsession')
        let session
        if (sessionStr) {
            session = await DIDSession.fromSession(sessionStr)
        }
        if (!sessionStr || (session.hasSession && session.isExpired)) {
            session = await DIDSession.authorize(authMethod, {
                resources: compose.resources,
            })
            localStorage.setItem('didsession', session.serialize())
        }
        return session
    }

    const connect = async () => {
        const instance = await web3Modal?.connect();
        const provider =  new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner()
        const accounts = await provider.listAccounts();
        const accountId = await getAccountId(provider.provider, accounts[0])
        const authMethod = await EthereumWebAuth.getAuthMethod(
            provider.provider,
            accountId
        )
        const session = await loadSession(authMethod)
        console.log(session)
        localStorage.setItem('user', accounts[0])
        localStorage.setItem('didsession', session.serialize())
        compose.setDID(session.did)
        setSession(session)
        setSigner(signer)
        setAddress(accounts[0])
    }

    const disconnect = () => {
        if (web3Modal && web3Modal.cachedProvider) {
            web3Modal.clearCachedProvider();
            setUser(undefined);
            localStorage.removeItem("user");
            localStorage.removeItem("didsession");
        }
    }

    const [address, setAddress] = useState('')
    const [signer, setSigner] = useState('')
    const [userSession, setSession] = useState()
    const [compose, setCompose] = useState()
    const [web3Modal, setWeb3Modal] = useState()

    useEffect(() => {
        if(!localStorage.getItem('user')||!localStorage.getItem('didsession')){
            const composeClient = new ComposeClient({ ceramic: 'http://localhost:7007', definition })
            const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
                providerOptions:{
                    sequence: {
                        package: sequence,
                        options: {
                            appName: 'Web3Modal Demo Dapp',
                            defaultNetwork: 'polygon',
                        }
                    }  
                }
            });
            setCompose(composeClient)
            setWeb3Modal(web3Modal)
        }
    },[])

    return (
        <AuthContext.Provider
            value={{
                address,
                signer,
                connect,
                disconnect,
                userSession,
                compose,
            }}
        > 
        {children}
        </AuthContext.Provider>
    )
}
