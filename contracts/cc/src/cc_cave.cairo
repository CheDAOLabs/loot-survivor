use core::{
    array::ArrayTrait,
    integer::{u8_overflowing_add, u16_overflowing_add, u16_overflowing_sub, u256_try_as_non_zero},
    option::OptionTrait, poseidon::poseidon_hash_span, result::ResultTrait,
    starknet::{StorePacking}, traits::{TryInto, Into}
};

use combat::{
    combat::{ImplCombat, CombatSpec, SpecialPowers}, constants::CombatEnums::{Type, Tier, Slot},
};
use beasts::{beast::{ImplBeast, Beast}, constants::BeastSettings};

const U128_MAX: u128 = 340282366920938463463374607431768211455;
const TWO_POW_9: u256 = 0x200; // 2^9
const TWO_POW_18: u256 = 0x40000; // 2^18
const TWO_POW_27: u256 = 0x8000000; // 2^27
const TWO_POW_36: u256 = 0x1000000000; // 2^36
const TWO_POW_37: u256 = 0x2000000000; // 2^37
const TWO_POW_45: u256 = 0x200000000000; // 2^45
const TWO_POW_54: u256 = 0x40000000000000; // 2^54
const TWO_POW_63: u256 = 0x8000000000000000; // 2^61
const TWO_POW_72: u256 = 0x1000000000000000000; // 2^72
const TWO_POW_73: u256 = 0x2000000000000000000; // 2^7
const TWO_POW_81: u256 = 0x200000000000000000000; // 2^81
const TWO_POW_82: u256 = 0x400000000000000000000; // 2^82
const TWO_POW_83: u256 = 0x800000000000000000000; // 2^83
const TWO_POW_84: u256 = 0x1000000000000000000000; // 2^84
const TWO_POW_85: u256 = 0x2000000000000000000000; // 2^85
const TWO_POW_86: u256 = 0x4000000000000000000000; // 2^86
const TWO_POW_87: u256 = 0x8000000000000000000000; // 2^87
const TWO_POW_88: u256 = 0x10000000000000000000000; // 2^88
const TWO_POW_90: u256 = 0x40000000000000000000000; // 2^90
const TWO_POW_99: u256 = 0x8000000000000000000000000; // 2^99


#[derive(Drop, Copy, Serde)]
struct CcCave {
    map_id:u16,//9 bits
    curr_beast:u16,
    cc_points:u16,
    beast_health:u16, // 9 bits
    beast_amount:u16,
    has_reward: u16, // 9 bits
    strength_increase: u8, // 9 bits
    dexterity_increase: u8, // 9 bits
    vitality_increase: u8, // 9 bits
    intelligence_increase: u8, // 9 bits
    wisdom_increase: u8, // 9 bits
    charisma_increase: u8, // 9 bits
}

impl CcCavePacking of StorePacking<CcCave,felt252> {
    fn pack(value: CcCave) -> felt252 {

        (value.map_id.into()
            + value.curr_beast.into() * TWO_POW_9
            + value.cc_points.into() * TWO_POW_18
            + value.beast_health.into() * TWO_POW_27
            + value.beast_amount.into() * TWO_POW_36
            + value.has_reward.into() * TWO_POW_45
            + value.strength_increase.into() * TWO_POW_54
            + value.dexterity_increase.into() * TWO_POW_63
            + value.vitality_increase.into() * TWO_POW_72
            + value.intelligence_increase.into() * TWO_POW_81
            + value.wisdom_increase.into() * TWO_POW_90
            + value.charisma_increase.into() * TWO_POW_99
        ).try_into().expect('pack cc_cave')
    }
    fn unpack(value: felt252) -> CcCave {
        let packed = value.into();
        let (packed, map_id) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, curr_beast) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, cc_points) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, beast_health) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, beast_amount) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, has_reward) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, strength_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, dexterity_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, vitality_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, intelligence_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, wisdom_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, charisma_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());

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
        }
    }
}

#[generate_trait]
impl ImplCcCave of ICcCave {
    fn increase_strength(ref self: CcCave,amount:u8) -> u8{
        self.strength_increase = self.strength_increase + amount;
        self.strength_increase
    }

    fn increase_dexterity(ref self: CcCave,amount:u8) -> u8{
        self.dexterity_increase = self.dexterity_increase + amount;
        self.dexterity_increase
    }

    fn increase_vitality(ref self: CcCave,amount:u8) -> u8{
        self.vitality_increase = self.vitality_increase + amount;
        self.vitality_increase
    }

    fn increase_intelligence(ref self: CcCave,amount:u8) -> u8{
        self.intelligence_increase = self.intelligence_increase + amount;
        self.intelligence_increase
    }

    fn increase_wisdom(ref self: CcCave,amount:u8) -> u8{
        self.wisdom_increase = self.wisdom_increase + amount;
        self.wisdom_increase
    }

    fn increase_charisma(ref self: CcCave,amount:u8) -> u8{
        self.charisma_increase = self.charisma_increase + amount;
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
        let mut level = 0;
        if self.cc_points < 3 {
            level = 5 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 5 {
            level =  5 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 8 {
            level =  4 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 11 {
            level =  4 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 12{
            level =  3 - (seed % 2).try_into().unwrap();
        }

        if level == 0 {
            level = 1;
        }

        if level > 5 {
            level = 5;
        }

        return level;
    }

    fn get_item_id(self:CcCave, level:u8 , seed:u128)->u8{

        assert(level == 1 || level == 2 || level == 3 || level == 4 || level == 5 , 'get_item_id2');

        let mut id = 0;

        if level == 1 {
            id = self.get_item_id_t1(seed);
        }
        if level == 2 {
            id = self.get_item_id_t2(seed);
        }
        if level == 3 {
            id = self.get_item_id_t3(seed);
        }
        if level == 4 {
            id = self.get_item_id_t4(seed);
        }
        if level == 5 {
            id = self.get_item_id_t5(seed);
        }

        assert(id!=0 , 'get_item_id 2');

        id
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
        }else if selected == 1{
            return 10;
        }else if selected == 2{
            return 14;
        }else if selected == 3{
            return 18;
        }else if selected == 4{
            return 23;
        }else if selected == 5{
            return 28;
        } else if selected == 6 {
            return 33;
        } else if selected == 7{
            return 38;
        } else if selected == 8{
            return 43;
        } else if selected == 9{
            return 48;
        } else if selected == 10{
            return 53;
        } else if selected == 11{
            return 58;
        } else if selected == 12{
            return 63;
        } else if selected == 13{
            return 68;
        } else if selected == 14{
            return 73;
        } else if selected == 15{
            return 78;
        } else if selected == 16{
            return 83;
        } else if selected == 17{
            return 88;
        } else if selected == 18{
            return 93;
        } else if selected == 19{
            return 98;
        }

        return 0;
    }

    fn get_item_id_t3(self:CcCave, seed:u128)->u8{
        // 5,11,15,19,24,29,34,39,44,49,54,59,64,69,74,79,84,89,94,99 => 20

        let selected=seed % 20;
        if selected == 0 {
            return 5;
        }else if selected == 1{
            return 11;
        }else if selected == 2{
            return 15;
        }else if selected == 3{
            return 19;
        }else if selected == 4{
            return 24;
        }else if selected == 5{
            return 29;
        } else if selected == 6 {
            return 34;
        } else if selected == 7{
            return 39;
        } else if selected == 8{
            return 44;
        } else if selected == 9{
            return 49;
        } else if selected == 10{
            return 54;
        } else if selected == 11{
            return 59;
        } else if selected == 12{
            return 64;
        } else if selected == 13{
            return 69;
        } else if selected == 14{
            return 74;
        } else if selected == 15{
            return 79;
        } else if selected == 16{
            return 84;
        } else if selected == 17{
            return 89;
        } else if selected == 18{
            return 94;
        } else if selected == 19{
            return 99;
        }

        return 0;
    }

    fn get_item_id_t4(self:CcCave, seed:u128)->u8{
        // 20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100 => 17

        let selected=seed % 17;
        if selected == 0 {
            return 20;
        }else if selected == 1{
            return 25;
        }else if selected == 2{
            return 30;
        }else if selected == 3{
            return 35;
        }else if selected == 4{
            return 40;
        }else if selected == 5{
            return 45;
        } else if selected == 6 {
            return 50;
        } else if selected == 7{
            return 55;
        } else if selected == 8{
            return 60;
        } else if selected == 9{
            return 65;
        } else if selected == 10{
            return 70;
        } else if selected == 11{
            return 75;
        } else if selected == 12{
            return 80;
        } else if selected == 13{
            return 85;
        } else if selected == 14{
            return 90;
        } else if selected == 15{
            return 95;
        } else if selected == 16{
            return 100;
        }

        return 0;
    }

    fn get_item_id_t5(self:CcCave, seed:u128)->u8{
        // 12,16,21,26,31,36,41,46,51,56,61,66,71,76,81,86,91,96,101 => 19

        let selected=seed % 19;
        if selected == 0 {
            return 12;
        }else if selected == 1{
            return 16;
        }else if selected == 2{
            return 21;
        }else if selected == 3{
            return 26;
        }else if selected == 4{
            return 31;
        }else if selected == 5{
            return 36;
        } else if selected == 6 {
            return 41;
        } else if selected == 7{
            return 46;
        } else if selected == 8{
            return 51;
        } else if selected == 9{
            return 56;
        } else if selected == 10{
            return 61;
        } else if selected == 11{
            return 66;
        } else if selected == 12{
            return 71;
        } else if selected == 13{
            return 76;
        } else if selected == 14{
            return 81;
        } else if selected == 15{
            return 86;
        } else if selected == 16{
            return 91;
        } else if selected == 17{
            return 96;
        } else if selected == 18{
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
    fn get_beast_seed(self: CcCave, adventurer_entropy: felt252) -> u128 {
        if self.map_id > 0 {
            let mut hash_span = ArrayTrait::new();
            hash_span.append(self.map_id.into());
            hash_span.append(self.curr_beast.into());
            hash_span.append(adventurer_entropy.into());
            let poseidon = poseidon_hash_span(hash_span.span());
            let (d, r) = integer::U256DivRem::div_rem(
                poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
            );
            r.try_into().unwrap()
        } else {
            0
        }
    }

    fn get_reward_seed(self: CcCave, adventurer_entropy: felt252 ,index:u8) -> u128 {
            let mut hash_span = ArrayTrait::new();
            hash_span.append(self.map_id.into());
            hash_span.append(self.curr_beast.into());
            hash_span.append(adventurer_entropy.into());
            hash_span.append(index.into());
            let poseidon = poseidon_hash_span(hash_span.span());
            let (d, r) = integer::U256DivRem::div_rem(
                poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
            );
            r.try_into().unwrap()
    }

    fn get_buff_seed(self: CcCave, adventurer_entropy: felt252,index:u8) -> u16 {
        let mut hash_span = ArrayTrait::new();
        hash_span.append(self.map_id.into());
        hash_span.append(self.curr_beast.into());
        hash_span.append(adventurer_entropy.into());
        hash_span.append(index.into());
        let poseidon = poseidon_hash_span(hash_span.span());
        let (d, r) = integer::U256DivRem::div_rem(
            poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
        );
        let seed:u128 = r.try_into().expect('get_buff_seed 1');

        return 1 + (seed % 6).try_into().expect('get_buff_seed 2');
    }

    fn get_beast(self: CcCave,adventurer_entropy: felt252) -> (Beast, u128) {
        let beast_seed = self.get_beast_seed(adventurer_entropy);
        let adventurer_level = 1;//self.get_level();

        // @dev ideally this would be a setting but to minimize gas we're using hardcoded value so we can use cheaper equal operator

        let beast_id = ImplBeast::get_beast_id(beast_seed);
        let starting_health = ImplBeast::get_starting_health(adventurer_level, beast_seed);
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
    use cc::cc_cave::CcCave;
    use cc::cc_cave::ImplCcCave;
    use cc::cc_buff::get_buff_by_id;

    use pack::{pack::{Packing, rshift_split}, constants::{MASK_16, pow, MASK_8, MASK_BOOL, mask}};

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

    #[test]
    #[available_gas(1555600)]
    fn test_pack() {
        let mut cc_cave = CcCave {
            map_id: 2,
            curr_beast: 1,
            cc_points: 0,
            beast_health: 1,
            beast_amount: 3,
            has_reward: 3,
            strength_increase: 0,
            dexterity_increase: 0,
            vitality_increase: 0,
            intelligence_increase: 0,
            wisdom_increase: 0,
            charisma_increase: 0,
        };
        let packed = cc_cave.pack();
        let unpacked:CcCave = Packing::unpack(packed);
        assert(unpacked.map_id==2,'');
        assert(unpacked.charisma_increase==0,'');

    }

    #[test]
    #[available_gas(1555600)]
    fn test_get_buff_sees() {
        let mut cc_cave = CcCave {
            map_id: 2,
            curr_beast: 1,
            cc_points: 0,
            beast_health: 1,
            beast_amount: 3,
            has_reward: 3,
            strength_increase: 0,
            dexterity_increase: 0,
            vitality_increase: 0,
            intelligence_increase: 0,
            wisdom_increase: 0,
            charisma_increase: 0,
        };
        let mut adventurer_entropy = 9004952233574142991;
        let seed_1 = cc_cave.get_buff_seed(adventurer_entropy, 1);
        seed_1.print();

        let config = get_buff_by_id(seed_1);
        cc_cave.increase_vitality(config.vitality);

        assert(cc_cave.vitality_increase == 1,'');
    }
}
