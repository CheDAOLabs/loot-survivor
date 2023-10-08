const express = require('express')
const app = express()
const {Provider,Contract,constants} = require('starknet');

const abi = [
    {
        "name": "mint",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "type": "core::integer::u128"
            }
        ],
        "state_mutability": "external"
    },
    {
        "name": "owner_of",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "core::integer::u256",
        "type": "struct",
        "members": [
            {
                "name": "low",
                "type": "core::integer::u128"
            },
            {
                "name": "high",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "name": "get_seeds",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "core::integer::u256"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "core::array::Span::<core::felt252>",
        "type": "struct",
        "members": [
            {
                "name": "snapshot",
                "type": "@core::array::Array::<core::felt252>"
            }
        ]
    },
    {
        "name": "token_URI_not_work_yet",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "core::array::Span::<core::felt252>"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "get_svg",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "core::array::Array::<core::felt252>"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "cc_map::utils::pack::Pack",
        "type": "struct",
        "members": [
            {
                "name": "first",
                "type": "core::felt252"
            },
            {
                "name": "second",
                "type": "core::felt252"
            },
            {
                "name": "third",
                "type": "core::felt252"
            }
        ]
    },
    {
        "name": "core::array::Span::<core::integer::u8>",
        "type": "struct",
        "members": [
            {
                "name": "snapshot",
                "type": "@core::array::Array::<core::integer::u8>"
            }
        ]
    },
    {
        "name": "cc_map::Dungeons::EntityData",
        "type": "struct",
        "members": [
            {
                "name": "x",
                "type": "core::array::Span::<core::integer::u8>"
            },
            {
                "name": "y",
                "type": "core::array::Span::<core::integer::u8>"
            },
            {
                "name": "entity_data",
                "type": "core::array::Span::<core::integer::u8>"
            }
        ]
    },
    {
        "name": "cc_map::Dungeons::DungeonSerde",
        "type": "struct",
        "members": [
            {
                "name": "size",
                "type": "core::integer::u8"
            },
            {
                "name": "environment",
                "type": "core::integer::u8"
            },
            {
                "name": "structure",
                "type": "core::integer::u8"
            },
            {
                "name": "legendary",
                "type": "core::integer::u8"
            },
            {
                "name": "layout",
                "type": "cc_map::utils::pack::Pack"
            },
            {
                "name": "entities",
                "type": "cc_map::Dungeons::EntityData"
            },
            {
                "name": "affinity",
                "type": "core::felt252"
            },
            {
                "name": "dungeon_name",
                "type": "core::array::Span::<core::felt252>"
            }
        ]
    },
    {
        "name": "generate_dungeon",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "cc_map::Dungeons::DungeonSerde"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "constructor",
        "type": "constructor",
        "inputs": []
    },
    {
        "kind": "struct",
        "name": "cc_map::Dungeons::Minted",
        "type": "event",
        "members": [
            {
                "kind": "key",
                "name": "account",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "kind": "data",
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "kind": "struct",
        "name": "cc_map::Dungeons::Claimed",
        "type": "event",
        "members": [
            {
                "kind": "key",
                "name": "account",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "kind": "data",
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "kind": "enum",
        "name": "cc_map::Dungeons::Event",
        "type": "event",
        "variants": [
            {
                "kind": "nested",
                "name": "Minted",
                "type": "cc_map::Dungeons::Minted"
            },
            {
                "kind": "nested",
                "name": "Claimed",
                "type": "cc_map::Dungeons::Claimed"
            }
        ]
    }
];
const address = "0x0188ddc140efc0761c47e154b5bfd81ec36c0ed61a1dda92dadb826ae4c87d99";
const provider = new Provider({sequencer: {network: constants.NetworkName.SN_GOERLI}});
const contract = new Contract(abi, address, provider);

app.use(express.static('public'));

let tokens = [];

function retryOperation(operation,args, maxRetries, delay) {
    return new Promise((resolve, reject) => {
        let retries = 0;

        function tryOperation() {
            operation(args)
                .then(result => {
                    // 操作成功，返回结果
                    resolve(result);
                })
                .catch(error => {
                    retries++;

                    if (retries <= maxRetries) {
                        // 输出重试次数和错误信息
                        console.log(`Retry ${retries} failed with error: ${error}`);

                        // 延迟一段时间后再次尝试
                        setTimeout(tryOperation, delay);
                    } else {
                        // 达到最大重试次数，拒绝Promise并返回错误信息
                        reject(new Error(`Max retries reached with error: ${error}`));
                    }
                });
        }

        tryOperation();
    });
}

const getMeta = async (tokenId)=>{
    const dungeon_data = await retryOperation(contract.generate_dungeon,tokenId,1000,100000000000);
    console.log(dungeon_data);


}

getMeta(1);

app.get('/metadata/:tokenId',  (req, res) => {




    let {tokenId} = req.params;
    tokenId = tokenId.replace(".json", "");







    const domain = req.hostname;
    const protocol = "https"//req.protocol;

    console.log("Request for token " + tokenId + " from " + domain + " (" + protocol + ")");

    const metadata = {
        "name": "Stark ID: " + tokenId,
        "description": "This token represents an identity on StarkNet.",
        "image": protocol + "://" + domain + "/images/" + tokenId % 12 + ".png",
        "expiry": null,
        "attributes": null
    }

    res.json(metadata);
});

app.listen(3001)