import React from 'react';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import styles from '../page.module.css';

const RequestHandler = ({ account }) => {
  async function handleRequest() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Step 1: Create Request Web3 Provider
        const web3Provider = new Web3SignatureProvider(window.ethereum);

        // Step 2: Create Request Client
        const tempRequestClient = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: 'https://sepolia.gateway.request.network/',
          },
          signatureProvider: web3Provider,
        });

        // Step 3: Create Request Parameters
        const payeeIdentity = account;
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
    }
  }

  return (
    <button className={styles.button} onClick={handleRequest}>
      Create Request
    </button>
  );
};

export default RequestHandler;
