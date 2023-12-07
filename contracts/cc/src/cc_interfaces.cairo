use starknet::ContractAddress;

use beasts::beast::Beast;
use game_entropy::game_entropy::{GameEntropy};
use market::market::{ItemPurchase};
use survivor::{
    bag::Bag, adventurer::{Adventurer, Stats}, adventurer_meta::AdventurerMetadata,
    item_meta::{ItemSpecials, ItemSpecialsStorage}, leaderboard::Leaderboard,
    item_primitive::{ItemPrimitive},
};
use game_snapshot::GamesPlayedSnapshot;
use lootitems::loot::{Loot};
use cc::cc_cave::{CcCave, ImplCcCave, ICcCave};


#[derive(Drop, Copy, Serde)]
struct EnterResultCC {
    cc_point: u128,
    map_owner:ContractAddress
}

#[derive(Drop, Copy, Serde)]
struct AttackResultCC {
    adventurer_health: u16,
    bag:Bag
}

#[starknet::interface]
trait ICC<TContractState> {


    fn get_cave_cc(self: @ TContractState, adventurer_id: felt252) -> CcCave;
    fn get_attacking_beast_cc(self: @ TContractState, adventurer_id: felt252, adventurer_entropy: felt252) -> Beast;
    fn get_beast_health_cc(self: @ TContractState, adventurer_id: felt252) -> u16;
    fn enter_cc(ref self: TContractState, adventurer_id: felt252, cc_token_id: u256, adventurer: Adventurer, adventurer_entropy: felt252) -> EnterResultCC;
    fn attack_cc(ref self: TContractState, adventurer_id: felt252, to_the_death: bool, adv: Adventurer, adventurer_entropy:felt252,bag:Bag) -> AttackResultCC;
    fn buff_adventurer_cc(ref self: TContractState, adventurer_id: felt252, buff_index:u8,adv: Adventurer, adventurer_entropy:felt252) -> Stats;
}
