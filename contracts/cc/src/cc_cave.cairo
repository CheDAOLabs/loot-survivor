use core::result::ResultTrait;
use integer::{u8_overflowing_add, u16_overflowing_add, u16_overflowing_sub};
use traits::{TryInto, Into};
use option::OptionTrait;
use poseidon::poseidon_hash_span;
use array::ArrayTrait;

// use super::{
//     item_meta::{ItemSpecials, ItemSpecialsStorage, ImplItemSpecials}, adventurer_stats::Stats,
//     item_primitive::ItemPrimitive, adventurer_utils::{AdventurerUtils}, exploration::ExploreUtils,
//     bag::{Bag, IBag, ImplBag},
//
// };

use pack::{pack::{Packing, rshift_split}, constants::{MASK_16, pow, MASK_8, MASK_BOOL, mask}};
use lootitems::{
    loot::{Loot, ILoot, ImplLoot},
    constants::{ItemSuffix, ItemId, NamePrefixLength, NameSuffixLength},
};
use combat::{
    combat::{ImplCombat, CombatSpec, SpecialPowers}, constants::CombatEnums::{Type, Tier, Slot},
};
use obstacles::obstacle::{ImplObstacle, Obstacle};
use beasts::{beast::{ImplBeast, Beast}, constants::BeastSettings};

#[derive(Drop, Copy, Serde)]
struct CcCave {
    map_id:u16,//9 bits
    curr_beast:u16,
    cc_points:u16,
    beast_health:u16, // 9 bits
    beast_amount:u16,
    beast_id: u16, // 9 bits
}

impl CcCavePacking of Packing<CcCave> {
    fn pack(self: CcCave) -> felt252 {
        (self.map_id.into()
            + self.curr_beast.into() * pow::TWO_POW_9
            + self.cc_points.into() * pow::TWO_POW_18
            + self.beast_health.into() * pow::TWO_POW_27
            + self.beast_amount.into() * pow::TWO_POW_36
            + self.beast_id.into() * pow::TWO_POW_45
        ).try_into().expect('pack cc_cave')
    }
    fn unpack(packed: felt252) -> CcCave {
        let packed = packed.into();
        let (packed, map_id) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, curr_beast) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, cc_points) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, beast_health) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, beast_amount) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, beast_id) = rshift_split(packed, pow::TWO_POW_9);

        CcCave {
            map_id: map_id.try_into().expect('unpack cc_cave map_id'),
            curr_beast: curr_beast.try_into().expect('unpack cc_cave curr_beast'),
            cc_points: cc_points.try_into().expect('unpack cc_cave cc_points'),
            beast_health: beast_health.try_into().expect('unpack cc_cave beast_health'),
            beast_amount: beast_amount.try_into().expect('unpack cc_cave beast_amount'),
            beast_id: beast_id.try_into().expect('unpack cc_cave beast_id'),
        }
    }
    // TODO: add overflow pack protection
    fn overflow_pack_protection(self: CcCave) -> CcCave {
        self
    }
}

#[generate_trait]
impl ImplCcCave of ICcCave {
    fn new(map_id:u16,cc_points:u16)->CcCave{
        CcCave{
            map_id: map_id,
            curr_beast: 0,
            cc_points: cc_points,
            beast_health: 0,
            beast_amount: ImplCcCave::get_beast_amount(cc_points),
            beast_id: 0,
        }
    }

    fn get_beast_amount(points: u16) -> u16 {
        // 怪物数量=(point点数 mod 4) + 3
        return (points % 4) + 3;
    }

    fn get_beast_level(self: CcCave, seed: u128, points: u16) -> u16 {
        // 当points（0|3），randomNumber=3|5
        // 当points（3|8），randomNumber=2|5
        // 当points（8|12），randomNumber=1|4
        if points < 3 {
            return 3 + (seed % 3).try_into().unwrap();
        } else if points < 8 {
            return 2 + (seed % 4).try_into().unwrap();
        } else if points < 12 {
            return 1 + (seed % 4).try_into().unwrap();
        } else {
            return 0;
        }
    }

    // Sets the beast's health to a specified amount, preventing overflow.
    // @param self: Adventurer to set beast health for
    // @param amount: Amount of health to set the beast's health to
    #[inline(always)]
    fn set_beast_health(ref self: CcCave, amount: u16) {
        // check for overflow
        // we currently use 9 bits for beast health so MAX HEALTH is 2^9 - 1
        if (amount > BeastSettings::MAXIMUM_HEALTH) {
            self.beast_health = BeastSettings::MAXIMUM_HEALTH;
        } else {
            self.beast_health = amount;
        }
    }

        // @notice get_beast_seed provides an entropy source that is fixed during battle
        // it intentionally does not use global_entropy as that could change during battle and this
        // entropy allows us to simulate a persistent battle without having to store beast
        // details on-chain.
        // @param self A reference to the Adventurer object which represents the adventurer.
        // @param adventurer_entropy A number used for randomization.
        // @return Returns a number used for generated a random beast.
        fn get_beast_seed(self: CcCave, adventurer_entropy: u128) -> u128 {
            if self.map_id > 0 {
                let mut hash_span = ArrayTrait::new();
                hash_span.append(self.map_id.into());
                hash_span.append(self.curr_beast.into());
                hash_span.append(adventurer_entropy.into());
                let poseidon = poseidon_hash_span(hash_span.span());
                let (d, r) = rshift_split(poseidon.into(), 340282366920938463463374607431768211455);
                r.try_into().unwrap()
            } else {
                0
            }
        }

    fn get_beast(self: CcCave,adventurer_entropy: u128) -> (Beast, u128) {
        let beast_seed = self.get_beast_seed(adventurer_entropy);
        let adventurer_level = 1;//self.get_level();

        // @dev ideally this would be a setting but to minimize gas we're using hardcoded value so we can use cheaper equal operator

        let beast_id = ImplBeast::get_beast_id(beast_seed);
        let starting_health = ImplBeast::get_starting_health(adventurer_level, beast_seed);
        let beast_tier = ImplBeast::get_tier(beast_id);
        let beast_type = ImplBeast::get_type(beast_id);
        let beast_level = self.get_beast_level(beast_seed, self.cc_points);
        let mut special_names = SpecialPowers { special1: 0, special2: 0, special3: 0 };

        // if (beast_level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK) {
        //     special_names =
        //         ImplBeast::get_special_names(
        //             adventurer_level,
        //             beast_seed,
        //             NamePrefixLength.into(),
        //             NameSuffixLength.into(),
        //         );
        // }

        let beast = Beast {
            id: beast_id,
            starting_health: starting_health,
            combat_spec: CombatSpec {
                tier: beast_tier,
                item_type: beast_type,
                level: beast_level,
                specials: special_names,
            },
        };

        (beast, beast_seed)
    }
}


#[cfg(test)]
mod tests {
    use debug::PrintTrait;

    // #[test]
    // #[available_gas(555600)]
    // fn test_cc_get_beast() {
    //     cc_get_beast(1);
    // }

    fn get_beast_amount(seed: u16, points: u16) -> u16 {
        // 怪物数量=(point点数 mod 4) + 3
        return (points % 4) + 3;
    }

    fn get_beast_level(seed: u128, points: u16) -> u16 {
        // 当points（0|3），randomNumber=3|5
        // 当points（3|8），randomNumber=2|5
        // 当points（8|12），randomNumber=1|4
        if points < 3 {
            return 3 + (seed % 3).try_into().unwrap();
        } else if points < 8 {
            return 2 + (seed % 4).try_into().unwrap();
        } else if points < 12 {
            return 1 + (seed % 4).try_into().unwrap();
        } else {
            return 0;
        }

    }

    #[test]
    #[available_gas(555600)]
    fn test_get_beast_level() {
        let beast_level = get_beast_level(1, 3);
        beast_level.print();

        // let x = 12;
        // x.print();
    }
}
