export RUST_BACKTRACE=1
export STARKNET_KEYSTORE="~/StarkLiWallet/key.json"
export STARKNET_ACCOUNT="~/StarkLiWallet/account.json"
export STARKNET_NETWORK="goerli-1"
export STARKNET_RPC="https://goerli1-juno.rpc.nethermind.io/"

export STARKNET_RPC="https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a"




../scarb0.7.0  build  
../starkli0.1.15 declare ./target/dev/cc_cc.sierra.json
../starkli0.1.15 deploy 0x05d598964820c47de61b451f778eab7d22862c02f14e3f3c63711df649875e28


