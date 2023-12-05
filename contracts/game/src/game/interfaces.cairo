use starknet::ContractAddress;

use beasts::beast::Beast;
use game_entropy::game_entropy::{GameEntropy};
use market::market::{ItemPurchase};
use survivor::{
    bag::Bag, adventurer::{Adventurer, Stats}, adventurer_meta::AdventurerMetadata,
    item_meta::{ItemSpecials, ItemSpecialsStorage}
};
use game_snapshot::GamesPlayedSnapshot;
use lootitems::loot::{Loot};
use market::market::{ItemPurchase};
use beasts::beast::Beast;
use cc::cc_cave::{CcCave, ImplCcCave, ICcCave};

#[starknet::interface]
trait IGame<TContractState> {
    // ------ Game Actions ------
    fn new_game(
        ref self: TContractState, client_reward_address: ContractAddress, weapon: u8, name: u128, golden_token_id: u256, interface_camel: bool
    );
    fn explore(ref self: TContractState, adventurer_id: felt252, till_beast: bool);
    fn attack(ref self: TContractState, adventurer_id: felt252, to_the_death: bool);
    fn flee(ref self: TContractState, adventurer_id: felt252, to_the_death: bool);
    fn equip(ref self: TContractState, adventurer_id: felt252, items: Array<u8>);
    fn drop(ref self: TContractState, adventurer_id: felt252, items: Array<u8>);
    fn upgrade(
        ref self: TContractState,
        adventurer_id: felt252,
        potions: u8,
        stat_upgrades: Stats,
        items: Array<ItemPurchase>,
    );
    fn slay_idle_adventurers(ref self: TContractState, adventurer_ids: Array<felt252>);
    fn rotate_game_entropy(ref self: TContractState);
    fn update_cost_to_play(ref self: TContractState);
    fn initiate_price_change(ref self: TContractState);

    // ------ View Functions ------

    // adventurer details
    fn get_adventurer(self: @TContractState, adventurer_id: felt252) -> Adventurer;
    fn get_adventurer_no_boosts(self: @TContractState, adventurer_id: felt252) -> Adventurer;
    fn get_adventurer_meta(self: @TContractState, adventurer_id: felt252) -> AdventurerMetadata;
    fn get_health(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_xp(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_level(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_gold(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_stat_upgrades_available(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_last_action_block(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_actions_per_block(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_reveal_block(self: @TContractState, adventurer_id: felt252) -> u64;
    fn is_idle(self: @TContractState, adventurer_id: felt252) -> (bool, u16);

    // adventurer stats (includes boost)
    fn get_stats(self: @TContractState, adventurer_id: felt252) -> Stats;
    fn get_strength(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_dexterity(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_vitality(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_intelligence(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_wisdom(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_charisma(self: @TContractState, adventurer_id: felt252) -> u8;

    // item details
    fn get_equipped_items(self: @TContractState, adventurer_id: felt252) -> Array<ItemPrimitive>;
    fn get_equipped_weapon(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_chest(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_head(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_waist(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_foot(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_hand(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_necklace(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;
    fn get_equipped_ring(self: @TContractState, adventurer_id: felt252) -> ItemPrimitive;

    // item stats
    fn get_weapon_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_chest_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_head_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_waist_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_foot_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_hand_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_necklace_greatness(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_ring_greatness(self: @TContractState, adventurer_id: felt252) -> u8;

    // bag and specials
    fn get_bag(self: @TContractState, adventurer_id: felt252) -> Bag;
    fn get_special_storage(
        self: @TContractState, adventurer_id: felt252, storage_index: u8
    ) -> ItemSpecialsStorage;

    // item details
    fn get_weapon_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_chest_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_head_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_waist_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_foot_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_hand_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_necklace_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;
    fn get_ring_specials(self: @TContractState, adventurer_id: felt252) -> ItemSpecials;

    // market details
    fn get_items_on_market(self: @TContractState, adventurer_id: felt252) -> Array<u8>;
    fn get_items_on_market_by_slot(
        self: @TContractState, adventurer_id: felt252, slot: u8
    ) -> Array<u8>;
    fn get_items_on_market_by_tier(
        self: @TContractState, adventurer_id: felt252, tier: u8
    ) -> Array<u8>;
    fn get_potion_price(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_item_price(self: @TContractState, adventurer_id: felt252, item_id: u8) -> u16;

    // adventurer stats (no boosts)
    fn get_base_stats(self: @TContractState, adventurer_id: felt252) -> Stats;
    fn get_base_strength(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_base_dexterity(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_base_vitality(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_base_intelligence(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_base_wisdom(self: @TContractState, adventurer_id: felt252) -> u8;
    fn get_base_charisma(self: @TContractState, adventurer_id: felt252) -> u8;

    // beast details
    fn get_attacking_beast(self: @TContractState, adventurer_id: felt252) -> Beast;
    fn get_beast_health(self: @TContractState, adventurer_id: felt252) -> u16;
    fn get_beast_type(self: @TContractState, beast_id: u8) -> u8;
    fn get_beast_tier(self: @TContractState, beast_id: u8) -> u8;

    // cc
    fn get_cave_cc(self: @TContractState, adventurer_id: u256) -> CcCave;
    fn enter_cc(ref self: TContractState, adventurer_id:u256, cc_token_id :u256) -> u128;
    fn attack_cc(ref self: TContractState, adventurer_id: u256, to_the_death: bool);
    fn set_beast_heath_cc(ref self: TContractState, adventurer_id: u256, health: u16);
    fn get_attacking_beast_cc(self: @TContractState, adventurer_id: u256) -> Beast;
    fn get_beast_health_cc(self: @TContractState, adventurer_id: u256) -> u16;

    // TODO: Game settings
    fn next_global_entropy_rotation(self: @TContractState) -> felt252;

    // contract details
    fn get_dao_address(self: @TContractState) -> ContractAddress;
    fn get_lords_address(self: @TContractState) -> ContractAddress;
    fn get_entropy(self: @TContractState) -> u64;    

    // checks ----------------------------------------------------
    fn owner_of(self: @TContractState, adventurer_id: u256) -> ContractAddress;
}
