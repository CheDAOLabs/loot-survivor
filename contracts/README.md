export RUST_BACKTRACE=1
export STARKNET_KEYSTORE="~/StarkLiWallet/key.json"
export STARKNET_ACCOUNT="~/StarkLiWallet/account.json"
export STARKNET_NETWORK="goerli-1"
export STARKNET_RPC="https://goerli1-juno.rpc.nethermind.io/"

export STARKNET_RPC="https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a"




../scarb0.7.0  build  
../starkli0.1.15 declare ./target/dev/game_Game.sierra.json



export CLASS_HASH=0x0451feafc8437e93c34977d9c1ab9a185b12230bfed0a05d250b41bf54933229;
export LORDS_ADDRESS=0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b;
export DAO_ADDRESS=0x0628d41075659afebfc27aa2aab36237b08ee0b112debd01e56d037f64f6082a;
export BEASTS=0x05c909139dbef784180eef8ce7a2f5bf52afe567aa73aaa77b8d8243ad5b6b96;
export GOLDEN_TOKEN=0x003583470A8943479F8609192Da4427caC45BdF66a58C84043c7Ab2FC722C0C0
export TIMESTAMP=1735664461
export CC_ADDRESS=0x0112b2e70c9ca5e10f948e4489d1935f5102f65ac0410fda0030429fa3ce1423

../starkli0.1.15 deploy $CLASS_HASH $LORDS_ADDRESS $DAO_ADDRESS $BEASTS $GOLDEN_TOKEN $TIMESTAMP $CC_ADDRESS


