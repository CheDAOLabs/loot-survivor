export STARKNET_KEYSTORE="~/StarkLiWallet/key.json"
export STARKNET_ACCOUNT="~/StarkLiWallet/account.json"
export STARKNET_NETWORK="goerli-1"

export STARKNET_RPC="https://goerli1-juno.rpc.nethermind.io/"

//export STARKNET_RPC="https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a"




scarb0.7.0 --release build  
starkli declare ./target/dev/game_Game.sierra.json  --rpc https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a



export LORDS_ADDRESS=0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b;
export DAO_ADDRESS=0x020b96923a9e60f63a1829d440a03cf680768cadbc8fe737f71380258817d85b;
export ARG=0x000f4dbfe5d15792aa91025e42ee1d74c22bdeb1eef0b9bc19a37216377290c1;
export CLASS_HASH=0x03a29e6666eb0ac844d5bd9f358212bd3fee0ad778ce82985596a1235e1f6b94;
../starkli0.1.15  deploy $CLASS_HASH $LORDS_ADDRESS $DAO_ADDRESS $ARG

--rpc https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a

