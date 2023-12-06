mod interfaces;
mod resource;
mod cc_cave;
mod cc_buff;

#[starknet::contract]
mod cc {

    use core::{
        array::{SpanTrait, ArrayTrait}, integer::u256_try_as_non_zero, traits::{TryInto, Into},
        clone::Clone, poseidon::poseidon_hash_span, option::OptionTrait, box::BoxTrait,
        starknet::{
            get_caller_address, ContractAddress, ContractAddressIntoFelt252, contract_address_const,
            get_block_timestamp, info::BlockInfo
        },
    };

    use survivor::{
        bag::Bag, adventurer::{Adventurer, Stats}, adventurer_meta::AdventurerMetadata,
        item_meta::{ItemSpecials, ItemSpecialsStorage}, leaderboard::Leaderboard,
        item_primitive::{ItemPrimitive}
    };

    use combat::{
        combat::{CombatSpec, SpecialPowers, ImplCombat},
        constants::{CombatSettings::STRENGTH_DAMAGE_BONUS, CombatEnums::{Slot, Tier, Type}}
    };

    use market::{
        market::{ImplMarket, LootWithPrice, ItemPurchase},
        constants::{NUMBER_OF_ITEMS_PER_LEVEL, TIER_PRICE},
    };

    use cc::resource::{
        CryptsAndCavernsTraitDispatcher, CryptsAndCavernsTraitDispatcherTrait, DungeonSerde,
        DungeonDojo, Name, EntityDataSerde, Pack
    };

    use cc::cc_cave::{CcCave, ImplCcCave, ICcCave};
    use cc::cc_buff::{CcBuff,get_buff_by_id};

    #[storage]
    struct Storage {
        _cc_cave: LegacyMap::<felt252, CcCave>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EnterCC:EnterCC,
        AmbushedByBeastCC: AmbushedByBeastCC,
        DiscoveredBeastCC: DiscoveredBeastCC,
        AttackedBeastCC: AttackedBeastCC,
        AttackedByBeastCC: AttackedByBeastCC,
        SlayedBeastCC: SlayedBeastCC,
        AdventurerUpgradedCC: AdventurerUpgradedCC,
        RewardItemsCC: RewardItemsCC,
    }


    #[derive(Copy, Drop, Serde, starknet::Event)]
    struct AdventurerState {
        owner: ContractAddress,
        adventurer_id: felt252,
        adventurer: Adventurer
    }

    #[derive(Copy, Drop, Serde, starknet::Event)]
    struct AdventurerStateWithBag {
        adventurer_state: AdventurerState,
        bag: Bag
    }


    #[derive(Drop, starknet::Event)]
    struct EnterCC{
        cave:CcCave
    }


    #[derive(Drop, starknet::Event)]
    struct DiscoveredBeastCC {
        adventurer_state: AdventurerState,
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        beast_heath:u16
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct BattleDetails {
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        damage: u16,
        critical_hit: bool,
        location: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct AmbushedByBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
    }

    #[derive(Drop, starknet::Event)]
    struct AttackedBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
        beast_health:u16
    }

    #[derive(Drop, starknet::Event)]
    struct AttackedByBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
    }

    #[derive(Drop, starknet::Event)]
    struct SlayedBeastCC {
        adventurer_state: AdventurerState,
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        damage_dealt: u16,
        critical_hit: bool,
        xp_earned_adventurer: u16,
        xp_earned_items: u16,
        gold_earned: u16,
        curr_beast: u16,
        has_reward:u16
    }

    #[derive(Drop, starknet::Event)]
    struct RewardItemsCC {
        adventurer_state_with_bag: AdventurerStateWithBag,
        items: Array<LootWithPrice>,
    }

    #[derive(Drop, starknet::Event)]
    struct AdventurerUpgradedCC {
        adventurer_state_with_bag: AdventurerStateWithBag,
        strength_increase: u8,
        dexterity_increase: u8,
        vitality_increase: u8,
        intelligence_increase: u8,
        wisdom_increase: u8,
        charisma_increase: u8,
    }

    fn get_cave_cc(self: @ContractState, adventurer_id: felt252) -> CcCave {
        let cc_cave = _unpack_cc_cave(self, adventurer_id);
        cc_cave
    }

    fn _unpack_cc_cave(self: @ContractState, adventurer_id: felt252) -> CcCave {
        let cc_cave = self._cc_cave.read(adventurer_id);
        cc_cave
    }
}