'use client'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

let signer;

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);

  useEffect(() => {
    if (account) {
      console.log("Your account:", account);
    }
  }, [account]);

  useEffect(() => {
    if (provider) {
      console.log("Your provider:", provider);
    }
  }, [provider]);

  useEffect(() => {
    if (web3Provider) {
      console.log("Your Request Network web3Provider:", web3Provider);
    }
  }, [web3Provider]);

  async function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Optionally, you can set up a provider with ethers.js
        
      } catch (error) {
        console.error('User rejected the request');
      }
    } else {
      console.error('MetaMask is not installed');
    }
  }

  async function createRequestWeb3Provider() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const newWeb3Provider = new Web3SignatureProvider(window.ethereum);
        setWeb3Provider(newWeb3Provider);
        
      } catch (error) {
        console.error('web3provider fetching failed', error);
      }
    } else {
      console.log("Cant do web3provider");
    }
  }

  return (
    <div>
      <Head>
        <title>My Simple Next.js App with Ethers.js</title>
        <meta name="description" content="A simple Next.js app with Ethers.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button onClick={connectToMetaMask}>Connect</button>
        <button onClick={createRequestWeb3Provider}>Create Request web3provider</button>
      </main>

      <footer>
        <p>Powered by Next.js and Ethers.js</p>
      </footer>
    </div>
  );
}
