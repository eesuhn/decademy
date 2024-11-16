import dotenv from 'dotenv';
import { DeploymentConfig } from './types';

dotenv.config();

export const deploymentContracts: DeploymentConfig[] = [
  {
    contractName: 'GraphTest',
    verify: true,
    args: [process.env.SIGN_PROTOCOL_ADDRESS, process.env.SIGN_PROTOCOL_SCHEMA_ID],
  },
  // {
  //   contractName: 'TopicAttestorRelayer',
  //   verify: true,
  //   args: [process.env.TOPIC_ATTESTOR_RELAYER_ADDRESS],
  // },
];
