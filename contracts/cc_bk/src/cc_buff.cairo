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
}

fn get_buff_by_id(buff_id: u16) -> CcBuff {
    if buff_id == 1 {
       return CcBuff { id: 1, strength: 1, dexterity: 1, vitality: 1, intelligence: 0, wisdom: 0, charisma: 0  };
    }
    if buff_id == 2 {
       return CcBuff { id: 2, strength: 0, dexterity: 1, vitality: 1, intelligence: 1, wisdom: 0, charisma: 0  };
    }
    if buff_id == 3 {
       return CcBuff { id: 3, strength: 0, dexterity: 0, vitality: 1, intelligence: 1, wisdom: 1, charisma: 0  };
    }
    if buff_id == 4 {
       return CcBuff { id: 4, strength: 0, dexterity: 0, vitality: 0, intelligence: 1, wisdom: 1, charisma: 1  };
    }
    if buff_id == 5 {
       return CcBuff { id: 5, strength: 1, dexterity: 0, vitality: 1, intelligence: 0, wisdom: 1, charisma: 0  };
    }
    if buff_id == 6 {
       return CcBuff { id: 6, strength: 0, dexterity: 1, vitality: 1, intelligence: 0, wisdom: 0, charisma: 1  };
    }

    CcBuff { id: 0, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0  }
}

#[cfg(test)]
mod tests {
    use debug::PrintTrait;
    use cc::cc_buff::get_buff_by_id;


    #[test]
    #[available_gas(50000)]
    fn test_buff_by_id() {
        let buff = get_buff_by_id(3);
        assert(buff.vitality == 1, 'wrong');
        assert(buff.wisdom == 1, 'wrong');

    }

    #[test]
    #[available_gas(50000)]
    fn test_to_ether() {
        let amount:u256 = 1;
        (amount * 1000000000000000000).print();

    }
}