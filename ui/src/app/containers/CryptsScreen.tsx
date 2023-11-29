import React, {ChangeEvent, useState} from "react";
import {Button} from "../components/buttons/Button";


import {EnterCode} from "../components/crypts/EnterCode";
import {MapInfo} from "../components/crypts/MapInfo";

import Info from "../components/adventurer/Info";
import {NullAdventurer, NullBeast} from "../types";
import {useQueriesStore} from "../hooks/useQueryStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import {constants, Contract, num, Provider, shortString, cairo, ContractInterface} from "starknet";
import CryptsBeastScreen from "@/app/containers/CryptsBeastScreen";

// import Storage from "@/app/lib/storage";


interface CryptsScreenProps {
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
    enterCc: (...args: any[]) => any;
    buffAdventurer: (...args: any[]) => any;
}

const abi = [
    {
        "type": "struct",
        "name": "core::integer::u256",
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
        "type": "function",
        "name": "total_supply",
        "inputs": [],
        "outputs": [
            {
                "type": "core::integer::u256"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "token_by_index",
        "inputs": [
            {
                "name": "index",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "token_of_owner_by_index",
        "inputs": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "index",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
            {
                "type": "core::integer::u256"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "tokenByIndex",
        "inputs": [
            {
                "name": "index",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "tokenOfOwnerByIndex",
        "inputs": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "index",
                "type": "core::integer::u256"
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
        "type": "struct",
        "name": "core::array::Span::<core::felt252>",
        "members": [
            {
                "name": "snapshot",
                "type": "@core::array::Array::<core::felt252>"
            }
        ]
    },
    {
        "type": "enum",
        "name": "core::bool",
        "variants": [
            {
                "name": "False",
                "type": "()"
            },
            {
                "name": "True",
                "type": "()"
            }
        ]
    },
    {
        "type": "function",
        "name": "balance_of",
        "inputs": [
            {
                "name": "account",
                "type": "core::starknet::contract_address::ContractAddress"
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
        "type": "function",
        "name": "owner_of",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "transfer_from",
        "inputs": [
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "safe_transfer_from",
        "inputs": [
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256"
            },
            {
                "name": "data",
                "type": "core::array::Span::<core::felt252>"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "set_approval_for_all",
        "inputs": [
            {
                "name": "operator",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "approved",
                "type": "core::bool"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "get_approved",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "is_approved_for_all",
        "inputs": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "operator",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "type": "core::felt252"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
            {
                "type": "core::felt252"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "token_uri",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "tokenURI",
        "inputs": [
            {
                "name": "tokenId",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            {
                "name": "account",
                "type": "core::starknet::contract_address::ContractAddress"
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
        "type": "function",
        "name": "ownerOf",
        "inputs": [
            {
                "name": "tokenId",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "tokenId",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "safeTransferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "tokenId",
                "type": "core::integer::u256"
            },
            {
                "name": "data",
                "type": "core::array::Span::<core::felt252>"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "setApprovalForAll",
        "inputs": [
            {
                "name": "operator",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "approved",
                "type": "core::bool"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "getApproved",
        "inputs": [
            {
                "name": "tokenId",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "isApprovedForAll",
        "inputs": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "operator",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "mint",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "supports_interface",
        "inputs": [
            {
                "name": "interface_id",
                "type": "core::felt252"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [
            {
                "name": "interfaceId",
                "type": "core::felt252"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_seeds",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "token_URI",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "function",
        "name": "get_svg",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
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
        "type": "struct",
        "name": "cc_starknet::utils::pack::Pack",
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
        "type": "struct",
        "name": "core::array::Span::<core::integer::u8>",
        "members": [
            {
                "name": "snapshot",
                "type": "@core::array::Array::<core::integer::u8>"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc_starknet::Dungeons::EntityDataSerde",
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
        "type": "struct",
        "name": "cc_starknet::Dungeons::DungeonSerde",
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
                "type": "cc_starknet::utils::pack::Pack"
            },
            {
                "name": "entities",
                "type": "cc_starknet::Dungeons::EntityDataSerde"
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
        "type": "function",
        "name": "generate_dungeon",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "cc_starknet::Dungeons::DungeonSerde"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_entities",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "cc_starknet::Dungeons::EntityDataSerde"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_layout",
        "inputs": [
            {
                "name": "seed",
                "type": "core::integer::u256"
            },
            {
                "name": "size",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "(cc_starknet::utils::pack::Pack, core::integer::u8)"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_size",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "core::integer::u128"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_environment",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "core::integer::u8"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "function",
        "name": "get_name",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "(core::array::Array::<core::felt252>, core::felt252, core::integer::u8)"
            }
        ],
        "state_mutability": "view"
    },
    {
        "type": "constructor",
        "name": "constructor",
        "inputs": []
    },
    {
        "type": "event",
        "name": "cc_starknet::Dungeons::Minted",
        "kind": "struct",
        "members": [
            {
                "name": "account",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc_starknet::Dungeons::Transfer",
        "kind": "struct",
        "members": [
            {
                "name": "from",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc_starknet::Dungeons::Approval",
        "kind": "struct",
        "members": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "approved",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "token_id",
                "type": "core::integer::u256",
                "kind": "key"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc_starknet::Dungeons::ApprovalForAll",
        "kind": "struct",
        "members": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "operator",
                "type": "core::starknet::contract_address::ContractAddress",
                "kind": "key"
            },
            {
                "name": "approved",
                "type": "core::bool",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc_starknet::Dungeons::Event",
        "kind": "enum",
        "variants": [
            {
                "name": "Minted",
                "type": "cc_starknet::Dungeons::Minted",
                "kind": "nested"
            },
            {
                "name": "Transfer",
                "type": "cc_starknet::Dungeons::Transfer",
                "kind": "nested"
            },
            {
                "name": "Approval",
                "type": "cc_starknet::Dungeons::Approval",
                "kind": "nested"
            },
            {
                "name": "ApprovalForAll",
                "type": "cc_starknet::Dungeons::ApprovalForAll",
                "kind": "nested"
            }
        ]
    }
];
const address = "0x056834208d6a7cc06890a80ce523b5776755d68e960273c9ef3659b5f74fa494";


interface DungeonData {
    size: string;
    environment: string;
    structure: string;
    legendary: string;
    layout: {
        first: string;
        second: string;
        third: string;
    };
    entities: {
        x: string[];
        y: string[];
        entity_data: string[];
    };
    affinity: string;
    dungeon_name: string[];
}

/**
 * @container
 * @description
 */
export default function CryptsScreen({attack, flee, enterCc, buffAdventurer}: CryptsScreenProps) {

    const adventurer = useAdventurerStore((state) => state.adventurer);

    const [formData, setFormData] = useState({
        name: "",
    });

    const beastData = useQueriesStore(
        (state) => state.data.beastQueryCC?.beasts[0] || NullBeast
    );

    const [step, setStep] = useState(() => {
        console.log("beastData", beastData)
        if (beastData.beast) {
            return 3;
        } else {
            return 1;
        }


    });


    const onEnterCode = async () => {
        // alert("entercode");
        setLoading(true);
        console.log(formData);

        //let provider = new Provider({sequencer: {network: constants.NetworkName.SN_GOERLI}});
        let provider = new Provider({rpc: {
                        nodeUrl:"https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a",
        }});

        let contract = new Contract(abi, address, provider);
        console.log(contract);
        let token_id = cairo.uint256(formData.name);

        const owner = await contract.owner_of(token_id);
        // console.log("owner:", num.toHex(owner));
        setOwner(num.toHex(owner));

        const dungeon_data = await contract.generate_dungeon(token_id);
        console.log("dungeon_data", dungeon_data.entities);
        // const points = dungeon_data.entities.
        setDungeon(
            {
                size: dungeon_data.size,
                environment: dungeon_data.environment,
                structure: dungeon_data.structure,
                legendary: dungeon_data.legendary,
                layout: {
                    first: dungeon_data.layout.first,
                    second: dungeon_data.layout.second,
                    third: dungeon_data.layout.third
                },
                entities: {
                    x: dungeon_data.entities.x,
                    y: dungeon_data.entities.y,
                    entity_data: dungeon_data.entities.entity_data
                },
                affinity: dungeon_data.affinity,
                dungeon_name: dungeon_data.dungeon_name,
            }
        )

        const formatAnswer = {name: 'string', affinity: 'string', legendary: 'number'};
        let dungeonName = await contract.get_name(token_id, {
            parseRequest: true,
            parseResponse: true,
            formatRequest: formatAnswer,
        });
        const name = decode_string(dungeonName[0]);
        setName(name);

        /*        const svg = await contract.get_svg(token_id);
                const svg_str = decode_string(svg);
                console.log("svg", svg_str);
                setSvg(svg_str);*/
        setLoading(false);
        setStep(2);
    }


    const decode_string = (array: any) => {
        let result = "";
        for (let i = 0; i < array.length; i++) {
            let temp = shortString.decodeShortString(array[i]);
            // console.log("temp:", temp);
            result += temp;
        }
        return result;
    };

    const [owner, setOwner] = useState("0x....")
    const [name, setName] = useState("loading")
    const [svg, setSvg] = useState("")
    const [loading, setLoading] = useState(false)

    const [dungeon, setDungeon] = useState<DungeonData>({
        "size": "0x14",
        "environment": "0x04",
        "structure": "0x01",
        "legendary": "0x00",
        "layout": {
            "first": "0x100000ea040ca040ea1c06e100463084620046670c62418e2010e301fe101e",
            "second": "0xc10040180c01e8c00000000000000000000000000000000000000000000000",
            "third": "0x00"
        },
        "entities": {
            "x": [
                "0x05",
                "0x10",
                "0x05",
                "0x04"
            ],
            "y": [
                "0x02",
                "0x03",
                "0x0c",
                "0x0e"
            ],
            "entity_data": [
                "0x01",
                "0x00",
                "0x00",
                "0x01"
            ]
        },
        "affinity": "0x6e6f6e65",
        "dungeon_name": [
            "0x546973682773",
            "0x20",
            "0x50617373616765"
        ]
    });

    const coin = "<span class='sk'>🪙</span>";
    const door = "<span class='sk'>🚪</span>"

    const decode_map = (layout: any, size: any) => {
        // eslint-disable-next-line
        let layoutIntFirst = BigInt(layout.first).toString(2).padStart(248, '0');
        // eslint-disable-next-line
        let layoutIntSecond = BigInt(layout.second).toString(2);
        // eslint-disable-next-line
        let layoutIntThird = BigInt(layout.third).toString(2);
        let bits = layoutIntFirst + layoutIntSecond + layoutIntThird;
        // console.log("bits", bits);

        // Store dungeon in 2D array
        let dungeon = [];
        // let grid = []
        let counter = 0;
        for (let y = 0; y < size; y++) {
            let row = []
            // let grid_row = [];
            for (let x = 0; x < size; x++) {
                // eslint-disable-next-line
                const bit = bits[counter] == '1' ? '<span class="bl"> </span>' : '<span class="bl">X</span>';
                row.push(bit)
                // grid_row.push(bits[counter] == 1 ? 0 : 1);
                counter++;
            }
            dungeon.push(row)
            // grid.push(grid_row);
        }
        return dungeon;
    }

    const render = () => {
        let rowString = ""

        let entities = dungeon.entities;
        // console.log("entities", entities);
        let map = decode_map(dungeon.layout, dungeon.size);
        // console.log("map", map);

        if (entities != null) {
            if (entities.entity_data.length > 0) {
                for (let i = 0; i < entities.entity_data.length; i++) {
                    // Update dungeon with our entity
                    if (entities.entity_data[i] == "1") {
                        // Place a door
                        map[parseInt(entities.y[i])][parseInt(entities.x[i])] = coin;
                    } else if (entities.entity_data[i] == "0") {
                        // Place a point of interest
                        map[parseInt(entities.y[i])][parseInt(entities.x[i])] = door;
                    }
                }
            }
        }

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map.length; x++) {
                const tile = map[y][x]
                rowString += `${tile} ` + "  "
            }
            rowString += '\n'
        }
        return (rowString)
    };

    // const setAdventurer = useAdventurerStore((state) => state.setAdventurer);

    const onEnter = async () => {
        console.log("onEnter: formData=", formData);
        // return;
        try {
            setLoading(true);
            console.log("adventurer", adventurer)
            if(!adventurer){
                return;
            }
            await enterCc(adventurer.id, formData.name);
            // Storage.set('monsterIndex' + adventurer?.id, 1);
            setStep(3);
        } catch (e) {
            console.error(e)
        }finally {
            setLoading(false);
        }
    }

    const onBack = () => {
        console.log("onBack")
        setStep(1);
    }

    const onExit = () => {
        // alert("exit");
        setStep(1);
    }

    if (step === 1) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer}/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <EnterCode handleBack={onEnterCode} setFormData={setFormData} formData={formData}
                               loading={loading}/>
                </div>
                net </div>
        );
    } else if (step === 2) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer}/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <MapInfo handleBack={onBack} handleEnter={onEnter} name={name} owner={owner} svg={svg}
                             render={render} dungeon={dungeon} loading={loading}/>
                </div>
            </div>
        );
    } else if (step === 3) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer} />
                </div>
                <CryptsBeastScreen
                    attack={attack} flee={flee} exit={onExit} buffAdventurer={buffAdventurer}/>
            </div>
        );
    } else {
        return (<></>);
    }
}
