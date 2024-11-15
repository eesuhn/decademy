import { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import {
  IProvider,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
  UserAuthInfo,
} from '@web3auth/base';
import { AuthAdapter } from '@web3auth/auth-adapter';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin';
import { CLIENT_ID, CHAIN_CONFIG, AUTH_CONFIG } from '@/config/web3auth';

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Turns out this is fucking important

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: CHAIN_CONFIG },
        });

        const web3auth = new Web3Auth({
          clientId: CLIENT_ID,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          loginSettings: { mfaLevel: 'none' },
          adapterSettings: {
            whiteLabel: {
              appName: 'twenty-four',
              // TODO: Switch to app logo
              logoLight: 'https://web3auth.io/images/web3authlog.png',
              logoDark: 'https://web3auth.io/images/web3authlogodark.png',
              defaultLanguage: 'en',
              mode: 'light',
            },
            loginConfig: AUTH_CONFIG,
          },
        });

        web3auth.configureAdapter(authAdapter);

        const walletServicesPlugin = new WalletServicesPlugin({
          wsEmbedOpts: {},
          walletInitOptions: { whiteLabel: { showWidgetButton: true } },
        });

        web3auth.addPlugin(walletServicesPlugin);

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.AUTH]: {
              label: 'Auth Adapter',
              loginMethods: {
                // Disable unused login methods
                apple: { name: 'apple', showOnModal: false },
                reddit: { name: 'reddit', showOnModal: false },
                line: { name: 'line', showOnModal: false },
                wechat: { name: 'wechat', showOnModal: false },
                kakao: { name: 'kakao', showOnModal: false },
                linkedin: { name: 'linkedin', showOnModal: false },
                weibo: { name: 'weibo', showOnModal: false },
                facebook: { name: 'facebook', showOnModal: false },
                twitch: { name: 'twitch', showOnModal: false },
                farcaster: { name: 'farcaster', showOnModal: false },
                email_passwordless: {
                  name: 'email_passwordless',
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: 'sms_passwordless',
                  showOnModal: false,
                },
              },
            },
          },
        });

        setWeb3auth(web3auth);
        setProvider(web3auth.provider);
        setLoggedIn(web3auth.connected);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
    } catch (error: any) {
      // Do not prompt error if "Error: User closed the modal" occurs
      if (error.message !== 'User closed the modal') {
        console.error(error);
      }
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  /**
   * @returns User info of the connected wallet
   */
  const getUserInfo = async () => {
    if (!web3auth) return null;
    return await web3auth.getUserInfo();
  };

  /**
   * I think it is some sort of JWT token
   *
   * @returns Id token of the connected wallet
   */
  const getIdToken = async (): Promise<UserAuthInfo> => {
    // if (!web3auth) return null;  // Commented this out because the IDE was bitching
    return await web3auth!.authenticateUser();
  };

  /**
   * @returns Public address of the connected wallet
   */
  const getPublicAddr = async (): Promise<string> => {
    const { Web3 } = require('web3');
    const web3 = new Web3(provider);
    return (await web3.eth.getAccounts())[0];
  };

  /**
   * Allows you to sign contract transactions
   *
   * @returns Signer of the connected wallet
   */
  const getSigner = async () => {
    const { ethers } = require('ethers');
    const provider = new ethers.providers.Web3Provider(web3auth!.provider);
    return provider.getSigner();
  };

  return {
    provider,
    loggedIn,
    loading,
    login,
    logout,
    getUserInfo,
    getIdToken,
    getPublicAddr,
    getSigner,
  };
};
