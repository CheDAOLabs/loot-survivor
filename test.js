const buffs =
    [
        {id: 1, strength: 1, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0},
        {id: 2, strength: 0, dexterity: 1, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0},
        {id: 3, strength: 0, dexterity: 0, vitality: 1, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, hp: 0},
        {id: 4, strength: 0, dexterity: 0, vitality: 0, intelligence: 1, wisdom: 0, charisma: 0, luck: 0, hp: 0},
        {id: 5, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 1, charisma: 0, luck: 0, hp: 0},
        {id: 6, strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 1, luck: 0, hp: 0},
    ]


const id2cbs = (id)=>{
    let cbs = []
    let buff = buffs.find(b=>b.id === id);
    let keys = Object.keys(buff);
    for (let key of keys){
        if(key === 'id') continue;
        if(buff[key]>0){
            cbs.push({
                key: key,
                value: buff[key]
            });
        }
    }
    return cbs;
}

console.log(id2cbs(1));
console.log(id2cbs(2));