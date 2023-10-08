export STARKNET_KEYSTORE="./key.json"


starkli declare --account ./account.json ./target/release/game_Game.sierra.json
WARNING: no valid provider option found. Falling back to using the sequencer gateway for the goerli-1 network. Doing this is discouraged. See https://book.starkli.rs/providers for more details.
Enter keystore password:
Not declaring class as it's already declared. Class hash:
0x04421b3816360a8d1618221eea415c100498c498dbdb94d504715d807536395d

star deploy --class_hash 0x04421b3816360a8d1618221eea415c100498c498dbdb94d504715d807536395d --max_fee 100000000000000000 --input $LORDS_ADDRESS $DAO_ADDRESS --account $ACCOUNT_NAME
