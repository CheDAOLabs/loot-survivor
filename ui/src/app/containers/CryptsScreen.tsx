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
        "name": "test_get_svg",
        "type": "function",
        "inputs": [
            {
                "name": "seed",
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
        "name": "cc_starknet::utils::pack::Pack",
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
        "name": "test_get_layout",
        "type": "function",
        "inputs": [
            {
                "name": "seed",
                "type": "core::integer::u256"
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
        "name": "test_get_name",
        "type": "function",
        "inputs": [
            {
                "name": "seed",
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
        "name": "test_get_entities",
        "type": "function",
        "inputs": [
            {
                "name": "seed",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "(core::array::Array::<core::integer::u8>, core::array::Array::<core::integer::u8>, core::array::Array::<core::integer::u8>)"
            }
        ],
        "state_mutability": "view"
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
        "name": "cc_starknet::Dungeons::EntityDataSerde",
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
        "name": "cc_starknet::Dungeons::DungeonSerde",
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
        "name": "test_generate_dungeon",
        "type": "function",
        "inputs": [
            {
                "name": "seed",
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
        "name": "test_get_dungeon_storage",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
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
        "name": "balance_of",
        "type": "function",
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
        "name": "safe_transfer_from",
        "type": "function",
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
                "type": "core::integer::u128"
            }
        ],
        "outputs": [],
        "state_mutability": "view"
    },
    {
        "name": "transfer_from",
        "type": "function",
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
                "type": "core::integer::u128"
            }
        ],
        "outputs": [],
        "state_mutability": "view"
    },
    {
        "name": "approve",
        "type": "function",
        "inputs": [
            {
                "name": "to",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "name": "core::bool",
        "type": "enum",
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
        "name": "set_approval_for_all",
        "type": "function",
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
        "name": "get_approved",
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
        "name": "is_approved_for_all",
        "type": "function",
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
        "name": "name",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "type": "core::felt252"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "symbol",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "type": "core::felt252"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "token_uri",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
            }
        ],
        "outputs": [
            {
                "type": "core::felt252"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "support_interface",
        "type": "function",
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
                "type": "cc_starknet::Dungeons::DungeonSerde"
            }
        ],
        "state_mutability": "view"
    },
    {
        "name": "get_entities",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
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
        "name": "get_layout",
        "type": "function",
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
        "name": "get_size",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
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
        "name": "get_environment",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
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
        "name": "get_name",
        "type": "function",
        "inputs": [
            {
                "name": "token_id",
                "type": "core::integer::u128"
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
        "name": "constructor",
        "type": "constructor",
        "inputs": []
    },
    {
        "kind": "struct",
        "name": "cc_starknet::Dungeons::Minted",
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
        "name": "cc_starknet::Dungeons::Claimed",
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
        "name": "cc_starknet::Dungeons::Event",
        "type": "event",
        "variants": [
            {
                "kind": "nested",
                "name": "Minted",
                "type": "cc_starknet::Dungeons::Minted"
            },
            {
                "kind": "nested",
                "name": "Claimed",
                "type": "cc_starknet::Dungeons::Claimed"
            }
        ]
    }
];
const address = "0x04f40722dc2ea00f32f44d73d4075be51c62ce9679db2ccf2bebbd3aba0c54c7";


/**
 * @container
 * @description
 */
export default function CryptsScreen({
                                         explore,
                                         attack,
                                         flee,
                                         upgrade
                                     }: CryptsScreenProps) {
    
    
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
