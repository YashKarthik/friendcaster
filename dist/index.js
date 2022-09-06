"use strict";
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
];
function hello() {
    console.log('hello world');
}
hello();
