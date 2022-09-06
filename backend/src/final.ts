import { providers, Contract } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config()

import { render } from './image';
import { getInteractionFrequency } from './data';

const REGISTRY_CONTRACT_ADDRESS = '0xe3Be01D99bAa8dB9905b33a3cA391238234B79D1';
const REGISTRY_ABI = [
  {
    name: 'getDirectoryUrl',
    inputs: [{ internalType: 'bytes32', name: 'username', type: 'bytes32' }],
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: "view",
    type: 'function',
  },
  {
    name: 'addressToUsername',
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: "view",
    type: 'function',
  },
]


export async function createImage(username: string) {
  const provider = new providers.AlchemyProvider('rinkeby', process.env.ALCHEMY_API_KEY);
  const registryContract = new Contract(REGISTRY_CONTRACT_ADDRESS, REGISTRY_ABI, provider);

  const block = await provider.getBlockNumber();
  console.log("Block: ", block);

  const data = await getInteractionFrequency(username, registryContract)
  console.log(data)

  await render([
    {distance: 0,   count: 1,   radius: 110,    users: data[0]},
	  {distance: 300, count: 8,   radius: 80,     users: data[1]},
	  {distance: 400, count: 15,  radius: 50,     users: data[2]},
	  {distance: 500, count: 26,  radius: 30,     users: data[3]},
  ]);
};
