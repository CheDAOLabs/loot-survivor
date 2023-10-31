import React, { ChangeEvent, useState } from "react";
import { Button } from "../components/buttons/Button";


import { EnterCode } from "../components/crypts/EnterCode";
import { MapInfo } from "../components/crypts/MapInfo";
import { MapAction } from "../components/crypts/MapAction";

import Info from "../components/adventurer/Info";
import { NullAdventurer } from "../types";
import { useQueriesStore } from "../hooks/useQueryStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import { constants, Contract, num, Provider, shortString } from "starknet";
import Storage from "@/app/lib/storage";


interface CryptsScreenProps {
    explore: (...args: any[]) => any;
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
    upgrade: (...args: any[]) => any;
}

const abi = [
    [
        {
            "type": "impl",
            "name": "ERC721Enumerable",
            "interface_name": "cc_starknet::IERC721Enumerable"
        },
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
            "type": "interface",
            "name": "cc_starknet::IERC721Enumerable",
            "items": [
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
                }
            ]
        },
        {
            "type": "impl",
            "name": "ERC721EnumerableCamelOnly",
            "interface_name": "cc_starknet::IERC721EnumerableCamelOnly"
        },
        {
            "type": "interface",
            "name": "cc_starknet::IERC721EnumerableCamelOnly",
            "items": [
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
                }
            ]
        },
        {
            "type": "impl",
            "name": "ERC721Impl",
            "interface_name": "openzeppelin::token::erc721::interface::IERC721"
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
            "type": "interface",
            "name": "openzeppelin::token::erc721::interface::IERC721",
            "items": [
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
                }
            ]
        },
        {
            "type": "impl",
            "name": "ERC721MetadataImpl",
            "interface_name": "cc_starknet::IERC721Metadata"
        },
        {
            "type": "interface",
            "name": "cc_starknet::IERC721Metadata",
            "items": [
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
                }
            ]
        },
        {
            "type": "impl",
            "name": "ERC721MetadataCamelOnlyImpl",
            "interface_name": "cc_starknet::IERC721MetadataCamelOnly"
        },
        {
            "type": "interface",
            "name": "cc_starknet::IERC721MetadataCamelOnly",
            "items": [
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
                }
            ]
        },
        {
            "type": "impl",
            "name": "ERC721CamelOnlyImpl",
            "interface_name": "openzeppelin::token::erc721::interface::IERC721CamelOnly"
        },
        {
            "type": "interface",
            "name": "openzeppelin::token::erc721::interface::IERC721CamelOnly",
            "items": [
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
                }
            ]
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
    ]
];

const address = "0x078fcf70e22f475b8ffde567f8118e5d99ded383da150e01e55fa79251c7c808";


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
export default function CryptsScreen({explore, attack, flee, upgrade}: CryptsScreenProps) {
    
    
    const adventurer = useAdventurerStore((state) => state.adventurer);
    
    const [formData, setFormData] = useState({
        name: "",
    });
    
    const [step, setStep] = useState(() => {
        
        const monsterIndex = (Number)(Storage.get('monsterIndex' + adventurer?.id)) || 0;
        
        if (monsterIndex === 0) {
            console.log("step 1")
            return 1;
        } else {
            console.log("step 3")
            return 3;
        }
        
    });
    
    
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
    
    const [dungeon, setDungeon] = useState<DungeonData>();
    
    const onEnterCode = async () => {
        // alert("entercode");
        setLoading(true);
        console.log(formData);
        
        let provider = new Provider({sequencer: {network: constants.NetworkName.SN_GOERLI}});
        
        let contract = new Contract(abi, address, provider);
        let token_id = (Number)(formData.name);
        
        const owner = await contract.owner_of(token_id);
        console.log("owner:", num.toHex(owner))
        setOwner(num.toHex(owner))
        
        
        const dungeon_data = await contract.generate_dungeon(token_id);
        console.log("dungeon_data", dungeon_data);
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
        
        const name = decode_string(dungeon_data.dungeon_name);
        setName(name);
        
        const svg = await contract.get_svg(token_id);
        const svg_str = decode_string(svg);
        console.log("svg", svg_str)
        setSvg(svg_str)
        
        setLoading(false);
        setStep(2);
    }
    
    // const setAdventurer = useAdventurerStore((state) => state.setAdventurer);
    
    
    const onEnter = () => {
        
        console.log('onEnter')
        
        Storage.set('monsterIndex' + adventurer?.id, 1);
        
        setStep(3);
        
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
                    <Info adventurer={ adventurer }/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <EnterCode handleBack={ onEnterCode } setFormData={ setFormData } formData={ formData }
                               loading={ loading }/>
                </div>
            </div>
        );
    } else if (step === 2) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={ adventurer }/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <MapInfo handleBack={ onBack } handleEnter={ onEnter } name={ name } owner={ owner } svg={ svg }/>
                </div>
            </div>
        );
    } else if (step === 3) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={ adventurer }/>
                </div>
                {/*<div className="hidden sm:block sm:w-1/2 lg:w-2/3">*/ }
                <MapAction attack={ attack } exit={ onExit } flee={ flee } explore={ explore } upgrade={ upgrade }/>
                {/*</div>*/ }
            </div>
        );
    } else {
        return (<></>);
    }
}
