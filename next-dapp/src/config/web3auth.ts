import { CHAIN_NAMESPACES } from '@web3auth/base';
import { LoginConfig } from '@web3auth/auth-adapter';

// TODO: Replace with own client ID
export const CLIENT_ID =
  'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';

/**
 * @returns RPC URL from .env or default
 */
const getRpcUrl = () => {
  if (
    process.env.NEXT_PUBLIC_RPC_URL &&
    process.env.NEXT_PUBLIC_RPC_URL !== ''
  ) {
    return process.env.NEXT_PUBLIC_RPC_URL;
  } else {
    console.log('Recommended to set NEXT_PUBLIC_RPC_URL in .env for W3A');
    return 'https://rpc.scroll.network';
  }
};

export const CHAIN_CONFIG = {
  chainId: '0x8274F',
  rpcTarget: getRpcUrl(),
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: 'Scroll Sepolia',
  blockExplorerUrl: 'https://sepolia.scrollscan.com/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://scroll.io/static/media/Scroll_Logomark.673577c8260b63ae56867bc9af6af514.svg',
};

export const AUTH_CONFIG: LoginConfig = {
  google: {
    verifier: 'aggregate-sapphire',
    verifierSubIdentifier: 'w3a-google',
    typeOfLogin: 'google',
    clientId:
      '519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com',
  },
  github: {
    verifier: 'aggregate-sapphire',
    verifierSubIdentifier: 'w3a-a0-github',
    typeOfLogin: 'github',
    clientId: 'hiLqaop0amgzCC0AXo4w0rrG9abuJTdu',
    jwtParameters: {
      domain: 'https://web3auth.au.auth0.com',
      verifierIdField: 'email',
      isVerifierIdCaseSensitive: false,
      connection: 'github',
    },
  },
  discord: {
    verifier: 'w3a-discord-demo',
    typeOfLogin: 'discord',
    clientId: '1151006428610433095',
  },
  twitter: {
    verifier: 'w3a-auth0-demo',
    typeOfLogin: 'twitter',
    clientId: 'hUVVf4SEsZT7syOiL0gLU9hFEtm2gQ6O',
    jwtParameters: {
      domain: 'https://web3auth.au.auth0.com',
      verifierIdField: 'sub',
      isVerifierIdCaseSensitive: true,
    },
  },
} as const;
