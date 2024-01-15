export RUST_BACKTRACE=1
export STARKNET_KEYSTORE=~/StarkLiWallet/key.json
export STARKNET_ACCOUNT=~/StarkLiWallet/account.json
export STARKNET_NETWORK="goerli-1"
export STARKNET_RPC="https://goerli1-juno.rpc.nethermind.io/"

export STARKNET_RPC="https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a"




../scarb0.7.0  build  
../starkli0.1.15 declare ./target/dev/cc_cc.sierra.json
../starkli0.1.15 deploy 0x07fd5e37e53c576e17701e503cc60ac5417212b9bd075921850052795289e294


starkli declare ./target/dev/cc_cc.sierra.json
starkli deploy 0x006f790c0039e5641a594f688420129dd992ca527827b0f19f252c6806965f95
