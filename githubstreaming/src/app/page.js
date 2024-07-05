'use client'
require('dotenv').config();
import Head from 'next/head';
import { useState } from 'react';

import WalletConnectButton from './components/WalletConnectButton';
import RequestHandler from './components/RequestHandler';
import styles from './page.module.css';

export default function Home() {
  const [account, setAccount] = useState(null);

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Simple Next.js App with Ethers.js</title>
        <meta name="description" content="A simple Next.js app with Ethers.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>My Simple Next.js App</h1>
        <WalletConnectButton onAccountChange={handleAccountChange} /><br />
        <RequestHandler account={account} /><br />
        {account && (
          <div className={styles['account-info']}>
            <p>Connected Account: {account}</p>
          </div>
        )}
      </main>
    </div>
  );
}
