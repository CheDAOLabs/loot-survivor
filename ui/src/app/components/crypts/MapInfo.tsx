import React, {useState, ChangeEvent} from "react";
import {Button} from "../buttons/Button";
import {FormData} from "@/app/types";
import {constants, Provider, Contract} from "starknet";


export interface MapInfoProps {
    handleBack: () => void;
    handleEnter: () => void;
}



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

export const MapInfo = ({
                            handleBack,
                            handleEnter,
                        }: MapInfoProps) => {
    const [isMaxLength, setIsMaxLength] = useState(false);

    const [info, setInfo] = useState(async () => {
        console.log("init map info");


        let provider = new Provider({sequencer: {network: constants.NetworkName.SN_GOERLI}});

        let contract = new Contract(abi, address, provider);
        let token_id = 1;


        const dungeon_data = await contract.generate_dungeon(token_id);
        console.log("dungeon_data",dungeon_data);

        //todo

    });


    return (
        <>
            <div className=" text-center p-4 uppercase 2xl:flex 2xl:flex-col 2xl:gap-10 2xl:h-[700px]">
                <div className="2xl:text-3xl">Owner: 0x02851980De030A......703C03160C23aD7ac86A<br/>Type: Divine Crypt<br/>ADMISSION FEE: 1/20
                </div>


                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10">
                    <img src="https://openseauserdata.com/files/d2c0f4b0bd85871bfd3b6eea02e9059a.svg" width={200}/>
                </div>

                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10 mt-3">
                    <Button size={"lg"} onClick={handleBack}>BACK</Button>
                    <Button size={"lg"} className="ml-3" onClick={handleEnter}>ENTER</Button>

                </div>
            </div>
        </>
    );
};
