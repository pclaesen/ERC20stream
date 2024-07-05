require('dotenv').config()
export const chains = () => {
    const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_URL;
    const supportedChains = [
        {
          id: 11155111,
          token: 'ETH',
          label: 'Sepolia testnet',
          rpcUrl: RPC_URL
        }
    ]
    console.log(supportedChains);
    return chains;
}
