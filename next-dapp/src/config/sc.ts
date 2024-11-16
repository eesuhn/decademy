const config = {
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
  CONTRACT_ABI: process.env.NEXT_PUBLIC_CONTRACT_ABI as string,
  RELAYER_CONTRACT_ADDRESS: process.env
    .NEXT_PUBLIC_RELAYER_ADDRESS as string,
  RELAYER_ABI: process.env.NEXT_PUBLIC_RELAYER_ABI as string,
};

export default config;
