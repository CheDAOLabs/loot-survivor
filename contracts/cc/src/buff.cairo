#[derive(Drop, Copy, Serde)] // 24 bits
struct Buff {
    id: u8, // 5 bits
    // Physical
    strength: u8, // 5 bits
    dexterity: u8, // 5 bits
    vitality: u8, // 5 bits
    // Mental
    intelligence: u8, // 5 bits
    wisdom: u8, // 5 bits
    charisma: u8, // 5 bits
    // More
    luck: u8, // 5 bits
    hp: u8 // 5 bits
}

fn get_buffs() -> Array<Buff> {

    let mut buffs = ArrayTrait::<Buff>::new();
    buffs.append(Buff{id:0,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(Buff{id:1,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(Buff{id:2,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(Buff{id:3,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(Buff{id:4,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });
    buffs.append(Buff{id:5,strength:0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0 });

    buffs
}