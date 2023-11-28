use core::result::ResultTrait;
use integer::{u8_overflowing_add, u16_overflowing_add, u16_overflowing_sub};
use traits::{TryInto, Into};
use option::OptionTrait;
use poseidon::poseidon_hash_span;
use array::ArrayTrait;

#[derive(Drop, Copy, Serde)] // 24 bits
struct CcBuff {
    id: u8,
    // 5 bits
    // Physical
    strength: u8,
    // 5 bits
    dexterity: u8,
    // 5 bits
    vitality: u8,
    // 5 bits
    // Mental
    intelligence: u8,
    // 5 bits
    wisdom: u8,
    // 5 bits
    charisma: u8,
    // 5 bits
    // More
    luck: u8,
    // 5 bits
    hp: u8, // 5 bits
}

fn get_buffs() -> Array<CcBuff> {
    let mut buffs = ArrayTrait::<CcBuff>::new();
    buffs.append(CcBuff { id: 1, strength: 1, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(CcBuff { id: 2, strength: 0, dexterity: 1, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(CcBuff { id: 3, strength: 0, dexterity: 0, vitality: 1, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(CcBuff { id: 4, strength: 0, dexterity: 0, vitality: 0, intelligence: 1, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(CcBuff { id: 5, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 1, charisma: 0, luck: 0, hp: 0 });
    buffs.append(CcBuff { id: 6, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 1, luck: 0, hp: 0 });
    buffs
}

fn get_buff_by_id(buff_id: u16) -> CcBuff {
    if buff_id == 1 {
       return CcBuff { id: 1, strength: 1, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 };
    }
    if buff_id == 2 {
       return CcBuff { id: 2, strength: 0, dexterity: 1, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 };
    }
    if buff_id == 3 {
       return CcBuff { id: 3, strength: 0, dexterity: 0, vitality: 1, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 };
    }
    if buff_id == 4 {
       return CcBuff { id: 4, strength: 0, dexterity: 0, vitality: 0, intelligence: 1, wisdom: 0, charisma: 0, luck: 0, hp: 0 };
    }
    if buff_id == 5 {
       return CcBuff { id: 5, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 1, charisma: 0, luck: 0, hp: 0 };
    }
    if buff_id == 6 {
       return CcBuff { id: 6, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 1, luck: 0, hp: 0 };
    }

    CcBuff { id: 0, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 }
}

#[cfg(test)]
mod tests {
    use debug::PrintTrait;
    use cc::buff::get_buffs;

    #[test]
    #[available_gas(50000)]
    fn test_buff() {
        let mut buffs = get_buffs();
        assert(*buffs.at(0).id == 0, 'wrong')
    }
}