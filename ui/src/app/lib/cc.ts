import {Abi, Contract, Provider} from "starknet";
import {GameData} from "@/app/lib/data/GameData";

const abi = [
    {
        "type": "impl",
        "name": "CC",
        "interface_name": "cc::cc_interfaces::ICC"
    },
    {
        "type": "struct",
        "name": "cc::cc_cave::CcCave",
        "members": [
            {
                "name": "map_id",
                "type": "core::integer::u16"
            },
            {
                "name": "curr_beast",
                "type": "core::integer::u16"
            },
            {
                "name": "cc_points",
                "type": "core::integer::u16"
            },
            {
                "name": "beast_health",
                "type": "core::integer::u16"
            },
            {
                "name": "beast_amount",
                "type": "core::integer::u16"
            },
            {
                "name": "has_reward",
                "type": "core::integer::u16"
            },
            {
                "name": "strength_increase",
                "type": "core::integer::u8"
            },
            {
                "name": "dexterity_increase",
                "type": "core::integer::u8"
            },
            {
                "name": "vitality_increase",
                "type": "core::integer::u8"
            },
            {
                "name": "intelligence_increase",
                "type": "core::integer::u8"
            },
            {
                "name": "wisdom_increase",
                "type": "core::integer::u8"
            },
            {
                "name": "charisma_increase",
                "type": "core::integer::u8"
            }
        ]
    },
    {
        "type": "enum",
        "name": "combat::constants::CombatEnums::Tier",
        "variants": [
            {
                "name": "None",
                "type": "()"
            },
            {
                "name": "T1",
                "type": "()"
            },
            {
                "name": "T2",
                "type": "()"
            },
            {
                "name": "T3",
                "type": "()"
            },
            {
                "name": "T4",
                "type": "()"
            },
            {
                "name": "T5",
                "type": "()"
            }
        ]
    },
    {
        "type": "enum",
        "name": "combat::constants::CombatEnums::Type",
        "variants": [
            {
                "name": "None",
                "type": "()"
            },
            {
                "name": "Magic_or_Cloth",
                "type": "()"
            },
            {
                "name": "Blade_or_Hide",
                "type": "()"
            },
            {
                "name": "Bludgeon_or_Metal",
                "type": "()"
            },
            {
                "name": "Necklace",
                "type": "()"
            },
            {
                "name": "Ring",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "combat::combat::SpecialPowers",
        "members": [
            {
                "name": "special1",
                "type": "core::integer::u8"
            },
            {
                "name": "special2",
                "type": "core::integer::u8"
            },
            {
                "name": "special3",
                "type": "core::integer::u8"
            }
        ]
    },
    {
        "type": "struct",
        "name": "combat::combat::CombatSpec",
        "members": [
            {
                "name": "tier",
                "type": "combat::constants::CombatEnums::Tier"
            },
            {
                "name": "item_type",
                "type": "combat::constants::CombatEnums::Type"
            },
            {
                "name": "level",
                "type": "core::integer::u16"
            },
            {
                "name": "specials",
                "type": "combat::combat::SpecialPowers"
            }
        ]
    },
    {
        "type": "struct",
        "name": "beasts::beast::Beast",
        "members": [
            {
                "name": "id",
                "type": "core::integer::u8"
            },
            {
                "name": "starting_health",
                "type": "core::integer::u16"
            },
            {
                "name": "combat_spec",
                "type": "combat::combat::CombatSpec"
            }
        ]
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
        "type": "struct",
        "name": "survivor::stats::Stats",
        "members": [
            {
                "name": "strength",
                "type": "core::integer::u8"
            },
            {
                "name": "dexterity",
                "type": "core::integer::u8"
            },
            {
                "name": "vitality",
                "type": "core::integer::u8"
            },
            {
                "name": "intelligence",
                "type": "core::integer::u8"
            },
            {
                "name": "wisdom",
                "type": "core::integer::u8"
            },
            {
                "name": "charisma",
                "type": "core::integer::u8"
            },
            {
                "name": "luck",
                "type": "core::integer::u8"
            }
        ]
    },
    {
        "type": "struct",
        "name": "survivor::item_primitive::ItemPrimitive",
        "members": [
            {
                "name": "id",
                "type": "core::integer::u8"
            },
            {
                "name": "xp",
                "type": "core::integer::u16"
            },
            {
                "name": "metadata",
                "type": "core::integer::u8"
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
        "type": "struct",
        "name": "survivor::adventurer::Adventurer",
        "members": [
            {
                "name": "last_action_block",
                "type": "core::integer::u16"
            },
            {
                "name": "health",
                "type": "core::integer::u16"
            },
            {
                "name": "xp",
                "type": "core::integer::u16"
            },
            {
                "name": "stats",
                "type": "survivor::stats::Stats"
            },
            {
                "name": "gold",
                "type": "core::integer::u16"
            },
            {
                "name": "weapon",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "chest",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "head",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "waist",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "foot",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "hand",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "neck",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "ring",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "beast_health",
                "type": "core::integer::u16"
            },
            {
                "name": "stat_points_available",
                "type": "core::integer::u8"
            },
            {
                "name": "actions_per_block",
                "type": "core::integer::u8"
            },
            {
                "name": "mutated",
                "type": "core::bool"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc::cc_interfaces::EnterResultCC",
        "members": [
            {
                "name": "cc_point",
                "type": "core::integer::u128"
            },
            {
                "name": "map_owner",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "struct",
        "name": "survivor::bag::Bag",
        "members": [
            {
                "name": "item_1",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_2",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_3",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_4",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_5",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_6",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_7",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_8",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_9",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_10",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "item_11",
                "type": "survivor::item_primitive::ItemPrimitive"
            },
            {
                "name": "mutated",
                "type": "core::bool"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc::cc_interfaces::AttackResultCC",
        "members": [
            {
                "name": "adventurer_health",
                "type": "core::integer::u16"
            },
            {
                "name": "beast_id",
                "type": "core::integer::u8"
            },
            {
                "name": "reward_item_id",
                "type": "core::integer::u8"
            }
        ]
    },
    {
        "type": "interface",
        "name": "cc::cc_interfaces::ICC",
        "items": [
            {
                "type": "function",
                "name": "get_cave_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "cc::cc_cave::CcCave"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_attacking_beast_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    },
                    {
                        "name": "adventurer_entropy",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "beasts::beast::Beast"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_beast_health_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u16"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "enter_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    },
                    {
                        "name": "cc_token_id",
                        "type": "core::integer::u256"
                    },
                    {
                        "name": "adventurer",
                        "type": "survivor::adventurer::Adventurer"
                    },
                    {
                        "name": "adventurer_entropy",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "cc::cc_interfaces::EnterResultCC"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "attack_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    },
                    {
                        "name": "to_the_death",
                        "type": "core::bool"
                    },
                    {
                        "name": "adv",
                        "type": "survivor::adventurer::Adventurer"
                    },
                    {
                        "name": "adventurer_entropy",
                        "type": "core::felt252"
                    },
                    {
                        "name": "bag",
                        "type": "survivor::bag::Bag"
                    }
                ],
                "outputs": [
                    {
                        "type": "cc::cc_interfaces::AttackResultCC"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "buff_adventurer_cc",
                "inputs": [
                    {
                        "name": "adventurer_id",
                        "type": "core::felt252"
                    },
                    {
                        "name": "buff_index",
                        "type": "core::integer::u8"
                    },
                    {
                        "name": "adv",
                        "type": "survivor::adventurer::Adventurer"
                    },
                    {
                        "name": "adventurer_entropy",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [
                    {
                        "type": "survivor::stats::Stats"
                    }
                ],
                "state_mutability": "external"
            }
        ]
    },
    {
        "type": "constructor",
        "name": "constructor",
        "inputs": []
    },
    {
        "type": "event",
        "name": "cc::cc::EnterCC",
        "kind": "struct",
        "members": [
            {
                "name": "cave",
                "type": "cc::cc_cave::CcCave",
                "kind": "data"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc::cc::AdventurerState",
        "members": [
            {
                "name": "owner",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "adventurer_id",
                "type": "core::felt252"
            },
            {
                "name": "adventurer",
                "type": "survivor::adventurer::Adventurer"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc::cc::BattleDetails",
        "members": [
            {
                "name": "seed",
                "type": "core::integer::u128"
            },
            {
                "name": "id",
                "type": "core::integer::u8"
            },
            {
                "name": "beast_specs",
                "type": "combat::combat::CombatSpec"
            },
            {
                "name": "damage",
                "type": "core::integer::u16"
            },
            {
                "name": "critical_hit",
                "type": "core::bool"
            },
            {
                "name": "location",
                "type": "core::integer::u8"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::AmbushedByBeastCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "beast_battle_details",
                "type": "cc::cc::BattleDetails",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::DiscoveredBeastCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "seed",
                "type": "core::integer::u128",
                "kind": "data"
            },
            {
                "name": "id",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "beast_specs",
                "type": "combat::combat::CombatSpec",
                "kind": "data"
            },
            {
                "name": "beast_heath",
                "type": "core::integer::u16",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::AttackedBeastCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "beast_battle_details",
                "type": "cc::cc::BattleDetails",
                "kind": "data"
            },
            {
                "name": "beast_health",
                "type": "core::integer::u16",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::AttackedByBeastCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "beast_battle_details",
                "type": "cc::cc::BattleDetails",
                "kind": "data"
            },
            {
                "name": "beast_health",
                "type": "core::integer::u16",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::SlayedBeastCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "seed",
                "type": "core::integer::u128",
                "kind": "data"
            },
            {
                "name": "id",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "beast_specs",
                "type": "combat::combat::CombatSpec",
                "kind": "data"
            },
            {
                "name": "damage_dealt",
                "type": "core::integer::u16",
                "kind": "data"
            },
            {
                "name": "critical_hit",
                "type": "core::bool",
                "kind": "data"
            },
            {
                "name": "xp_earned_adventurer",
                "type": "core::integer::u16",
                "kind": "data"
            },
            {
                "name": "xp_earned_items",
                "type": "core::integer::u16",
                "kind": "data"
            },
            {
                "name": "gold_earned",
                "type": "core::integer::u16",
                "kind": "data"
            },
            {
                "name": "curr_beast",
                "type": "core::integer::u16",
                "kind": "data"
            },
            {
                "name": "has_reward",
                "type": "core::integer::u16",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::AdventurerUpgradedCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState",
                "kind": "data"
            },
            {
                "name": "strength_increase",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "dexterity_increase",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "vitality_increase",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "intelligence_increase",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "wisdom_increase",
                "type": "core::integer::u8",
                "kind": "data"
            },
            {
                "name": "charisma_increase",
                "type": "core::integer::u8",
                "kind": "data"
            }
        ]
    },
    {
        "type": "struct",
        "name": "cc::cc::AdventurerStateWithBag",
        "members": [
            {
                "name": "adventurer_state",
                "type": "cc::cc::AdventurerState"
            },
            {
                "name": "bag",
                "type": "survivor::bag::Bag"
            }
        ]
    },
    {
        "type": "enum",
        "name": "combat::constants::CombatEnums::Slot",
        "variants": [
            {
                "name": "None",
                "type": "()"
            },
            {
                "name": "Weapon",
                "type": "()"
            },
            {
                "name": "Chest",
                "type": "()"
            },
            {
                "name": "Head",
                "type": "()"
            },
            {
                "name": "Waist",
                "type": "()"
            },
            {
                "name": "Foot",
                "type": "()"
            },
            {
                "name": "Hand",
                "type": "()"
            },
            {
                "name": "Neck",
                "type": "()"
            },
            {
                "name": "Ring",
                "type": "()"
            }
        ]
    },
    {
        "type": "struct",
        "name": "lootitems::loot::Loot",
        "members": [
            {
                "name": "id",
                "type": "core::integer::u8"
            },
            {
                "name": "tier",
                "type": "combat::constants::CombatEnums::Tier"
            },
            {
                "name": "item_type",
                "type": "combat::constants::CombatEnums::Type"
            },
            {
                "name": "slot",
                "type": "combat::constants::CombatEnums::Slot"
            }
        ]
    },
    {
        "type": "struct",
        "name": "market::market::LootWithPrice",
        "members": [
            {
                "name": "item",
                "type": "lootitems::loot::Loot"
            },
            {
                "name": "price",
                "type": "core::integer::u16"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::RewardItemsCC",
        "kind": "struct",
        "members": [
            {
                "name": "adventurer_state_with_bag",
                "type": "cc::cc::AdventurerStateWithBag",
                "kind": "data"
            },
            {
                "name": "items",
                "type": "core::array::Array::<market::market::LootWithPrice>",
                "kind": "data"
            }
        ]
    },
    {
        "type": "event",
        "name": "cc::cc::Event",
        "kind": "enum",
        "variants": [
            {
                "name": "EnterCC",
                "type": "cc::cc::EnterCC",
                "kind": "nested"
            },
            {
                "name": "AmbushedByBeastCC",
                "type": "cc::cc::AmbushedByBeastCC",
                "kind": "nested"
            },
            {
                "name": "DiscoveredBeastCC",
                "type": "cc::cc::DiscoveredBeastCC",
                "kind": "nested"
            },
            {
                "name": "AttackedBeastCC",
                "type": "cc::cc::AttackedBeastCC",
                "kind": "nested"
            },
            {
                "name": "AttackedByBeastCC",
                "type": "cc::cc::AttackedByBeastCC",
                "kind": "nested"
            },
            {
                "name": "SlayedBeastCC",
                "type": "cc::cc::SlayedBeastCC",
                "kind": "nested"
            },
            {
                "name": "AdventurerUpgradedCC",
                "type": "cc::cc::AdventurerUpgradedCC",
                "kind": "nested"
            },
            {
                "name": "RewardItemsCC",
                "type": "cc::cc::RewardItemsCC",
                "kind": "nested"
            }
        ]
    }
] as Abi;

const address = "0x060ab8abb42665a75134381cf0e04452363fd702e9bf883e0c1214517f67bc77";

export const load_cc = async (adventurer_id: number) => {


    let provider = new Provider({
        rpc: {
            nodeUrl: "https://starknet-goerli.infura.io/v3/89d267bf72f346b78cf8a86415c6008a",
        }
    });

    let cc_logic_contract = new Contract(abi, address, provider);

    let cave_result = await cc_logic_contract.get_cave_cc(adventurer_id);
    const adventurer_entropy = 0;

    let beast_result = await cc_logic_contract.get_attacking_beast_cc(adventurer_id, adventurer_entropy);
    console.log(beast_result);


    const cave = {
        "map_id": Number(cave_result.map_id),
        "curr_beast": Number(cave_result.curr_beast),
        "cc_points": Number(cave_result.cc_points),
        "beast_health": Number(cave_result.beast_health),
        "beast_amount": Number(cave_result.beast_amount),
        "has_reward": Number(cave_result.has_reward),
        "strength_increase": Number(cave_result.strength_increase),
        "dexterity_increase": Number(cave_result.dexterity_increase),
        "vitality_increase": Number(cave_result.vitality_increase),
        "intelligence_increase": Number(cave_result.intelligence_increase),
        "wisdom_increase": Number(cave_result.wisdom_increase),
        "charisma_increase": Number(cave_result.charisma_increase),
    };

    const gameData = new GameData();
    const beast_id = Number(beast_result.id);
    const beast_name = gameData.BEASTS[beast_id];

    const beast = {
        "beast": beast_name,
        "health": cave.beast_health,
        "level": Number(beast_result.combat_spec.level),
        "adventurerId": adventurer_id,
    }

    return {
        cave: cave,
        beast: beast
    }
}