
use starknet::ContractAddress;

use beasts::beast::Beast;
use game_entropy::game_entropy::{GameEntropy};
use market::market::{ItemPurchase};
use survivor::{
    bag::Bag, adventurer::{Adventurer, Stats}, adventurer_meta::AdventurerMetadata,
    item_meta::{ItemSpecials, ItemSpecialsStorage}, leaderboard::Leaderboard,
    item_primitive::{ItemPrimitive}
};
use game_snapshot::GamesPlayedSnapshot;
use lootitems::loot::{Loot};
use cc::cc_cave::{CcCave, ImplCcCave, ICcCave};


#[starknet::interface]
trait ICC<TContractState> {
    fn get_cave_cc(self: @TContractState, adventurer_id: felt252) -> CcCave;
    fn enter_cc(ref self: TContractState, adventurer_id:felt252, cc_token_id :u256) -> u128;
    fn attack_cc(ref self: TContractState, adventurer_id: felt252, to_the_death: bool);
}
