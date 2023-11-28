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
    has_reward: u16, // 9 bits
    strength_increase: u16, // 9 bits
    dexterity_increase: u16, // 9 bits
    vitality_increase: u16, // 9 bits
    intelligence_increase: u16, // 9 bits
    wisdom_increase: u16, // 9 bits
    charisma_increase: u16, // 9 bits
    buff_1:u16,
    buff_2:u16,
    buff_3:u16
}

impl CcCavePacking of Packing<CcCave> {
    fn pack(self: CcCave) -> felt252 {
        (self.map_id.into()
            + self.curr_beast.into() * pow::TWO_POW_9
            + self.cc_points.into() * pow::TWO_POW_18
            + self.beast_health.into() * pow::TWO_POW_27
            + self.beast_amount.into() * pow::TWO_POW_36
            + self.has_reward.into() * pow::TWO_POW_45
            + self.strength_increase.into() * pow::TWO_POW_54
            + self.dexterity_increase.into() * pow::TWO_POW_63
            + self.vitality_increase.into() * pow::TWO_POW_72
            + self.intelligence_increase.into() * pow::TWO_POW_81
            + self.wisdom_increase.into() * pow::TWO_POW_90
            + self.charisma_increase.into() * pow::TWO_POW_99
            + self.buff_1.into() * pow::TWO_POW_108
            + self.buff_2.into() * pow::TWO_POW_117
            + self.buff_3.into() * pow::TWO_POW_126
        ).try_into().expect('pack cc_cave')
    }
    fn unpack(packed: felt252) -> CcCave {
        let packed = packed.into();
        let (packed, map_id) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, curr_beast) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, cc_points) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, beast_health) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, beast_amount) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, has_reward) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, strength_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, dexterity_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, vitality_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, intelligence_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, wisdom_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, charisma_increase) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, buff_1) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, buff_2) = rshift_split(packed, pow::TWO_POW_9);
        let (packed, buff_3) = rshift_split(packed, pow::TWO_POW_9);

        CcCave {
            map_id: map_id.try_into().expect('unpack cc_cave map_id'),
            curr_beast: curr_beast.try_into().expect('unpack cc_cave curr_beast'),
            cc_points: cc_points.try_into().expect('unpack cc_cave cc_points'),
            beast_health: beast_health.try_into().expect('unpack cc_cave beast_health'),
            beast_amount: beast_amount.try_into().expect('unpack cc_cave beast_amount'),
            has_reward: has_reward.try_into().expect('unpack cc_cave has_reward'),
            strength_increase: strength_increase.try_into().expect('unpack cc_cave strength'),
            dexterity_increase: dexterity_increase.try_into().expect('unpack cc_cave dexterity'),
            vitality_increase: vitality_increase.try_into().expect('unpack cc_cave vitality'),
            intelligence_increase: intelligence_increase.try_into().expect('unpack cc_cave intelligence'),
            wisdom_increase: wisdom_increase.try_into().expect('unpack cc_cave wisdom'),
            charisma_increase: charisma_increase.try_into().expect('unpack cc_cave charisma'),
            buff_1: buff_1.try_into().expect('unpack cc_cave buff_1'),
            buff_2: buff_2.try_into().expect('unpack cc_cave buff_2'),
            buff_3: buff_3.try_into().expect('unpack cc_cave buff_3'),
        }
    }

    // TODO: add overflow pack protection
    fn overflow_pack_protection(self: CcCave) -> CcCave {
        self
    }
}

#[generate_trait]
impl ImplCcCave of ICcCave {
    fn increase_strength(ref self: CcCave,amount:u8) -> u16{
        self.strength_increase = self.strength_increase + amount.into();
        self.strength_increase
    }

    fn increase_dexterity(ref self: CcCave,amount:u8) -> u16{
        self.dexterity_increase = self.dexterity_increase + amount.into();
        self.dexterity_increase
    }

    fn increase_vitality(ref self: CcCave,amount:u8) -> u16{
        self.vitality_increase = self.vitality_increase + amount.into();
        self.vitality_increase
    }

    fn increase_intelligence(ref self: CcCave,amount:u8) -> u16{
        self.intelligence_increase = self.intelligence_increase + amount.into();
        self.intelligence_increase
    }

    fn increase_wisdom(ref self: CcCave,amount:u8) -> u16{
        self.wisdom_increase = self.wisdom_increase + amount.into();
        self.wisdom_increase
    }

    fn increase_charisma(ref self: CcCave,amount:u8) -> u16{
        self.charisma_increase = self.charisma_increase + amount.into();
        self.charisma_increase
    }

    fn get_beast_amount(points: u16) -> u16 {
        // 怪物数量=(point点数 mod 4) + 3
        return (points % 4) + 3;
    }

    fn get_beast_level(self: CcCave, seed: u128) -> u16 {
        // 当points（0|3），randomNumber=3|5
        // 当points（3|8），randomNumber=2|5
        // 当points（8|12），randomNumber=1|4
        if self.cc_points < 3 {
            return 3 + (seed % 3).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 2 + (seed % 4).try_into().unwrap();
        } else if self.cc_points < 12 {
            return 1 + (seed % 4).try_into().unwrap();
        } else {
            return 0;
        }
    }

    fn get_item_amount(self:CcCave, seed:u128)->u8{
        // 装备数量
        // 当points（0|3），randomNumber=0|2
        // 当points（3|5），randomNumber=1|2
        // 当points（5|8），randomNumber=1|3
        // 当points（8|11），randomNumber=2|3
        // 当points（12），randomNumber=3|5
        if self.cc_points < 3 {
            //return (seed % 3).try_into().unwrap();
            return 1+(seed % 3).try_into().unwrap();
        } else if self.cc_points < 5 {
            return 1 + (seed % 2).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 1 + (seed % 3).try_into().unwrap();
        } else if self.cc_points < 11 {
            return 2 + (seed % 2).try_into().unwrap();
        } else {
            return 3 + (seed % 3).try_into().unwrap();
        }
    }

    fn get_item_level(self:CcCave,seed:u128)->u8{
        // points（0|3），randomNumber=5|4
        // 当points（3|5），randomNumber=5|3
        // 当points（5|8），randomNumber=4|2
        // 当points（8|11），randomNumber=4|1
        // 当points（12），randomNumber=3|1
        if self.cc_points < 3 {
            return 5 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 5 {
            return 5 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 4 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 11 {
            return 4 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 12{
            return 3 - (seed % 2).try_into().unwrap();
        }

        return 0;
    }

    fn get_item_id(self:CcCave, level:u8 , seed:u128)->u8{
        if level == 1 {
            return self.get_item_id_t1(seed);
        }
        if level == 2 {
            return self.get_item_id_t2(seed);
        }
        if level == 3 {
           return self.get_item_id_t3(seed);
        }
        if level == 4 {
           return self.get_item_id_t4(seed);
        }
        if level == 5 {
           return self.get_item_id_t5(seed);
        }
        return 0;
    }

    fn get_item_id_t1(self:CcCave, seed:u128)->u8{
        // 1,2,3,6,7,8,9,13,17,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97 => 25
        let selected=seed % 25;
        if selected == 0 {
            return 1;
        }else if selected == 2{
            return 2;
        }else if selected == 3{
            return 3;
        }else if selected == 6{
            return 6;
        }else if selected == 7{
            return 7;
        }else if selected == 8{
            return 8;
        } else if selected == 9 {
            return 9;
        } else if selected == 10{
            return 13;
        } else if selected == 11{
            return 17;
        } else if selected == 12{
            return 27;
        } else if selected == 13{
            return 32;
        } else if selected == 14{
            return 37;
        } else if selected == 15{
            return 42;
        } else if selected == 16{
            return 47;
        } else if selected == 17{
            return 52;
        } else if selected == 18{
            return 57;
        } else if selected == 19{
            return 62;
        } else if selected == 20{
            return 67;
        } else if selected == 21{
            return 72;
        } else if selected == 22{
            return 77;
        } else if selected == 23{
            return 82;
        } else if selected == 24{
            return 87;
        } else if selected == 25{
            return 92;
        } else if selected == 26{
            return 97;
        }

        return 0;
    }

    fn get_item_id_t2(self:CcCave, seed:u128)->u8{
        // 4,10,14,18,23,28,33,38,43,48,53,58,63,68,73,78,83,88,93,98 => 20

        let selected=seed % 20;
        if selected == 0 {
            return 4;
        }else if selected == 2{
            return 10;
        }else if selected == 3{
            return 14;
        }else if selected == 6{
            return 18;
        }else if selected == 7{
            return 23;
        }else if selected == 8{
            return 28;
        } else if selected == 9 {
            return 33;
        } else if selected == 10{
            return 38;
        } else if selected == 11{
            return 43;
        } else if selected == 12{
            return 48;
        } else if selected == 13{
            return 53;
        } else if selected == 14{
            return 58;
        } else if selected == 15{
            return 63;
        } else if selected == 16{
            return 68;
        } else if selected == 17{
            return 73;
        } else if selected == 18{
            return 78;
        } else if selected == 19{
            return 83;
        } else if selected == 20{
            return 88;
        } else if selected == 21{
            return 93;
        } else if selected == 22{
            return 98;
        }

        return 0;
    }

    fn get_item_id_t3(self:CcCave, seed:u128)->u8{
        // 5,11,15,19,24,29,34,39,44,49,54,59,64,69,74,79,84,89,94,99 => 20

        let selected=seed % 20;
        if selected == 0 {
            return 5;
        }else if selected == 2{
            return 11;
        }else if selected == 3{
            return 15;
        }else if selected == 6{
            return 19;
        }else if selected == 7{
            return 24;
        }else if selected == 8{
            return 29;
        } else if selected == 9 {
            return 34;
        } else if selected == 10{
            return 39;
        } else if selected == 11{
            return 44;
        } else if selected == 12{
            return 49;
        } else if selected == 13{
            return 54;
        } else if selected == 14{
            return 59;
        } else if selected == 15{
            return 64;
        } else if selected == 16{
            return 69;
        } else if selected == 17{
            return 74;
        } else if selected == 18{
            return 79;
        } else if selected == 19{
            return 84;
        } else if selected == 20{
            return 89;
        } else if selected == 21{
            return 94;
        } else if selected == 22{
            return 99;
        }

        return 0;
    }

    fn get_item_id_t4(self:CcCave, seed:u128)->u8{
        // 20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100 => 17

        let selected=seed % 17;
        if selected == 0 {
            return 20;
        }else if selected == 2{
            return 25;
        }else if selected == 3{
            return 30;
        }else if selected == 6{
            return 35;
        }else if selected == 7{
            return 40;
        }else if selected == 8{
            return 45;
        } else if selected == 9 {
            return 50;
        } else if selected == 10{
            return 55;
        } else if selected == 11{
            return 60;
        } else if selected == 12{
            return 65;
        } else if selected == 13{
            return 70;
        } else if selected == 14{
            return 75;
        } else if selected == 15{
            return 80;
        } else if selected == 16{
            return 85;
        } else if selected == 17{
            return 90;
        } else if selected == 18{
            return 95;
        } else if selected == 19{
            return 100;
        }

        return 0;
    }

    fn get_item_id_t5(self:CcCave, seed:u128)->u8{
        // 12,16,21,26,31,36,41,46,51,56,61,66,71,76,81,86,91,96,101 => 19

        let selected=seed % 19;
        if selected == 0 {
            return 12;
        }else if selected == 2{
            return 16;
        }else if selected == 3{
            return 21;
        }else if selected == 6{
            return 26;
        }else if selected == 7{
            return 31;
        }else if selected == 8{
            return 36;
        } else if selected == 9 {
            return 41;
        } else if selected == 10{
            return 46;
        } else if selected == 11{
            return 51;
        } else if selected == 12{
            return 56;
        } else if selected == 13{
            return 61;
        } else if selected == 14{
            return 66;
        } else if selected == 15{
            return 71;
        } else if selected == 16{
            return 76;
        } else if selected == 17{
            return 81;
        } else if selected == 18{
            return 86;
        } else if selected == 19{
            return 91;
        } else if selected == 20{
            return 96;
        } else if selected == 21{
            return 101;
        }

        return 0;
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
                let (d, r) = rshift_split(poseidon.into(), 203363082831567469464458176037923362441);
                r.try_into().unwrap()
            } else {
                0
            }
        }

    fn get_reward_seed(self: CcCave, adventurer_entropy: u128,index:u8) -> u128 {
            let mut hash_span = ArrayTrait::new();
            hash_span.append(self.map_id.into());
            hash_span.append(self.curr_beast.into());
            hash_span.append(adventurer_entropy.into());
            hash_span.append(index.into());
            let poseidon = poseidon_hash_span(hash_span.span());
            let (d, r) = rshift_split(poseidon.into(), 724950043567312766233463464894128360813);
            r.try_into().unwrap()
    }

    fn get_buff_seed(self: CcCave, adventurer_entropy: u128,index:u8) -> u16 {
        let mut hash_span = ArrayTrait::new();
        hash_span.append(self.map_id.into());
        hash_span.append(self.curr_beast.into());
        hash_span.append(adventurer_entropy.into());
        hash_span.append(index.into());
        let poseidon = poseidon_hash_span(hash_span.span());
        let (d, r) = rshift_split(poseidon.into(), 674546095234706718430236841283393614263);
        let seed:u128 = r.try_into().unwrap();

        return (seed % 6).try_into().unwrap();
    }

    fn get_beast(self: CcCave,adventurer_entropy: u128) -> (Beast, u128) {
        let beast_seed = self.get_beast_seed(adventurer_entropy);
        let adventurer_level = 1;//self.get_level();

        // @dev ideally this would be a setting but to minimize gas we're using hardcoded value so we can use cheaper equal operator

        let beast_id = ImplBeast::get_beast_id(beast_seed);
        let starting_health = 1;//ImplBeast::get_starting_health(adventurer_level, beast_seed);
        let beast_tier = ImplBeast::get_tier(beast_id);
        let beast_type = ImplBeast::get_type(beast_id);
        let beast_level = self.get_beast_level(beast_seed);
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
