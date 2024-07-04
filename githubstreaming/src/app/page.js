'use client'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";

export default function Home() {
  const [account, setAccount] = useState(null);

  // useEffect(() => {
  //   if (account) {
  //     console.log("Your account:", account);
  //   }
  // }, [account]);

  // useEffect(() => {
  //   if (provider) {
  //     console.log("Your provider:", provider);
  //   }
  // }, [provider]);

  // useEffect(() => {
  //   if (web3SignatureProvider) {
  //     console.log("Your Request Network web3SignatureProvider:", web3SignatureProvider);
  //   }
  // }, [web3SignatureProvider]);

  // useEffect(() => {
  //   if (requestClient) {
  //     console.log("Your RequestClient:", requestClient);
  //   }
  // }, [requestClient]);

  // useEffect(() => {
  //   if (requestCreateParameters) {
  //     console.log("Your requestCreateParameters:", requestCreateParameters);
  //   }
  // }, [requestCreateParameters]);

  async function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User rejected the request');
      }
    } else {
      console.error('MetaMask is not installed');
      alert("Install Metamask please");
    }
  }

  async function handleRequest() {
    if (typeof window.ethereum !== 'undefined' && account) {
      try {
        // Step 1: Create Request Web3 Provider
        const web3Provider = new Web3SignatureProvider(window.ethereum);

        // Step 2: Create Request Client
        const tempRequestClient = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: "https://sepolia.gateway.request.network/",
          },
          signatureProvider: web3Provider,
        });

        // Step 3: Create Request Parameters
        const payeeIdentity = '0xc573Cc1F309CA15FD120e50bE0166a081f253A48';
        const payerIdentity = '0x1B39C76b7bbF7F16795F461Ce5298E882B63a7D6';
        const requestCreateParameters = {
          requestInfo: {
            currency: {
              type: Types.RequestLogic.CURRENCY.ERC20,
              value: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
              network: 'sepolia',
            },
            expectedAmount: '1000000000000000000',
            payee: {
              type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
              value: payeeIdentity,
            },
            payer: {
              type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
              value: payerIdentity,
            },
            timestamp: Utils.getCurrentTimestampInSecond(),
          },
          paymentNetwork: {
            id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
            parameters: {
              paymentNetworkName: 'sepolia',
              paymentAddress: payeeIdentity,
              feeAddress: '0x0000000000000000000000000000000000000000',
              feeAmount: '0',
            },
          },
          contentData: {
            reason: '🍕',
            dueDate: '2025.06.16',
          },
          signer: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: payeeIdentity,
          },
        };

        // Step 4: Create New Request with Parameters
        const request = await tempRequestClient.createRequest(requestCreateParameters);
        const confirmedRequestData = await request.waitForConfirmation();
        console.log(confirmedRequestData);
      } catch (error) {
        console.error('Request handling failed', error);
      }
    } else {
      console.error('No MetaMask connection found, redirecting to connection process...');
      connectToMetaMask();
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
        <button onClick={connectToMetaMask}>Connect</button><br/>
        <button onClick={handleRequest}>Handle Request</button><br/>
        {account && <p>Connected Account: {account}</p>}
      </main>
    </div>
  );
}
