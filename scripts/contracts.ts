import dotenv from 'dotenv';
import { DeploymentConfig } from './types';

dotenv.config();

export const deploymentContracts: DeploymentConfig[] = [
  {
    contractName: 'GraphTest',
    verify: true
  },
  // {
  //   contractName: 'TopicAttestorRelayer',
  //   verify: true,
  //   args: [process.env.TOPIC_ATTESTOR_RELAYER_ADDRESS],
  // },
];
