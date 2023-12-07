mod interfaces;
mod resource;
mod cc_cave;
mod cc_buff;
mod cc_interfaces;

#[starknet::contract]
mod cc {


    use core::{
        array::{SpanTrait, ArrayTrait}, integer::u256_try_as_non_zero, traits::{TryInto, Into},
        clone::Clone, poseidon::poseidon_hash_span, option::OptionTrait, box::BoxTrait,
        starknet::{
            get_caller_address, ContractAddress, ContractAddressIntoFelt252, contract_address_const,
            get_block_timestamp, info::BlockInfo
        },
    };

    // use openzeppelin::token::erc20::interface::{
    //     IERC20Camel, IERC20CamelDispatcher, IERC20CamelDispatcherTrait, IERC20CamelLibraryDispatcher
    // };

    use survivor::{
        adventurer::{Adventurer, ImplAdventurer, IAdventurer}, stats::{Stats, StatUtils},
        item_primitive::{ImplItemPrimitive, ItemPrimitive}, bag::{Bag, IBag, ImplBag},
        adventurer_meta::{AdventurerMetadata, ImplAdventurerMetadata}, exploration::ExploreUtils,
        constants::{
            discovery_constants::DiscoveryEnums::{ExploreResult, DiscoveryType},
            adventurer_constants::{
                POTION_HEALTH_AMOUNT, ITEM_XP_MULTIPLIER_BEASTS, ITEM_XP_MULTIPLIER_OBSTACLES,
                ITEM_MAX_GREATNESS, MAX_GREATNESS_STAT_BONUS, StatisticIndex,
                VITALITY_INSTANT_HEALTH_BONUS, BEAST_SPECIAL_NAME_LEVEL_UNLOCK, XP_FOR_DISCOVERIES,
                STARTING_GOLD, STARTING_HEALTH, POTION_PRICE, MINIMUM_POTION_PRICE,
                CHARISMA_POTION_DISCOUNT, CHARISMA_ITEM_DISCOUNT, MINIMUM_ITEM_PRICE,
                MINIMUM_DAMAGE_TO_BEASTS, MINIMUM_DAMAGE_FROM_OBSTACLES,
                OBSTACLE_CRITICAL_HIT_CHANCE, MAX_STAT_UPGRADE_POINTS
            }
        },
        item_meta::{ImplItemSpecials, ItemSpecials, IItemSpecials, ItemSpecialsStorage},
        adventurer_utils::AdventurerUtils, leaderboard::{Score, Leaderboard},
    };

    use beasts::beast::{Beast, IBeast, ImplBeast};

    use combat::{
        combat::{CombatSpec, SpecialPowers, ImplCombat},
        constants::{CombatSettings::STRENGTH_DAMAGE_BONUS, CombatEnums::{Slot, Tier, Type}}
    };

    use market::{
        market::{ImplMarket, LootWithPrice, ItemPurchase},
        constants::{NUMBER_OF_ITEMS_PER_LEVEL, TIER_PRICE},
    };

    use cc::resource::{
        CryptsAndCavernsTraitDispatcher, CryptsAndCavernsTraitDispatcherTrait, DungeonSerde,
        DungeonDojo, Name, EntityDataSerde, Pack
    };

    use cc::cc_cave::{CcCave, ImplCcCave, ICcCave};
    use cc::cc_buff::{CcBuff,get_buff_by_id};
    use cc::cc_interfaces::ICC;


    #[storage]
    struct Storage {
        _cc_cave: LegacyMap::<felt252, CcCave>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EnterCC:EnterCC,
        AmbushedByBeastCC: AmbushedByBeastCC,
        DiscoveredBeastCC: DiscoveredBeastCC,
        AttackedBeastCC: AttackedBeastCC,
        AttackedByBeastCC: AttackedByBeastCC,
        SlayedBeastCC: SlayedBeastCC,
        AdventurerUpgradedCC: AdventurerUpgradedCC,
        RewardItemsCC: RewardItemsCC,
    }

    #[derive(Copy, Drop, Serde, starknet::Event)]
    struct AdventurerState {
        owner: ContractAddress,
        adventurer_id: felt252,
        adventurer: Adventurer
    }

    #[derive(Copy, Drop, Serde, starknet::Event)]
    struct AdventurerStateWithBag {
        adventurer_state: AdventurerState,
        bag: Bag
    }


    #[derive(Drop, starknet::Event)]
    struct EnterCC{
        cave:CcCave
    }


    #[derive(Drop, starknet::Event)]
    struct DiscoveredBeastCC {
        adventurer_state: AdventurerState,
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        beast_heath:u16
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct BattleDetails {
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        damage: u16,
        critical_hit: bool,
        location: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct AmbushedByBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
    }

    #[derive(Drop, starknet::Event)]
    struct AttackedBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
        beast_health:u16
    }

    #[derive(Drop, starknet::Event)]
    struct AttackedByBeastCC {
        adventurer_state: AdventurerState,
        beast_battle_details: BattleDetails,
    }

    #[derive(Drop, starknet::Event)]
    struct SlayedBeastCC {
        adventurer_state: AdventurerState,
        seed: u128,
        id: u8,
        beast_specs: CombatSpec,
        damage_dealt: u16,
        critical_hit: bool,
        xp_earned_adventurer: u16,
        xp_earned_items: u16,
        gold_earned: u16,
        curr_beast: u16,
        has_reward:u16
    }

    #[derive(Drop, starknet::Event)]
    struct RewardItemsCC {
        adventurer_state_with_bag: AdventurerStateWithBag,
        items: Array<LootWithPrice>,
    }

    #[derive(Drop, starknet::Event)]
    struct AdventurerUpgradedCC {
        adventurer_state_with_bag: AdventurerStateWithBag,
        strength_increase: u8,
        dexterity_increase: u8,
        vitality_increase: u8,
        intelligence_increase: u8,
        wisdom_increase: u8,
        charisma_increase: u8,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
    )
    {

    }

    #[external(v0)]
    impl CC of ICC<ContractState> {

        fn get_cave_cc(self: @ContractState, adventurer_id: felt252) -> CcCave {
            let cc_cave = _unpack_cc_cave(self, adventurer_id);
            cc_cave
        }

        fn get_attacking_beast_cc(self: @ContractState, adventurer_id: felt252, adventurer_entropy:felt252) -> Beast{
            let cc_cave = _unpack_cc_cave(self, adventurer_id);
            let (beast, beast_seed) = cc_cave.get_beast(adventurer_entropy);
            beast
        }

        fn get_beast_health_cc(self: @ContractState, adventurer_id: felt252) -> u16 {
            _unpack_cc_cave(self, adventurer_id).beast_health
        }

        fn enter_cc(ref self: ContractState,adventurer_id: felt252, cc_token_id: u256,adventurer: Adventurer,adventurer_entropy:felt252) -> u128 {
            let dungeon: DungeonSerde = CryptsAndCavernsTraitDispatcher {
                contract_address: contract_address_const::<
                    0x056834208d6a7cc06890a80ce523b5776755d68e960273c9ef3659b5f74fa494
                >()
            }
                .generate_dungeon(cc_token_id);

            let map_owner:ContractAddress = CryptsAndCavernsTraitDispatcher {
                        contract_address: contract_address_const::<
                            0x056834208d6a7cc06890a80ce523b5776755d68e960273c9ef3659b5f74fa494
                        >()
            }
            .owner_of(cc_token_id);

            let entity: EntityDataSerde = dungeon.entities;

            let limit = entity.entity_data.len();

            let mut count = 0;
            let mut i = 0;
            loop {
                if i == limit {
                    break;
                }

                if *(entity.entity_data)[i] == 1 {
                    count += 1;
                }

                i += 1;
            };

            let map_id:u16 = cc_token_id.try_into().expect('pack map_id');
            let cc_point:u16 = count.try_into().expect('pack cc_point');
            //todo
            // if cc_point > 0 {
            //     let pay_amount: u256 = cc_point.into() * 2 * 1000000000000000000;
            //     _payoutCC( ref self,get_caller_address(), pay_amount, map_owner);
            // }

            let mut cc_cave = _unpack_cc_cave(@self, adventurer_id);
            cc_cave.map_id = map_id;
            cc_cave.cc_points = cc_point;
            cc_cave.curr_beast = 0;
            cc_cave.has_reward = 0;

            let (beast,beast_seed) = cc_cave.get_beast(adventurer_entropy);
            cc_cave.set_beast_health(beast.starting_health);
            _pack_cc_cave(ref self, adventurer_id, cc_cave);
            __event_DiscoveredBeastCC(ref self, adventurer, adventurer_id, beast_seed, beast);
            __event_EnterCC(ref self,cc_cave);
            count
        }

        fn attack_cc(ref self: ContractState, adventurer_id: felt252, to_the_death: bool) {
            //todd

        }
    }


    // ------------------------------------------ //
    // ------------ Internal Functions ---------- //
    // ------------------------------------------ //


    fn __event_EnterCC(ref self: ContractState,cave:CcCave){
        self.emit(
            EnterCC {cave}
        );
    }

    fn __event_DiscoveredBeastCC(
        ref self: ContractState,
        adventurer: Adventurer,
        adventurer_id: felt252,
        seed: u128,
        beast: Beast
    ) {
        let adventurer_state = AdventurerState {
            owner: get_caller_address(), adventurer_id, adventurer
        };

        let discovered_beast_event = DiscoveredBeastCC {
            adventurer_state, seed, id: beast.id, beast_specs: beast.combat_spec,beast_heath:beast.starting_health
        };
        self.emit(discovered_beast_event);
    }

    fn __event_AdventurerUpgradedCC(
        ref self: ContractState,
        adventurer: Adventurer,
        adventurer_id: felt252,
        bag: Bag,
        stat_upgrades: Stats
    ) {
        let adventurer_state = AdventurerState {
            owner: get_caller_address(), adventurer_id, adventurer
        };
        let adventurer_state_with_bag = AdventurerStateWithBag { adventurer_state, bag };
        self
            .emit(
                AdventurerUpgradedCC {
                    adventurer_state_with_bag,
                    strength_increase: stat_upgrades.strength,
                    dexterity_increase: stat_upgrades.dexterity,
                    vitality_increase: stat_upgrades.vitality,
                    intelligence_increase: stat_upgrades.intelligence,
                    wisdom_increase: stat_upgrades.wisdom,
                    charisma_increase: stat_upgrades.charisma,
                }
            );
    }

    fn __event_SlayedBeastCC(
        ref self: ContractState,
        adventurer: Adventurer,
        adventurer_id: felt252,
        seed: u128,
        beast: Beast,
        damage_dealt: u16,
        critical_hit: bool,
        xp_earned_adventurer: u16,
        xp_earned_items: u16,
        gold_earned: u16,
        curr_beast: u16,
        has_reward: u16
    ) {
        let adventurer_state = AdventurerState {
            owner: get_caller_address(), adventurer_id, adventurer
        };
        let slayed_beast_event = SlayedBeastCC {
            adventurer_state,
            seed,
            id: beast.id,
            beast_specs: beast.combat_spec,
            damage_dealt,
            critical_hit,
            xp_earned_adventurer,
            xp_earned_items,
            gold_earned,
            curr_beast,
            has_reward,
        };
        self.emit(slayed_beast_event);
    }

    fn __event_AttackedBeastCC(
        ref self: ContractState,
        adventurer: Adventurer,
        adventurer_id: felt252,
        beast_battle_details: BattleDetails,
        beast_health: u16
    ) {
        let adventurer_state = AdventurerState {
            owner: get_caller_address(), adventurer_id, adventurer
        };
        self.emit(AttackedBeastCC { adventurer_state, beast_battle_details, beast_health });
    }

    fn __event_AttackedByBeastCC(
        ref self: ContractState,
        adventurer: Adventurer,
        adventurer_id: felt252,
        beast_battle_details: BattleDetails
    ) {
        let adventurer_state = AdventurerState {
            owner: get_caller_address(), adventurer_id, adventurer
        };
        self.emit(AttackedByBeastCC { adventurer_state, beast_battle_details });
    }

    fn _unpack_cc_cave(self: @ContractState, adventurer_id: felt252) -> CcCave {
        let cc_cave = self._cc_cave.read(adventurer_id);
        cc_cave
    }

    fn _pack_cc_cave(ref self: ContractState, adventurer_id: felt252, cc_cave: CcCave) {
        self._cc_cave.write(adventurer_id, cc_cave);
    }

    // fn _payoutCC(
    //     ref self: ContractState,
    //     caller: ContractAddress,
    //     amount:u256,
    //     map_owner: ContractAddress
    // ) {
    //
    //     let lords:ContractAddress = "0x05e367ac160e5f90c5775089b582dfc987dd148a5a2f977c49def2a6644f724b";
    //     IERC20CamelDispatcher { contract_address: lords }
    //         .transferFrom(caller, map_owner, amount);
    // }


    /// @notice Simulates an attack by a beast on an adventurer
    /// @dev This function determines a random attack location on the adventurer, retrieves armor and specials from that location, processes the beast attack, and deducts the damage from the adventurer's health.
    /// @param self The current contract state
    /// @param adventurer The adventurer being attacked
    /// @param adventurer_id The unique identifier of the adventurer
    /// @param beast The beast that is attacking
    /// @param beast_seed The seed associated with the beast
    /// @param entropy A random value to determine certain random aspects of the combat
    /// @param attack_location_rnd A random value used to determine the attack location on the adventurer
    /// @return Returns a BattleDetails object containing details of the beast's attack, including the seed, beast ID, combat specifications of the beast, total damage dealt, whether a critical hit was made, and the location of the attack on the adventurer.
    fn _beast_attack(
        ref self: ContractState,
        ref adventurer: Adventurer,
        adventurer_id: felt252,
        beast: Beast,
        beast_seed: u128,
        entropy: u128,
        attack_location_rnd: u128,
    ) -> BattleDetails {
        // beasts attack random location on adventurer
        let attack_location = AdventurerUtils::get_random_attack_location(
            attack_location_rnd.into()
        );

        // get armor at attack location
        let armor = adventurer.get_item_at_slot(attack_location);

        // get armor specials
        //todo
        let armor_specials =  ItemSpecials { special1: 0, special2: 0, special3: 0 };//_get_item_specials(@self, adventurer_id, armor);

        // process beast attack
        let (combat_result, jewlery_armor_bonus) = adventurer
            .defend(beast, armor, armor_specials, entropy);

        // deduct damage taken from adventurer's health
        adventurer.decrease_health(combat_result.total_damage);

        // return beast battle details
        BattleDetails {
            seed: beast_seed,
            id: beast.id,
            beast_specs: beast.combat_spec,
            damage: combat_result.total_damage,
            critical_hit: combat_result.critical_hit_bonus > 0,
            location: ImplCombat::slot_to_u8(attack_location),
        }
    }

    // @notice 模拟冒险者对野兽进行攻击。
    // @param self 合约的状态。
    // @param adventurer 发起攻击的冒险者。
    // @param adventurer_id 冒险者的唯一ID。
    // @param fight_to_the_death 指示是否战斗应持续到冒险者或野兽被击败的标志。
    fn _attack_cc(
        ref self: ContractState,
        ref adventurer: Adventurer,
        weapon_combat_spec: CombatSpec,
        adventurer_id: felt252,
        adventurer_entropy: felt252,
        beast: Beast,
        beast_seed: u128,
        game_entropy: felt252,
        fight_to_the_death: bool,
        ref cc_cave:CcCave
    ) {
        let (beast, beast_seed) = cc_cave.get_beast(adventurer_entropy);

        // get two random numbers using adventurer xp and health as part of entropy
        let (rnd1, rnd2) = AdventurerUtils::get_randomness_with_health(
            adventurer.xp, adventurer.health, adventurer_entropy, game_entropy
        );

        // attack beast and get combat result that provides damage breakdown
        let combat_result = adventurer.attack(weapon_combat_spec, beast, rnd1);

        // provide critical hit as a boolean for events
        let is_critical_hit = combat_result.critical_hit_bonus > 0;

        if (combat_result.total_damage >= cc_cave.beast_health) {
            //todo
            //            _process_beast_death_cc
        }else{
            cc_cave.beast_health -= combat_result.total_damage;

            //todo

            // process beast counter attack
            let attacked_by_beast_details = _beast_attack(
                ref self, ref adventurer, adventurer_id, beast, beast_seed, rnd1, rnd2,
            );

            // emit events
            __event_AttackedBeastCC(
                ref self,
                adventurer,
                adventurer_id,
                BattleDetails {
                    seed: beast_seed,
                    id: beast.id,
                    beast_specs: beast.combat_spec,
                    damage: combat_result.total_damage,
                    critical_hit: is_critical_hit,
                    location: ImplCombat::slot_to_u8(Slot::None(())),
                },
                cc_cave.beast_health
            );


            __event_AttackedByBeastCC(ref self, adventurer, adventurer_id, attacked_by_beast_details);


            // if the adventurer is still alive and fighting to the death
            if fight_to_the_death {
                // attack again
                _attack_cc(
                    ref self,
                    ref adventurer,
                    weapon_combat_spec,
                    adventurer_id,
                    adventurer_entropy,
                    beast,
                    beast_seed,
                    game_entropy,
                    true,
                    ref cc_cave
                );
            }

        }
    }

    fn _process_beast_death_cc(
        ref self: ContractState,
        ref adventurer: Adventurer,
        adventurer_id: felt252,
        beast: Beast,
        beast_seed: u128,
        attack_rnd_2: u128,
        damage_dealt: u16,
        critical_hit: bool,
        ref cc_cave: CcCave
    ) {
        // zero out beast health
        cc_cave.beast_health = 0;


        let gold_earned = beast.get_gold_reward(beast_seed);
        let ring_bonus = adventurer.ring.jewelry_gold_bonus(gold_earned);
        adventurer.increase_gold(gold_earned + ring_bonus);


        // get xp reward and increase adventurers xp
        let xp_earned_adventurer = beast.get_xp_reward();
        let (previous_level, new_level) = adventurer.increase_adventurer_xp(xp_earned_adventurer);

        // items use adventurer xp with an item multplier so they level faster than Adventurer
        let xp_earned_items = xp_earned_adventurer * ITEM_XP_MULTIPLIER_BEASTS;
        // assigning xp to items is more complex so we delegate to an internal function
        //todo
        // let items_leveled_up = _grant_xp_to_equipped_items(
        //     ref self, ref adventurer, adventurer_id, xp_earned_items, attack_rnd_2
        // );

        // emit slayed beast event
        __event_SlayedBeastCC(
            ref self,
            adventurer,
            adventurer_id,
            beast_seed,
            beast,
            damage_dealt,
            critical_hit,
            xp_earned_adventurer,
            xp_earned_items,
            gold_earned,
            cc_cave.curr_beast,
            cc_cave.has_reward,
        );

        // if any items leveled up
        // if items_leveled_up.len() != 0 {
        //     // emit event
        //     __event_ItemsLeveledUp(ref self, adventurer, adventurer_id, items_leveled_up);
        // }
        //
        // // if adventurer gained stat points
        // if (adventurer.stat_points_available != 0) {
        //     // emit events
        //     _emit_level_up_events(ref self, adventurer, adventurer_id, previous_level, new_level);
        // }


    }

}