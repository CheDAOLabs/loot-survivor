import { hash } from "starknet";

export type Dict<T> = { [key: number]: T };
export type DictString<T> = { [key: string]: T };

export class GameData {
  CONTRACTS: DictString<string>;
  BEASTS: Dict<string>;
  BEAST_TIERS: Dict<number>;
  BEAST_TYPES: Dict<string>;
  BEAST_ATTACK_TYPES: DictString<string>;
  BEAST_ARMOR_TYPES: DictString<string>;
  ITEMS: Dict<string>;
  CLASSES: Dict<string>;
  ORDERS: Dict<string>;
  STATS: Dict<string>;
  STATS_ABBREVIATIONS: Dict<string>;
  OBSTACLES: Dict<string>;
  DISCOVERY_TYPES: Dict<string>;
  ITEM_DISCOVERY_TYPES: Dict<string>;
  ITEM_TYPES: Dict<string>;
  ITEM_TIERS: DictString<number>;
  ITEM_SLOTS: DictString<string>;
  ITEM_NAME_PREFIXES: Dict<string>;
  ITEM_NAME_SUFFIXES: Dict<string>;
  ITEM_SUFFIXES: Dict<string>;
  ITEM_SUFFIX_BOOST: Dict<string>;
  STATUS: Dict<string>;
  SLOTS: Dict<string>;
  BEAST_IMAGES: DictString<string>;
  ADVENTURER_ANIMATIONS: DictString<string>;
  ADVENTURER_SOUNDS: DictString<string>;
  SELECTOR_KEYS: DictString<string>;
  QUERY_KEYS: DictString<string>;

  constructor() {
    this.CONTRACTS = {
      goerliAdventurer:
        "0x035d755a23ec72df90819f584d9a1849bbc21fa77f96d25e03f1736883895248",
      goerliBeast:
        "0x000f4dbfe5d15792aa91025e42ee1d74c22bdeb1eef0b9bc19a37216377290c1",
      goerliLoot:
        "0x065669e15c8f1a7f17b7062e4eb1b709b922b931b93c59577f1848a85c30ab1f",
      devnetAdventurer:
        "0x005160ffc8910638190fbe80296932ce90be9091f622b30b299ed81c7be7d359",
      devnetBeast:
        "0x061533cb6f21d230aeef9ac2aecf0c70679d1d50d9d61f11bd6a6113cf3d7d85",
      devnetLoot:
        "0x040583a9197a52f289a5f6f03981ace0b3dfcc7496137fa292ec67796be22766",
    };

    this.BEASTS = {
      1: "Warlock",
      2: "Typhon",
      3: "Jiangshi",
      4: "Anansi",
      5: "Basilisk",
      6: "Gorgon",
      7: "Kitsune",
      8: "Lich",
      9: "Chimera",
      10: "Wendigo",
      11: "Rakshasa",
      12: "Werewolf",
      13: "Banshee",
      14: "Draugr",
      15: "Vampire",
      16: "Goblin",
      17: "Ghoul",
      18: "Wraith",
      19: "Sprite",
      20: "Kappa",
      21: "Fairy",
      22: "Leprechaun",
      23: "Kelpie",
      24: "Pixie",
      25: "Gnome",
      26: "Griffin",
      27: "Manticore",
      28: "Phoenix",
      29: "Dragon",
      30: "Minotaur",
      31: "Qilin",
      32: "Ammit",
      33: "Nue",
      34: "Skinwalker",
      35: "Chupacabra",
      36: "Weretiger",
      37: "Wyvern",
      38: "Roc",
      39: "Harpy",
      40: "Pegasus",
      41: "Hippogriff",
      42: "Fenrir",
      43: "Jaguar",
      44: "Satori",
      45: "DireWolf",
      46: "Bear",
      47: "Wolf",
      48: "Mantis",
      49: "Spider",
      50: "Rat",
      51: "Kraken",
      52: "Colossus",
      53: "Balrog",
      54: "Leviathan",
      55: "Tarrasque",
      56: "Titan",
      57: "Nephilim",
      58: "Behemoth",
      59: "Hydra",
      60: "Juggernaut",
      61: "Oni",
      62: "Jotunn",
      63: "Ettin",
      64: "Cyclops",
      65: "Giant",
      66: "NemeanLion",
      67: "Berserker",
      68: "Yeti",
      69: "Golem",
      70: "Ent",
      71: "Troll",
      72: "Bigfoot",
      73: "Ogre",
      74: "Orc",
      75: "Skeleton",
    };

    this.BEAST_TIERS = {
      // Magical T1s
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      // Magical T2s
      6: 2,
      7: 2,
      8: 2,
      9: 2,
      10: 2,
      // Magical T3s
      11: 3,
      12: 3,
      13: 3,
      14: 3,
      15: 3,
      // Magical T4s
      16: 4,
      17: 4,
      18: 4,
      19: 4,
      20: 4,
      // Magical T5s
      21: 5,
      22: 5,
      23: 5,
      24: 5,
      25: 5,
      // Hunter T1s
      26: 1,
      27: 1,
      28: 1,
      29: 1,
      30: 1,
      // Hunter T2s
      31: 2,
      32: 2,
      33: 2,
      34: 2,
      35: 2,
      // Hunter T3s
      36: 3,
      37: 3,
      38: 3,
      39: 3,
      40: 3,
      // Hunter T4s
      41: 4,
      42: 4,
      43: 4,
      44: 4,
      45: 4,
      // Hunter T5s
      46: 5,
      47: 5,
      48: 5,
      49: 5,
      50: 5,
      // Brute T1s
      51: 1,
      52: 1,
      53: 1,
      54: 1,
      55: 1,
      // Brute T2s
      56: 2,
      57: 2,
      58: 2,
      59: 2,
      60: 2,
      // Brute T3s
      61: 3,
      62: 3,
      63: 3,
      64: 3,
      65: 3,
      // Brute T4s
      66: 4,
      67: 4,
      68: 4,
      69: 4,
      70: 4,
      // Brute T5s
      71: 5,
      72: 5,
      73: 5,
      74: 5,
      75: 5,
    };

    this.BEAST_TYPES = {
      // Magical Beasts
      1: "Magical",
      2: "Magical",
      3: "Magical",
      4: "Magical",
      5: "Magical",
      6: "Magical",
      7: "Magical",
      8: "Magical",
      9: "Magical",
      10: "Magical",
      11: "Magical",
      12: "Magical",
      13: "Magical",
      14: "Magical",
      15: "Magical",
      16: "Magical",
      17: "Magical",
      18: "Magical",
      19: "Magical",
      20: "Magical",
      21: "Magical",
      22: "Magical",
      23: "Magical",
      24: "Magical",
      25: "Magical",
      // Hunter Beasts
      26: "Hunter",
      27: "Hunter",
      28: "Hunter",
      29: "Hunter",
      30: "Hunter",
      31: "Hunter",
      32: "Hunter",
      33: "Hunter",
      34: "Hunter",
      35: "Hunter",
      36: "Hunter",
      37: "Hunter",
      38: "Hunter",
      39: "Hunter",
      40: "Hunter",
      41: "Hunter",
      42: "Hunter",
      43: "Hunter",
      44: "Hunter",
      45: "Hunter",
      46: "Hunter",
      47: "Hunter",
      48: "Hunter",
      49: "Hunter",
      50: "Hunter",
      // Brute Beasts
      51: "Brute",
      52: "Brute",
      53: "Brute",
      54: "Brute",
      55: "Brute",
      56: "Brute",
      57: "Brute",
      58: "Brute",
      59: "Brute",
      60: "Brute",
      61: "Brute",
      62: "Brute",
      63: "Brute",
      64: "Brute",
      65: "Brute",
      66: "Brute",
      67: "Brute",
      68: "Brute",
      69: "Brute",
      70: "Brute",
      71: "Brute",
      72: "Brute",
      73: "Brute",
      74: "Brute",
      75: "Brute",
    };

    this.BEAST_ATTACK_TYPES = {
      Magical: "Magic",
      Hunter: "Blade",
      Brute: "Bludgeon",
    };

    this.BEAST_ARMOR_TYPES = {
      Magical: "Cloth",
      Hunter: "Hide",
      Brute: "Metal",
    };

    this.ITEMS = {
      1: "Pendant",
      2: "Necklace",
      3: "Amulet",
      4: "Silver Ring",
      5: "Bronze Ring",
      6: "Platinum Ring",
      7: "Titanium Ring",
      8: "Gold Ring",
      9: "Ghost Wand",
      10: "Grave Wand",
      11: "Bone Wand",
      12: "Wand",
      13: "Grimoire",
      14: "Chronicle",
      15: "Tome",
      16: "Book",
      17: "Divine Robe",
      18: "Silk Robe",
      19: "Linen Robe",
      20: "Robe",
      21: "Shirt",
      22: "Crown",
      23: "Divine Hood",
      24: "Silk Hood",
      25: "Linen Hood",
      26: "Hood",
      27: "Brightsilk Sash",
      28: "Silk Sash",
      29: "Wool Sash",
      30: "Linen Sash",
      31: "Sash",
      32: "Divine Slippers",
      33: "Silk Slippers",
      34: "Wool Shoes",
      35: "Linen Shoes",
      36: "Shoes",
      37: "Divine Gloves",
      38: "Silk Gloves",
      39: "Wool Gloves",
      40: "Linen Gloves",
      41: "Gloves",
      42: "Katana",
      43: "Falchion",
      44: "Scimitar",
      45: "Long Sword",
      46: "Short Sword",
      47: "Demon Husk",
      48: "Dragonskin Armor",
      49: "Studded Leather Armor",
      50: "Hard Leather Armor",
      51: "Leather Armor",
      52: "Demon Crown",
      53: "Dragons Crown",
      54: "War Cap",
      55: "Leather Cap",
      56: "Cap",
      57: "Demonhide Belt",
      58: "Dragonskin Belt",
      59: "Studded Leather Belt",
      60: "Hard Leather Belt",
      61: "Leather Belt",
      62: "Demonhide Boots",
      63: "Dragonskin Boots",
      64: "Studded Leather Boots",
      65: "Hard Leather Boots",
      66: "Leather Boots",
      67: "Demons Hands",
      68: "Dragonskin Gloves",
      69: "Studded Leather Gloves",
      70: "Hard Leather Gloves",
      71: "Leather Gloves",
      72: "Warhammer",
      73: "Quarterstaff",
      74: "Maul",
      75: "Mace",
      76: "Club",
      77: "Holy Chestplate",
      78: "Ornate Chestplate",
      79: "Plate Mail",
      80: "Chain Mail",
      81: "Ring Mail",
      82: "Ancient Helm",
      83: "Ornate Helm",
      84: "Great Helm",
      85: "Full Helm",
      86: "Helm",
      87: "Ornate Belt",
      88: "War Belt",
      89: "Plated Belt",
      90: "Mesh Belt",
      91: "Heavy Belt",
      92: "Holy Greaves",
      93: "Ornate Greaves",
      94: "Greaves",
      95: "Chain Boots",
      96: "Heavy Boots",
      97: "Holy Gauntlets",
      98: "Ornate Gauntlets",
      99: "Gauntlets",
      100: "Chain Gloves",
      101: "Heavy Gloves",
    };

    this.ITEM_TYPES = {
      1: "Necklace",
      2: "Necklace",
      3: "Necklace",
      4: "Ring",
      5: "Ring",
      6: "Ring",
      7: "Ring",
      8: "Ring",
      9: "Magic",
      10: "Magic",
      11: "Magic",
      12: "Magic",
      13: "Magic",
      14: "Magic",
      15: "Magic",
      16: "Magic",
      17: "Cloth",
      18: "Cloth",
      19: "Cloth",
      20: "Cloth",
      21: "Cloth",
      22: "Cloth",
      23: "Cloth",
      24: "Cloth",
      25: "Cloth",
      26: "Cloth",
      27: "Cloth",
      28: "Cloth",
      29: "Cloth",
      30: "Cloth",
      31: "Cloth",
      32: "Cloth",
      33: "Cloth",
      34: "Cloth",
      35: "Cloth",
      36: "Cloth",
      37: "Cloth",
      38: "Cloth",
      39: "Cloth",
      40: "Cloth",
      41: "Cloth",
      42: "Blade",
      43: "Blade",
      44: "Blade",
      45: "Blade",
      46: "Blade",
      47: "Hide",
      48: "Hide",
      49: "Hide",
      50: "Hide",
      51: "Hide",
      52: "Hide",
      53: "Hide",
      54: "Hide",
      55: "Hide",
      56: "Hide",
      57: "Hide",
      58: "Hide",
      59: "Hide",
      60: "Hide",
      61: "Hide",
      62: "Hide",
      63: "Hide",
      64: "Hide",
      65: "Hide",
      66: "Hide",
      67: "Hide",
      68: "Hide",
      69: "Hide",
      70: "Hide",
      71: "Hide",
      72: "Bludgeon",
      73: "Bludgeon",
      74: "Bludgeon",
      75: "Bludgeon",
      76: "Bludgeon",
      78: "Metal",
      77: "Metal",
      79: "Metal",
      80: "Metal",
      81: "Metal",
      82: "Metal",
      83: "Metal",
      84: "Metal",
      85: "Metal",
      86: "Metal",
      87: "Metal",
      88: "Metal",
      89: "Metal",
      90: "Metal",
      91: "Metal",
      92: "Metal",
      93: "Metal",
      94: "Metal",
      95: "Metal",
      96: "Metal",
      97: "Metal",
      98: "Metal",
      99: "Metal",
      100: "Metal",
      101: "Metal",
    };

    this.ITEM_TIERS = {
      Pendant: 1,
      Necklace: 1,
      Amulet: 1,
      SilverRing: 2,
      BronzeRing: 3,
      PlatinumRing: 1,
      TitaniumRing: 1,
      GoldRing: 1,
      GhostWand: 1,
      GraveWand: 2,
      BoneWand: 3,
      Wand: 5,
      Grimoire: 1,
      Chronicle: 2,
      Tome: 3,
      Book: 5,
      DivineRobe: 1,
      SilkRobe: 2,
      LinenRobe: 3,
      Robe: 4,
      Shirt: 5,
      Crown: 1,
      DivineHood: 2,
      SilkHood: 3,
      LinenHood: 4,
      Hood: 5,
      BrightsilkSash: 1,
      SilkSash: 2,
      WoolSash: 3,
      LinenSash: 4,
      Sash: 5,
      DivineSlippers: 1,
      SilkSlippers: 2,
      WoolShoes: 3,
      LinenShoes: 4,
      Shoes: 5,
      DivineGloves: 1,
      SilkGloves: 2,
      WoolGloves: 3,
      LinenGloves: 4,
      Gloves: 5,
      Katana: 1,
      Falchion: 2,
      Scimitar: 3,
      LongSword: 4,
      ShortSword: 5,
      DemonHusk: 1,
      DragonskinArmor: 2,
      StuddedLeatherArmor: 3,
      HardLeatherArmor: 4,
      LeatherArmor: 5,
      DemonCrown: 1,
      DragonsCrown: 2,
      WarCap: 3,
      LeatherCap: 4,
      Cap: 5,
      DemonhideBelt: 1,
      DragonskinBelt: 2,
      StuddedLeatherBelt: 3,
      HardLeatherBelt: 4,
      LeatherBelt: 5,
      DemonhideBoots: 1,
      DragonskinBoots: 2,
      StuddedLeatherBoots: 3,
      HardLeatherBoots: 4,
      LeatherBoots: 5,
      DemonsHands: 1,
      DragonskinGloves: 2,
      StuddedLeatherGloves: 3,
      HardLeatherGloves: 4,
      LeatherGloves: 5,
      Warhammer: 1,
      Quarterstaff: 2,
      Maul: 3,
      Mace: 4,
      Club: 5,
      HolyChestplate: 1,
      OrnateChestplate: 2,
      PlateMail: 3,
      ChainMail: 4,
      RingMail: 5,
      AncientHelm: 1,
      OrnateHelm: 2,
      GreatHelm: 3,
      FullHelm: 4,
      Helm: 5,
      OrnateBelt: 1,
      WarBelt: 2,
      PlatedBelt: 3,
      MeshBelt: 4,
      HeavyBelt: 5,
      HolyGreaves: 1,
      OrnateGreaves: 2,
      Greaves: 3,
      ChainBoots: 4,
      HeavyBoots: 5,
      HolyGauntlets: 1,
      OrnateGauntlets: 2,
      Gauntlets: 3,
      ChainGloves: 4,
      HeavyGloves: 5,
    };

    this.ITEM_SLOTS = {
      Pendant: "Neck",
      Necklace: "Neck",
      Amulet: "Neck",
      SilverRing: "Ring",
      BronzeRing: "Ring",
      PlatinumRing: "Ring",
      TitaniumRing: "Ring",
      GoldRing: "Ring",
      GhostWand: "Weapon",
      GraveWand: "Weapon",
      BoneWand: "Weapon",
      Wand: "Weapon",
      Grimoire: "Weapon",
      Chronicle: "Weapon",
      Tome: "Weapon",
      Book: "Weapon",
      DivineRobe: "Chest",
      SilkRobe: "Chest",
      LinenRobe: "Chest",
      Robe: "Chest",
      Shirt: "Chest",
      Crown: "Head",
      DivineHood: "Head",
      SilkHood: "Head",
      LinenHood: "Head",
      Hood: "Head",
      BrightsilkSash: "Waist",
      SilkSash: "Waist",
      WoolSash: "Waist",
      LinenSash: "Waist",
      Sash: "Waist",
      DivineSlippers: "Foot",
      SilkSlippers: "Foot",
      WoolShoes: "Foot",
      LinenShoes: "Foot",
      Shoes: "Foot",
      DivineGloves: "Hand",
      SilkGloves: "Hand",
      WoolGloves: "Hand",
      LinenGloves: "Hand",
      Gloves: "Hand",
      Katana: "Weapon",
      Falchion: "Weapon",
      Scimitar: "Weapon",
      LongSword: "Weapon",
      ShortSword: "Weapon",
      DemonHusk: "Chest",
      DragonskinArmor: "Chest",
      StuddedLeatherArmor: "Chest",
      HardLeatherArmor: "Chest",
      LeatherArmor: "Chest",
      DemonCrown: "Head",
      DragonsCrown: "Head",
      WarCap: "Head",
      LeatherCap: "Head",
      Cap: "Head",
      DemonhideBelt: "Waist",
      DragonskinBelt: "Waist",
      StuddedLeatherBelt: "Waist",
      HardLeatherBelt: "Waist",
      LeatherBelt: "Waist",
      DemonhideBoots: "Foot",
      DragonskinBoots: "Foot",
      StuddedLeatherBoots: "Foot",
      HardLeatherBoots: "Foot",
      LeatherBoots: "Foot",
      DemonsHands: "Hand",
      DragonskinGloves: "Hand",
      StuddedLeatherGloves: "Hand",
      HardLeatherGloves: "Hand",
      LeatherGloves: "Hand",
      Warhammer: "Weapon",
      Quarterstaff: "Weapon",
      Maul: "Weapon",
      Mace: "Weapon",
      Club: "Weapon",
      HolyChestplate: "Chest",
      OrnateChestplate: "Chest",
      PlateMail: "Chest",
      ChainMail: "Chest",
      RingMail: "Chest",
      AncientHelm: "Head",
      OrnateHelm: "Head",
      GreatHelm: "Head",
      FullHelm: "Head",
      Helm: "Head",
      OrnateBelt: "Waist",
      WarBelt: "Waist",
      PlatedBelt: "Waist",
      MeshBelt: "Waist",
      HeavyBelt: "Waist",
      HolyGreaves: "Foot",
      OrnateGreaves: "Foot",
      Greaves: "Foot",
      ChainBoots: "Foot",
      HeavyBoots: "Foot",
      HolyGauntlets: "Hand",
      OrnateGauntlets: "Hand",
      Gauntlets: "Hand",
      ChainGloves: "Hand",
      HeavyGloves: "Hand",
    };

    this.CLASSES = {
      1: "Cleric",
      2: "Scout",
      3: "Merchant",
      4: "Warrior",
      5: "Seer",
      6: "Mage",
      7: "Bard",
      8: "Brute",
    };

    this.ORDERS = {
      1: "Power",
      2: "Giants",
      3: "Titans",
      4: "Skill",
      5: "Perfection",
      6: "Brilliance",
      7: "Enlightenment",
      8: "Protection",
      9: "Twins",
      10: "Reflection",
      11: "Detection",
      12: "Fox",
      13: "Vitriol",
      14: "Fury",
      15: "Rage",
      16: "Anger",
    };

    this.STATS = {
      0: "Strength",
      1: "Dexterity",
      2: "Vitality",
      3: "Intelligence",
      4: "Wisdom",
      5: "Charisma",
      6: "Luck",
    };

    this.STATS_ABBREVIATIONS = {
      0: "STR",
      1: "DEX",
      2: "VIT",
      3: "INT",
      4: "WIS",
      5: "CHA",
      6: "LUCK",
    };

    this.OBSTACLES = {
      // Magical Obstacles
      1: "Demonic Alter",
      2: "Vortex Of Despair",
      3: "Eldritch Barrier",
      4: "Soul Trap",
      5: "Phantom Vortex",
      6: "Ectoplasmic Web",
      7: "Spectral Chains",
      8: "Infernal Pact",
      9: "Arcane Explosion",
      10: "Hypnotic Essence",
      11: "Mischievous Sprites",
      12: "Soul Draining Statue",
      13: "Petrifying Gaze",
      14: "Summoning Circle",
      15: "Ethereal Void",
      16: "Magic Lock",
      17: "Bewitching Fog",
      18: "Illusionary Maze",
      19: "Spellbound Mirror",
      20: "Ensnaring Shadow",
      21: "Dark Mist",
      22: "Curse",
      23: "Haunting Echo",
      24: "Hex",
      25: "Ghostly Whispers",

      // Sharp Obstacles
      26: "Pendulum Blades",
      27: "Icy Razor Winds",
      28: "Acidic Thorns",
      29: "Dragons Breath",
      30: "Pendulum Scythe",
      31: "Flame Jet",
      32: "Piercing Ice Darts",
      33: "Glass Sand Storm",
      34: "Poisoned Dart Wall",
      35: "Spinning Blade Wheel",
      36: "Poison Dart",
      37: "Spiked Tumbleweed",
      38: "Thunderbolt",
      39: "Giant Bear Trap",
      40: "Steel Needle Rain",
      41: "Spiked Pit",
      42: "Diamond Dust Storm",
      43: "Trapdoor Scorpion Pit",
      44: "Bladed Fan",
      45: "Bear Trap",
      46: "Porcupine Quill",
      47: "Hidden Arrow",
      48: "Glass Shard",
      49: "Thorn Bush",
      50: "Jagged Rocks",

      // Crushing Obstacles
      51: "Subterranean Tremor",
      52: "Rockslide",
      53: "Flash Flood",
      54: "Clinging Roots",
      55: "Collapsing Cavern",
      56: "Crushing Walls",
      57: "Smashing Pillars",
      58: "Rumbling Catacomb",
      59: "Whirling Cyclone",
      60: "Erupting Earth",
      61: "Subterranean Tremor",
      62: "Falling Chandelier",
      63: "Collapsing Bridge",
      64: "Raging Sandstorm",
      65: "Avalanching Rocks",
      66: "Tumbling Boulders",
      67: "Slamming Iron Gate",
      68: "Shifting Sandtrap",
      69: "Erupting Mud Geyser",
      70: "Crumbling Staircase",
      71: "Swinging Logs",
      72: "Unstable Cliff",
      73: "Toppling Statue",
      74: "Tumbling Barrels",
      75: "Rolling Boulder",
    };

    this.DISCOVERY_TYPES = {
      1: "Beast",
      2: "Obstacle",
      3: "Item",
    };

    this.ITEM_DISCOVERY_TYPES = {
      1: "Health",
      2: "Gold",
      3: "XP",
    };

    this.ITEM_NAME_PREFIXES = {
      1: "Agony ",
      2: "Apocalypse ",
      3: "Armageddon ",
      4: "Beast ",
      5: "Behemoth ",
      6: "Blight ",
      7: "Blood ",
      8: "Bramble ",
      9: "Brimstone ",
      10: "Brood ",
      11: "Carrion ",
      12: "Cataclysm ",
      13: "Chimeric ",
      14: "Corpse ",
      15: "Corruption ",
      16: "Damnation ",
      17: "Death ",
      18: "Demon ",
      19: "Dire ",
      20: "Dragon ",
      21: "Dread ",
      22: "Doom ",
      23: "Dusk ",
      24: "Eagle ",
      25: "Empyrean ",
      26: "Fate ",
      27: "Foe ",
      28: "Gale ",
      29: "Ghoul ",
      30: "Gloom ",
      31: "Glyph ",
      32: "Golem ",
      33: "Grim ",
      34: "Hate ",
      35: "Havoc ",
      36: "Honour ",
      37: "Horror ",
      38: "Hypnotic ",
      39: "Kraken ",
      40: "Loath ",
      41: "Maelstrom ",
      42: "Mind ",
      43: "Miracle ",
      44: "Morbid ",
      45: "Oblivion ",
      46: "Onslaught ",
      47: "Pain ",
      48: "Pandemonium ",
      49: "Phoenix ",
      50: "Plague ",
      51: "Rage ",
      52: "Rapture ",
      53: "Rune ",
      54: "Skull ",
      55: "Sol ",
      56: "Soul ",
      57: "Sorrow ",
      58: "Spirit ",
      59: "Storm ",
      60: "Tempest ",
      61: "Torment ",
      62: "Vengeance ",
      63: "Victory ",
      64: "Viper ",
      65: "Vortex ",
      66: "Woe ",
      67: "Wrath ",
      68: "Lights ",
      69: "Shimmering ",
    };

    this.ITEM_NAME_SUFFIXES = {
      1: "Bane",
      2: "Root",
      3: "Bite",
      4: "Song",
      5: "Roar",
      6: "Grasp",
      7: "Instrument",
      8: "Glow",
      9: "Bender",
      10: "Shadow",
      11: "Whisper",
      12: "Shout",
      13: "Growl",
      14: "Tear",
      15: "Peak",
      16: "Form",
      17: "Sun",
      18: "Moon",
    };

    this.ITEM_SUFFIXES = {
      1: "Of Power",
      2: "Of Giant",
      3: "Of Titans",
      4: "Of Skill",
      5: "Of Perfection",
      6: "Of Brilliance",
      7: "Of Enlightenment",
      8: "Of Protection",
      9: "Of Anger",
      10: "Of Rage",
      11: "Of Fury",
      12: "Of Vitriol",
      13: "Of The Fox",
      14: "Of Detection",
      15: "Of Reflection",
      16: "Of The Twins",
    };

    this.ITEM_SUFFIX_BOOST = {
      1: "STR +3",
      2: "VIT +3",
      3: "STR +2 CHA +1",
      4: "DEX +3",
      5: "STR +1 DEX +1 VIT +1",
      6: "INT +3",
      7: "WIS +3",
      8: "VIT +2 DEX +1",
      9: "STR +2 DEX +1",
      10: "WIS +1 STR +1 CHA +1",
      11: "VIT +1 CHA +1 INT +1",
      12: "INT +2 WIS +1",
      13: "DEX +2 CHA +1",
      14: "WIS +2 DEX +1",
      15: "WIS +2 INT +1",
      16: "CHA +3",
    };

    this.STATUS = { 0: "Closed", 1: "Open" };

    this.SLOTS = {
      1: "Weapon",
      2: "Chest",
      3: "Head",
      4: "Waist",
      5: "Foot",
      6: "Hand",
      7: "Neck",
      8: "Ring",
    };

    this.BEAST_IMAGES = {
      Warlock: "/monsters/warlock.png",
      Typhon: "/monsters/typhon.png",
      Jiangshi: "/monsters/jiangshi.png",
      Anansi: "/monsters/anansi.png",
      Basilisk: "/monsters/basilisk.png",
      Gorgon: "/monsters/gorgon.png",
      Kitsune: "/monsters/kitsune.png",
      Lich: "/monsters/lich.png",
      Chimera: "/monsters/chimera.png",
      Wendigo: "/monsters/wendigo.png",
      Rakshasa: "/monsters/rakshasa.png",
      Werewolf: "/monsters/werewolf.png",
      Banshee: "/monsters/banshee.png",
      Draugr: "/monsters/draugr.png",
      Vampire: "/monsters/vampire.png",
      Goblin: "/monsters/goblin.png",
      Ghoul: "/monsters/ghoul.png",
      Wraith: "/monsters/wraith.png",
      Sprite: "/monsters/sprite.png",
      Kappa: "/monsters/kappa.png",
      Fairy: "/monsters/fairy.png",
      Leprechaun: "/monsters/leprechaun.png",
      Kelpie: "/monsters/kelpie.png",
      Pixie: "/monsters/pixie.png",
      Gnome: "/monsters/gnome.png",
      Griffin: "/monsters/griffin.png",
      Manticore: "/monsters/manticore.png",
      Phoenix: "/monsters/phoenix.png",
      Dragon: "/monsters/dragon.png",
      Minotaur: "/monsters/minotaur.png",
      Qilin: "/monsters/qilin.png",
      Ammit: "/monsters/ammit.png",
      Nue: "/monsters/nue.png",
      Skinwalker: "/monsters/skinwalker.png",
      Chupacabra: "/monsters/chupacabra.png",
      Weretiger: "/monsters/weretiger.png",
      Wyvern: "/monsters/wyvern.png",
      Roc: "/monsters/roc.png",
      Harpy: "/monsters/harpy.png",
      Pegasus: "/monsters/pegasus.png",
      Hippogriff: "/monsters/hippogriff.png",
      Fenrir: "/monsters/fenrir.png",
      Jaguar: "/monsters/jaguar.png",
      Satori: "/monsters/satori.png",
      DireWolf: "/monsters/direwolf.png",
      Bear: "/monsters/bear.png",
      Wolf: "/monsters/wolf.png",
      Mantis: "/monsters/mantis.png",
      Spider: "/monsters/spider.png",
      Rat: "/monsters/rat.png",
      Kraken: "/monsters/kraken.png",
      Colossus: "/monsters/colossus.png",
      Balrog: "/monsters/balrog.png",
      Leviathan: "/monsters/leviathan.png",
      Tarrasque: "/monsters/tarrasque.png",
      Titan: "/monsters/titan.png",
      Nephilim: "/monsters/nephilim.png",
      Behemoth: "/monsters/behemoth.png",
      Hydra: "/monsters/hydra.png",
      Juggernaut: "/monsters/juggernaut.png",
      Oni: "/monsters/oni.png",
      Jotunn: "/monsters/jotunn.png",
      Ettin: "/monsters/ettin.png",
      Cyclops: "/monsters/cyclops.png",
      Giant: "/monsters/giant.png",
      NemeanLion: "/monsters/nemeanlion.png",
      Berserker: "/monsters/berserker.png",
      Yeti: "/monsters/yeti.png",
      Golem: "/monsters/golem.png",
      Ent: "/monsters/ent.png",
      Troll: "/monsters/troll.png",
      Bigfoot: "/monsters/bigfoot.png",
      Ogre: "/monsters/ogre.png",
      Orc: "/monsters/orc.png",
      Skeleton: "/monsters/skeleton.png",
    };

    this.ADVENTURER_ANIMATIONS = {
      Create: "idle",
      Flee: "run",
      Ambush: "damage",
      Attack1: "attack1",
      Attack2: "attack2",
      Attack3: "attack3",
      Dead: "die",
      Upgrade: "drawSword",
      DiscoverItem: "discoverItem",
      PurchaseItem: "discoverItem",
      DiscoverBeast: "drawSword",
      AvoidObstacle1: "jump",
      AvoidObstacle2: "slide",
      HitByObstacle: "damage",
      Multicall: "purchaseItem",
      HitByBeast: "damage",
      IdleDamagePenalty: "damage",
      IdleDamagePenaltyDead: "die",
    };

    this.ADVENTURER_SOUNDS = {
      Create: "fight_ui_sound.mp3",
      Flee: "fight_ui_sound.mp3",
      Ambush: "fight_ui_sound.mp3",
      Attack: "fight_ui_sound.mp3",
      Slayed: "fight_ui_sound.mp3",
      Dead: "fight_ui_sound.mp3",
      Upgrade: "fight_ui_sound.mp3",
      DiscoverItem: "fight_ui_sound.mp3",
      DiscoverBeast: "fight_ui_sound.mp3",
      AvoidObstacle: "fight_ui_sound.mp3",
      HitByObstacle: "fight_ui_sound.mp3",
      Multicall: "fight_ui_sound.mp3",
    };

    this.SELECTOR_KEYS = {
      StartGame: hash.getSelectorFromName("StartGame"),
      AdventurerUpgraded: hash.getSelectorFromName("AdventurerUpgraded"),
      DiscoveredHealth: hash.getSelectorFromName("DiscoveredHealth"),
      DiscoveredGold: hash.getSelectorFromName("DiscoveredGold"),
      DiscoveredXP: hash.getSelectorFromName("DiscoveredXP"),
      DodgedObstacle: hash.getSelectorFromName("DodgedObstacle"),
      HitByObstacle: hash.getSelectorFromName("HitByObstacle"),
      DiscoveredBeast: hash.getSelectorFromName("DiscoveredBeast"),
      AmbushedByBeast: hash.getSelectorFromName("AmbushedByBeast"),
      AttackedBeast: hash.getSelectorFromName("AttackedBeast"),
      AttackedByBeast: hash.getSelectorFromName("AttackedByBeast"),
      SlayedBeast: hash.getSelectorFromName("SlayedBeast"),
      FleeFailed: hash.getSelectorFromName("FleeFailed"),
      FleeSucceeded: hash.getSelectorFromName("FleeSucceeded"),
      PurchasedItems: hash.getSelectorFromName("PurchasedItems"),
      PurchasedPotions: hash.getSelectorFromName("PurchasedPotions"),
      EquippedItems: hash.getSelectorFromName("EquippedItems"),
      DroppedItems: hash.getSelectorFromName("DroppedItems"),
      GreatnessIncreased: hash.getSelectorFromName("GreatnessIncreased"),
      ItemsLeveledUp: hash.getSelectorFromName("ItemsLeveledUp"),
      NewHighScore: hash.getSelectorFromName("NewHighScore"),
      AdventurerDied: hash.getSelectorFromName("AdventurerDied"),
      AdventurerLeveledUp: hash.getSelectorFromName("AdventurerLeveledUp"),
      NewItemsAvailable: hash.getSelectorFromName("UpgradesAvailable"),
      IdleDeathPenalty: hash.getSelectorFromName("IdleDeathPenalty"),

      //cc
      EnterCC: hash.getSelectorFromName("EnterCC"),
      DiscoveredBeastCC: hash.getSelectorFromName("DiscoveredBeastCC"),
      AmbushedByBeastCC: hash.getSelectorFromName("AmbushedByBeastCC"),
      AttackedBeastCC: hash.getSelectorFromName("AttackedBeastCC"),
      AttackedByBeastCC: hash.getSelectorFromName("AttackedByBeastCC"),
      SlayedBeastCC: hash.getSelectorFromName("SlayedBeastCC"),
      AdventurerUpgradedCC: hash.getSelectorFromName("AdventurerUpgradedCC"),
    };

    this.QUERY_KEYS = {
      lastBattleQuery: "battles",
      lastBeastBattleQuery: "battles",
      battlesByAdventurerQuery: "battles",
      battlesByTxHashQuery: "battles",
      battlesByBeastQuery: "battles",
      lastBeastQuery: "beasts",
      beastQuery: "beasts",
      discoveriesQuery: "discoveries",
      latestDiscoveriesQuery: "discoveries",
      discoveryByTxHashQuery: "discoveries",
      adventurersByOwnerQuery: "adventurers",
      adventurerByIdQuery: "adventurers",
      leaderboardByIdQuery: "adventurers",
      adventurersByGoldQuery: "adventurers",
      adventurersByXPQuery: "adventurers",
      adventurersInListQuery: "adventurers",
      adventurersInListByXpQuery: "adventurers",
      itemsByAdventurerQuery: "items",
      itemsByProfileQuery: "items",
      topScoresQuery: "scores",
      latestMarketItemsQuery: "items",
      adventurerToSlayQuery: "adventurers",
      //CC
      enterCC:"cc_cave",
      beastQueryCC: "beasts",
    };
  }
}
