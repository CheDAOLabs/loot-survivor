export STARKNET_KEYSTORE="./key.json"
export STARKNET_ACCOUNT="./account.json"

scarb --release build  && starkli declare  ./target/release/game_Game.contract_class.json  --rpc https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a


export LORDS_ADDRESS=0x059dac5df32cbce17b081399e97d90be5fba726f97f00638f838613d088e5a47;
export DAO_ADDRESS=0x020b96923a9e60f63a1829d440a03cf680768cadbc8fe737f71380258817d85b;
export ARG=0x000f4dbfe5d15792aa91025e42ee1d74c22bdeb1eef0b9bc19a37216377290c1;
export CLASS_HASH=0x06710cf873b1621e43d58d58c80613ce70c58340e25a499009812edd6232616a;
starkli deploy $CLASS_HASH $LORDS_ADDRESS $DAO_ADDRESS $ARG  --rpc https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a

