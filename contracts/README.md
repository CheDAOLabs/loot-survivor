export RUST_BACKTRACE=1
export STARKNET_KEYSTORE="~/StarkLiWallet/key.json"
export STARKNET_ACCOUNT="~/StarkLiWallet/account.json"
export STARKNET_NETWORK="goerli-1"
export STARKNET_RPC="https://goerli1-juno.rpc.nethermind.io/"

export STARKNET_RPC="https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a"




../scarb0.7.0  build  
../starkli0.1.15 declare ./target/dev/game_Game.sierra.json



export CLASS_HASH=0x0623cd91ee08ad9d93622618476c3f78dc9edffdec5fa61cd2803e4ef300dd07;
export LORDS_ADDRESS=0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b;
export DAO_ADDRESS=0x0628d41075659afebfc27aa2aab36237b08ee0b112debd01e56d037f64f6082a;
export BEASTS=0x05c909139dbef784180eef8ce7a2f5bf52afe567aa73aaa77b8d8243ad5b6b96;
export GOLDEN_TOKEN=0x003583470A8943479F8609192Da4427caC45BdF66a58C84043c7Ab2FC722C0C0
export TIMESTAMP=1735664461
export CC_ADDRESS=0x03ea1206025dfbcc355315cd338bed3c70fa2fd73677721ace3991dcada4b473

../starkli0.1.15 deploy $CLASS_HASH $LORDS_ADDRESS $DAO_ADDRESS $BEASTS $GOLDEN_TOKEN $TIMESTAMP $CC_ADDRESS


