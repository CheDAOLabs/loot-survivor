import { GameData } from "@/app/components/GameData";
import {
  DiscoveredHealthEvent,
  DiscoveredGoldEvent,
  StartGameEvent,
  UpgradeAvailableEvent,
  DiscoveredXPEvent,
  DodgedObstacleEvent,
  HitByObstacleEvent,
  DiscoveredBeastEvent,
  AmbushedByBeastEvent,
  AttackedBeastEvent,
  AttackedByBeastEvent,
  SlayedBeastEvent,
  FleeFailedEvent,
  FleeSucceededEvent,
  PurchasedItemsEvent,
  PurchasedPotionsEvent,
  EquippedItemsEvent,
  DroppedItemsEvent,
  GreatnessIncreasedEvent,
  ItemsLeveledUpEvent,
  NewHighScoreEvent,
  AdventurerDiedEvent,
  AdventurerLeveledUpEvent,
  NewItemsAvailableEvent,
  IdleDeathPenaltyEvent,
  AdventurerUpgradedEvent,
  AdventurerState,
  //CC
  EnterCCEvent,
  DiscoveredBeastEventCC,
  AttackedBeastEventCC,
  AttackedByBeastEventCC,
  SlayedBeastEventCC,
} from "../../types/events";
import { Adventurer } from "@/app/types";
import { feltToString } from ".";

type EventData =
  | DiscoveredHealthEvent
  | DiscoveredGoldEvent
  | StartGameEvent
  | UpgradeAvailableEvent
  | DiscoveredXPEvent
  | DodgedObstacleEvent
  | HitByObstacleEvent
  | DiscoveredBeastEvent
  | AmbushedByBeastEvent
  | AttackedBeastEvent
  | AttackedByBeastEvent
  | SlayedBeastEvent
  | FleeFailedEvent
  | FleeSucceededEvent
  | PurchasedItemsEvent
  | PurchasedPotionsEvent
  | EquippedItemsEvent
  | DroppedItemsEvent
  | GreatnessIncreasedEvent
  | ItemsLeveledUpEvent
  | NewHighScoreEvent
  | AdventurerDiedEvent
  | AdventurerLeveledUpEvent
  | NewItemsAvailableEvent
  | IdleDeathPenaltyEvent
  | AdventurerUpgradedEvent
  //CC
  | EnterCCEvent
  | DiscoveredBeastEventCC
  | AttackedBeastEventCC
  | AttackedByBeastEventCC
  | SlayedBeastEventCC
    ;

function createBaseItems(data: AdventurerState) {
  const gameData = new GameData();
  let items = [];
  for (let i = 1; i <= 101; i++) {
    items.push({
      item: gameData.ITEMS[i],
      adventurerId: data.adventurerId,
      owner: false,
      equipped: false,
      ownerAddress: data.owner,
      xp: 0,
      special1: null,
      special2: null,
      special3: null,
      isAvailable: false,
      purchasedTime: 0,
      timestamp: new Date(),
    });
  }
  return items;
}

function processAdventurerState(data: any, currentAdventurer?: any) {
  const gameData = new GameData();
  const updateAdventurerDoc: Adventurer = {
    id: data.adventurerState["adventurerId"].low,
    owner: data.adventurerState["owner"],
    lastAction: data.adventurerState["adventurer"]["lastAction"],
    health: data.adventurerState["adventurer"]["health"],
    xp: data.adventurerState["adventurer"]["xp"],
    strength: data.adventurerState["adventurer"]["stats"]["strength"],
    dexterity: data.adventurerState["adventurer"]["stats"]["dexterity"],
    vitality: data.adventurerState["adventurer"]["stats"]["vitality"],
    intelligence: data.adventurerState["adventurer"]["stats"]["intelligence"],
    wisdom: data.adventurerState["adventurer"]["stats"]["wisdom"],
    charisma: data.adventurerState["adventurer"]["stats"]["charisma"],
    gold: data.adventurerState["adventurer"]["gold"],
    weapon: gameData.ITEMS[data.adventurerState["adventurer"]["weapon"]["id"]],
    chest: gameData.ITEMS[data.adventurerState["adventurer"]["chest"]["id"]],
    head: gameData.ITEMS[data.adventurerState["adventurer"]["head"]["id"]],
    waist: gameData.ITEMS[data.adventurerState["adventurer"]["waist"]["id"]],
    foot: gameData.ITEMS[data.adventurerState["adventurer"]["foot"]["id"]],
    hand: gameData.ITEMS[data.adventurerState["adventurer"]["hand"]["id"]],
    neck: gameData.ITEMS[data.adventurerState["adventurer"]["neck"]["id"]],
    ring: gameData.ITEMS[data.adventurerState["adventurer"]["ring"]["id"]],
    beastHealth: data.adventurerState["adventurer"]["beastHealth"],
    statUpgrades: data.adventurerState["adventurer"]["statPointsAvailable"],
    name: currentAdventurer["name"],
    homeRealm: currentAdventurer["homeRealm"],
    classType: currentAdventurer["classType"],
    entropy: currentAdventurer["entropy"],
    createdTime: currentAdventurer.createdTime,
    lastUpdatedTime: new Date(), // Use this date for now though it is block_timestamp in indexer
    timestamp: new Date(), // Equivalent to datetime.now() in Python.
  };
  return updateAdventurerDoc;
}

export function processPurchases(data: any, adventurerState: any) {
  const gameData = new GameData();
  const purchasedItems = [];
  for (let item of data) {
    purchasedItems.push({
      item: gameData.ITEMS[item.item.id],
      adventurerId: adventurerState["adventurerId"].low,
      owner: true,
      equipped: false,
      ownerAddress: adventurerState["owner"],
      xp: 0,
      special1: null,
      special2: null,
      special3: null,
      isAvailable: false,
      purchasedTime: new Date(),
      timestamp: new Date(),
    });
  }
  return purchasedItems;
}

export function processItemsXP(data: any) {
  const itemsXP = [
    data.adventurerState["adventurer"]["weapon"]["xp"],
    data.adventurerState["adventurer"]["chest"]["xp"],
    data.adventurerState["adventurer"]["head"]["xp"],
    data.adventurerState["adventurer"]["waist"]["xp"],
    data.adventurerState["adventurer"]["foot"]["xp"],
    data.adventurerState["adventurer"]["hand"]["xp"],
    data.adventurerState["adventurer"]["neck"]["xp"],
    data.adventurerState["adventurer"]["ring"]["xp"],
  ];
  return itemsXP;
}

export function processItemLevels(data: any) {
  const gameData = new GameData();
  const itemLevels = [];
  const items = data.items;
  for (let item of items) {
    itemLevels.push({
      item: gameData.ITEMS[item.itemId],
      suffixUnlocked: item.suffixUnlocked,
      prefixesUnlocked: item.prefixesUnlocked,
      special1: gameData.ITEM_SUFFIXES[item.specials.special1],
      special2: gameData.ITEM_NAME_PREFIXES[item.specials.special2],
      special3: gameData.ITEM_NAME_SUFFIXES[item.specials.special3],
    });
  }
  return itemLevels;
}

export function processData(
  event: EventData,
  eventName: string,
  txHash?: string,
  currentAdventurer?: any
) {
  const gameData = new GameData();
  switch (eventName) {
    case "StartGame":
      const startGameEvent = event as StartGameEvent;
      const updateAdventurerDoc: Adventurer = {
        id: startGameEvent.adventurerState["adventurerId"].low,
        owner: startGameEvent.adventurerState["owner"],
        lastAction: startGameEvent.adventurerState["adventurer"]["lastAction"],
        health: startGameEvent.adventurerState["adventurer"]["health"],
        xp: startGameEvent.adventurerState["adventurer"]["xp"],
        strength:
          startGameEvent.adventurerState["adventurer"]["stats"]["strength"],
        dexterity:
          startGameEvent.adventurerState["adventurer"]["stats"]["dexterity"],
        vitality:
          startGameEvent.adventurerState["adventurer"]["stats"]["vitality"],
        intelligence:
          startGameEvent.adventurerState["adventurer"]["stats"]["intelligence"],
        wisdom: startGameEvent.adventurerState["adventurer"]["stats"]["wisdom"],
        charisma:
          startGameEvent.adventurerState["adventurer"]["stats"]["charisma"],
        gold: startGameEvent.adventurerState["adventurer"]["gold"],
        weapon:
          gameData.ITEMS[
            startGameEvent.adventurerState["adventurer"]["weapon"]["id"]
          ],
        chest:
          gameData.ITEMS[
            startGameEvent.adventurerState["adventurer"]["chest"]["id"]
          ],
        head: gameData.ITEMS[
          startGameEvent.adventurerState["adventurer"]["head"]["id"]
        ],
        waist:
          gameData.ITEMS[
            startGameEvent.adventurerState["adventurer"]["waist"]["id"]
          ],
        foot: gameData.ITEMS[
          startGameEvent.adventurerState["adventurer"]["foot"]["id"]
        ],
        hand: gameData.ITEMS[
          startGameEvent.adventurerState["adventurer"]["hand"]["id"]
        ],
        neck: gameData.ITEMS[
          startGameEvent.adventurerState["adventurer"]["neck"]["id"]
        ],
        ring: gameData.ITEMS[
          startGameEvent.adventurerState["adventurer"]["ring"]["id"]
        ],
        beastHealth:
          startGameEvent.adventurerState["adventurer"]["beastHealth"],
        statUpgrades:
          startGameEvent.adventurerState["adventurer"]["statPointsAvailable"],
        name: feltToString(startGameEvent.adventurerMeta["name"]),
        homeRealm: startGameEvent.adventurerMeta["homeRealm"],
        classType: gameData.CLASSES[startGameEvent.adventurerMeta["class"]],
        entropy: startGameEvent.adventurerMeta["entropy"],
        createdTime: new Date(),
        lastUpdatedTime: new Date(), // Use this date for now though it is block_timestamp in indexer
        timestamp: new Date(),
      };
      const items = createBaseItems(startGameEvent.adventurerState);
      return [updateAdventurerDoc, items];
    case "AdventurerUpgraded":
      const adventurerUpgradedEvent = event as AdventurerUpgradedEvent;
      return processAdventurerState(adventurerUpgradedEvent, currentAdventurer);
    case "DiscoveredHealth":
      const discoveredHealthEvent = event as DiscoveredHealthEvent;
      const discoveredHealthAdventurerData = processAdventurerState(
        discoveredHealthEvent,
        currentAdventurer
      );
      const discoverHealthData = {
        txHash: txHash,
        adventurerId: discoveredHealthEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          discoveredHealthEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[3],
        subDiscoveryType: gameData.ITEM_DISCOVERY_TYPES[1],
        outputAmount: discoveredHealthEvent.healthAmount,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      return [discoveredHealthAdventurerData, discoverHealthData];
    case "DiscoveredGold":
      const discoveredGoldEvent = event as DiscoveredGoldEvent;
      const discoveredGoldAdventurerData = processAdventurerState(
        discoveredGoldEvent,
        currentAdventurer
      );
      const discoverGoldData = {
        txHash: txHash,
        adventurerId: discoveredGoldEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          discoveredGoldEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[3],
        subDiscoveryType: gameData.ITEM_DISCOVERY_TYPES[2],
        outputAmount: discoveredGoldEvent.goldAmount,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };

      return [discoveredGoldAdventurerData, discoverGoldData];
    case "DiscoveredXP":
      const discoveredXPEvent = event as DiscoveredXPEvent;
      const discoveredXPAdventurerData = processAdventurerState(
        discoveredXPEvent,
        currentAdventurer
      );
      const discoverXPData = {
        txHash: txHash,
        adventurerId: discoveredXPEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          discoveredXPEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[3],
        subDiscoveryType: gameData.ITEM_DISCOVERY_TYPES[3],
        outputAmount: discoveredXPEvent.xpAmount,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };

      return [discoveredXPAdventurerData, discoverXPData];
    case "DodgedObstacle":
      const dodgedObstacleEvent = event as DodgedObstacleEvent;
      const dodgedObstacleAdventurerData = processAdventurerState(
        dodgedObstacleEvent,
        currentAdventurer
      );
      const dodgedObstacleData = {
        txHash: txHash,
        adventurerId: dodgedObstacleEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          dodgedObstacleEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[2],
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: gameData.OBSTACLES[dodgedObstacleEvent.id],
        obstacleLevel: dodgedObstacleEvent.level,
        dodgedObstacle: true,
        damageTaken: dodgedObstacleEvent.damageTaken,
        damageLocation: gameData.SLOTS[dodgedObstacleEvent.damageLocation],
        xpEarnedAdventurer: dodgedObstacleEvent.xpEarnedAdventurer,
        xpEarnedItems: dodgedObstacleEvent.xpEarnedItems,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      const dodgedObstacleItemsXP = processItemsXP(dodgedObstacleEvent);
      return [
        dodgedObstacleAdventurerData,
        dodgedObstacleData,
        dodgedObstacleItemsXP,
      ];
    case "HitByObstacle":
      const hitByObstacleEvent = event as HitByObstacleEvent;
      const hitByObstacleAdventurerData = processAdventurerState(
        hitByObstacleEvent,
        currentAdventurer
      );
      const hitByObstacleData = {
        txHash: txHash,
        adventurerId: hitByObstacleEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          hitByObstacleEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[2],
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: gameData.OBSTACLES[hitByObstacleEvent.id],
        obstacleLevel: hitByObstacleEvent.level,
        dodgedObstacle: false,
        damageTaken: hitByObstacleEvent.damageTaken,
        damageLocation: gameData.SLOTS[hitByObstacleEvent.damageLocation],
        xpEarnedAdventurer: hitByObstacleEvent.xpEarnedAdventurer,
        xpEarnedItems: hitByObstacleEvent.xpEarnedItems,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      const hitByObstacleItemsXP = processItemsXP(hitByObstacleEvent);
      return [
        hitByObstacleAdventurerData,
        hitByObstacleData,
        hitByObstacleItemsXP,
      ];
    case "DiscoveredBeast":
      const discoveredBeastEvent = event as DiscoveredBeastEvent;
      const discoveredBeastAdventurerData = processAdventurerState(
        discoveredBeastEvent,
        currentAdventurer
      );
      const discoveredBeastData = {
        txHash: txHash,
        adventurerId: discoveredBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          discoveredBeastEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[1],
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: 0,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: gameData.BEASTS[discoveredBeastEvent.id],
        entityLevel: discoveredBeastEvent.beastSpecs["level"],
        entityHealth:
          discoveredBeastEvent.adventurerState["adventurer"]["beastHealth"],
        special1:
          gameData.ITEM_SUFFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_PREFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_NAME_SUFFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special3"]
          ],
        ambushed: false,
        seed: discoveredBeastEvent.seed,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      const discoveredBeastBeastData = {
        beast: gameData.BEASTS[discoveredBeastEvent.id],
        health:
          discoveredBeastEvent.adventurerState["adventurer"]["beastHealth"],
        level: discoveredBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_SUFFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_PREFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_NAME_SUFFIXES[
            discoveredBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: discoveredBeastEvent.seed,
        adventurerId: discoveredBeastEvent.adventurerState["adventurerId"].low,
        slainOnTime: null,
        createdTime: new Date(),
        lastUpdatedTime: new Date(),
        timestamp: new Date(),
      };
      return [
        discoveredBeastAdventurerData,
        discoveredBeastData,
        discoveredBeastBeastData,
      ];
    case "AmbushedByBeast":
      const ambushedByBeastEvent = event as AmbushedByBeastEvent;
      const ambushedByBeastAdventurerData = processAdventurerState(
        ambushedByBeastEvent,
        currentAdventurer
      );
      const ambushedByBeastData = {
        txHash: txHash,
        adventurerId: ambushedByBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          ambushedByBeastEvent.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[1],
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: 0,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: gameData.BEASTS[ambushedByBeastEvent.id],
        entityLevel: ambushedByBeastEvent.beastSpecs["level"],
        entityHealth:
          ambushedByBeastEvent.adventurerState["adventurer"]["beastHealth"],
        special1:
          gameData.ITEM_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_PREFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_NAME_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special3"]
          ],
        ambushed: true,
        seed: ambushedByBeastEvent.seed,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      const ambushedByBeastBeastData = {
        beast: gameData.BEASTS[ambushedByBeastEvent.id],
        health:
          ambushedByBeastEvent.adventurerState["adventurer"]["beastHealth"],
        level: ambushedByBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_PREFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_NAME_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: ambushedByBeastEvent.seed,
        adventurerId: ambushedByBeastEvent.adventurerState["adventurerId"].low,
        slainOnTime: null,
        createdTime: new Date(),
        lastUpdatedTime: new Date(),
        timestamp: new Date(),
      };
      const ambushedByBeastAttackData = {
        txHash: txHash,
        beast: gameData.BEASTS[ambushedByBeastEvent.id],
        beastHealth:
          ambushedByBeastEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: ambushedByBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_PREFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_NAME_SUFFIXES[
            ambushedByBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: ambushedByBeastEvent.seed,
        adventurerId: ambushedByBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          ambushedByBeastEvent.adventurerState["adventurer"]["health"],
        attacker: "Beast",
        fled: null,
        damageDealt: 0,
        criticalHit: ambushedByBeastEvent.criticalHit,
        damageTaken: ambushedByBeastEvent.damage,
        damageLocation: gameData.SLOTS[ambushedByBeastEvent.location],
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [
        ambushedByBeastAdventurerData,
        ambushedByBeastData,
        ambushedByBeastBeastData,
        ambushedByBeastAttackData,
      ];
    case "AttackedBeast":
      const attackedBeastEvent = event as AttackedBeastEvent;
      const attackedBeastAdventurerData = processAdventurerState(
        attackedBeastEvent,
        currentAdventurer
      );
      const attackedBeastData = {
        txHash: txHash,
        beast: gameData.BEASTS[attackedBeastEvent.id],
        beastHealth:
          attackedBeastEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: attackedBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_NAME_PREFIXES[
            attackedBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_SUFFIXES[
            attackedBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_SUFFIXES[
            attackedBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: attackedBeastEvent.seed,
        adventurerId: attackedBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          attackedBeastEvent.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: null,
        damageDealt: attackedBeastEvent.damage,
        criticalHit: attackedBeastEvent.criticalHit,
        damageTaken: 0,
        damageLocation: gameData.SLOTS[attackedBeastEvent.location],
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [attackedBeastAdventurerData, attackedBeastData];
    case "AttackedByBeast":
      const attackedByBeastEvent = event as AttackedByBeastEvent;
      const attackedByBeastAdventurerData = processAdventurerState(
        attackedByBeastEvent,
        currentAdventurer
      );
      const attackedByBeastData = {
        txHash: txHash,
        beast: gameData.BEASTS[attackedByBeastEvent.id],
        beastHealth:
          attackedByBeastEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: attackedByBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_NAME_PREFIXES[
            attackedByBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_SUFFIXES[
            attackedByBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_SUFFIXES[
            attackedByBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: attackedByBeastEvent.seed,
        adventurerId: attackedByBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          attackedByBeastEvent.adventurerState["adventurer"]["health"],
        attacker: "Beast",
        fled: null,
        damageDealt: 0,
        criticalHit: attackedByBeastEvent.criticalHit,
        damageTaken: attackedByBeastEvent.damage,
        damageLocation: gameData.SLOTS[attackedByBeastEvent.location],
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [attackedByBeastAdventurerData, attackedByBeastData];
    case "SlayedBeast":
      const slayedBeastEvent = event as SlayedBeastEvent;
      const slayedBeastAdventurerData = processAdventurerState(
        slayedBeastEvent,
        currentAdventurer
      );
      const slayedBeastData = {
        txHash: txHash,
        beast: gameData.BEASTS[slayedBeastEvent.id],
        beastHealth:
          slayedBeastEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: slayedBeastEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_NAME_PREFIXES[
            slayedBeastEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_SUFFIXES[
            slayedBeastEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_SUFFIXES[
            slayedBeastEvent.beastSpecs["specials"]["special3"]
          ],
        seed: slayedBeastEvent.seed,
        adventurerId: slayedBeastEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          slayedBeastEvent.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: null,
        damageDealt: slayedBeastEvent.damageDealt,
        criticalHit: slayedBeastEvent.criticalHit,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: slayedBeastEvent.xpEarnedAdventurer,
        xpEarnedItems: slayedBeastEvent.xpEarnedItems,
        goldEarned: slayedBeastEvent.goldEarned,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      const slayedBeastItemsXP = processItemsXP(slayedBeastEvent);
      return [slayedBeastAdventurerData, slayedBeastData, slayedBeastItemsXP];
    case "FleeFailed":
      const fleeFailedEvent = event as FleeFailedEvent;
      const fleeFailedAdventurerData = processAdventurerState(
        fleeFailedEvent,
        currentAdventurer
      );
      const fleeFailedData = {
        txHash: txHash,
        beast: gameData.BEASTS[fleeFailedEvent.id],
        beastHealth:
          fleeFailedEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: fleeFailedEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_NAME_PREFIXES[
            fleeFailedEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_SUFFIXES[
            fleeFailedEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_SUFFIXES[
            fleeFailedEvent.beastSpecs["specials"]["special3"]
          ],
        seed: fleeFailedEvent.seed,
        adventurerId: fleeFailedEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          fleeFailedEvent.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: null,
        damageDealt: 0,
        criticalHit: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [fleeFailedAdventurerData, fleeFailedData];
    case "FleeSucceeded":
      const fleeSucceededEvent = event as FleeSucceededEvent;
      const fleeSucceededAdventurerData = processAdventurerState(
        fleeSucceededEvent,
        currentAdventurer
      );
      const fleeSucceededData = {
        txHash: txHash,
        beast: gameData.BEASTS[fleeSucceededEvent.id],
        beastHealth:
          fleeSucceededEvent.adventurerState["adventurer"]["beastHealth"],
        beastLevel: fleeSucceededEvent.beastSpecs["level"],
        special1:
          gameData.ITEM_NAME_PREFIXES[
            fleeSucceededEvent.beastSpecs["specials"]["special1"]
          ],
        special2:
          gameData.ITEM_NAME_SUFFIXES[
            fleeSucceededEvent.beastSpecs["specials"]["special2"]
          ],
        special3:
          gameData.ITEM_SUFFIXES[
            fleeSucceededEvent.beastSpecs["specials"]["special3"]
          ],
        seed: fleeSucceededEvent.seed,
        adventurerId: fleeSucceededEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          fleeSucceededEvent.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: true,
        damageDealt: 0,
        criticalHit: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [fleeSucceededAdventurerData, fleeSucceededData];
    case "PurchasedItems":
      const purchasedItemsEvent = event as PurchasedItemsEvent;
      const purchasedItemsAdventurerData = processAdventurerState(
        purchasedItemsEvent.adventurerStateWithBag,
        currentAdventurer
      );
      const purchases = processPurchases(
        purchasedItemsEvent.purchases,
        purchasedItemsEvent.adventurerStateWithBag.adventurerState
      );
      return [purchasedItemsAdventurerData, purchases];
    case "PurchasedPotions":
      const purchasedPotionsEvent = event as PurchasedPotionsEvent;
      return processAdventurerState(purchasedPotionsEvent, currentAdventurer);
    case "EquippedItems":
      const equippedItemsEvent = event as EquippedItemsEvent;
      const equipedItemsAdventurerData = processAdventurerState(
        equippedItemsEvent.adventurerStateWithBag,
        currentAdventurer
      );
      const formattedEquippedItems = [];
      for (let i = 0; i < equippedItemsEvent.equippedItems.length; i++) {
        formattedEquippedItems.push(
          gameData.ITEMS[equippedItemsEvent.equippedItems[i]]
        );
      }
      const formattedUnequippedItems = [];
      for (let i = 0; i < equippedItemsEvent.unequippedItems.length; i++) {
        formattedUnequippedItems.push(
          gameData.ITEMS[equippedItemsEvent.unequippedItems[i]]
        );
      }
      return [
        equipedItemsAdventurerData,
        formattedEquippedItems,
        formattedUnequippedItems,
      ];
    case "DroppedItems":
      const droppedItemsEvent = event as DroppedItemsEvent;
      const droppedItemsAdventurerData = processAdventurerState(
        droppedItemsEvent.adventurerStateWithBag,
        currentAdventurer
      );
      const formattedDroppedItems = [];
      for (let i = 0; i < droppedItemsEvent.itemIds.length; i++) {
        formattedDroppedItems.push(
          gameData.ITEMS[droppedItemsEvent.itemIds[i]]
        );
      }
      return [droppedItemsAdventurerData, formattedDroppedItems];
    case "GreatnessIncreased":
      const greatnessIncreasedEvent = event as GreatnessIncreasedEvent;
      return processAdventurerState(greatnessIncreasedEvent, currentAdventurer);
    case "ItemsLeveledUp":
      const itemsLeveledUpEvent = event as ItemsLeveledUpEvent;
      const itemSpecialUnlockedAdventurerData = processAdventurerState(
        itemsLeveledUpEvent,
        currentAdventurer
      );
      const itemLevels = processItemLevels(itemsLeveledUpEvent);
      return [itemSpecialUnlockedAdventurerData, itemLevels];
    case "NewHighScore":
      const newHishScoreEvent = event as NewHighScoreEvent;
      return processAdventurerState(newHishScoreEvent, currentAdventurer);
    case "AdventurerDied":
      const adventurerDiedEvent = event as AdventurerDiedEvent;
      const adventurerDiedAdventurerData = processAdventurerState(
        adventurerDiedEvent,
        currentAdventurer
      );
      const adventurerDiedData = {
        killedByBeast: adventurerDiedEvent.killedByBeast,
        killedByObstacle: adventurerDiedEvent.killedByObstacle,
        callerAddress: adventurerDiedEvent.callerAddress,
      };
      return [adventurerDiedAdventurerData, adventurerDiedData];
    case "AdventurerLeveledUp":
      const adventurerLeveledUpEvent = event as AdventurerLeveledUpEvent;
      return processAdventurerState(
        adventurerLeveledUpEvent,
        currentAdventurer
      );
    case "NewItemsAvailable":
      const newItemsAvailableEvent = event as NewItemsAvailableEvent;
      const newItemsAvailableAdventurerData = processAdventurerState(
        newItemsAvailableEvent,
        currentAdventurer
      );
      const formattedNewItems = [];
      for (let i = 0; i < newItemsAvailableEvent.items.length; i++) {
        formattedNewItems.push(gameData.ITEMS[newItemsAvailableEvent.items[i]]);
      }
      return [newItemsAvailableAdventurerData, formattedNewItems];
    case "IdleDeathPenalty":
      const idleDeathPenaltyEvent = event as IdleDeathPenaltyEvent;
      const penaltyAdventurerData = processAdventurerState(
        idleDeathPenaltyEvent,
        currentAdventurer
      );
      const penaltyBattleData = {
        txHash: txHash,
        beast: null,
        beastHealth: 0,
        beastLevel: 0,
        special1: null,
        special2: null,
        special3: null,
        seed: 0,
        adventurerId: idleDeathPenaltyEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          idleDeathPenaltyEvent.adventurerState["adventurer"]["health"],
        attacker: null,
        fled: null,
        damageDealt: 0,
        criticalHit: false,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      const penaltyDiscoveryData = {
        txHash: txHash,
        adventurerId: idleDeathPenaltyEvent.adventurerState["adventurerId"].low,
        adventurerHealth:
          idleDeathPenaltyEvent.adventurerState["adventurer"]["health"],
        discoveryType: null,
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: 0,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: null,
        entityLevel: null,
        entityHealth: 0,
        special1: null,
        special2: null,
        special3: null,
        ambushed: false,
        seed: 0,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      return [penaltyAdventurerData, penaltyBattleData, penaltyDiscoveryData];
    case "EnterCC":
        const enterCCEvent = event as EnterCCEvent;
      // curr_beast:u16,
      //     cc_points:u16,
      //   beast_health:u16, // 9 bits
      //   beast_amount:u16,
      //   beast_id: u16, // 9 bits
        const enterCCData = {
            txHash: txHash,
            map_id: enterCCEvent.map_id,
            curr_beast: enterCCEvent.curr_beast,
            cc_points: enterCCEvent.cc_points,
            beast_health: enterCCEvent.beast_health,
            beast_amount: enterCCEvent.beast_amount,
            has_reward:false,
            strength_increase: 0, // 9 bits
            dexterity_increase: 0, // 9 bits
            vitality_increase: 0, // 9 bits
            intelligence_increase: 0, // 9 bits
            wisdom_increase: 0, // 9 bits
            charisma_increase: 0, // 9 bit
        }
      return [
        enterCCData
      ];
    case "DiscoveredBeastCC":
      console.log("processData DiscoveredBeastCC");
      const discoveredBeastEventCC = event as DiscoveredBeastEventCC;
      const discoveredBeastAdventurerDataCC = processAdventurerState(
          discoveredBeastEventCC,
          currentAdventurer
      );
      const discoveredBeastDataCC = {
        txHash: txHash,
        adventurerId: discoveredBeastEventCC.adventurerState["adventurerId"].low,
        adventurerHealth:
            discoveredBeastEventCC.adventurerState["adventurer"]["health"],
        discoveryType: gameData.DISCOVERY_TYPES[1],
        subDiscoveryType: null,
        outputAmount: 0,
        obstacle: null,
        obstacleLevel: null,
        dodgedObstacle: 0,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: null,
        xpEarnedItems: null,
        entity: gameData.BEASTS[discoveredBeastEventCC.id],
        entityLevel: discoveredBeastEventCC.beastSpecs["level"],
        entityHealth:
            discoveredBeastEventCC.adventurerState["adventurer"]["beastHealth"],
        special1:
            gameData.ITEM_SUFFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special1"]
                ],
        special2:
            gameData.ITEM_NAME_PREFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special2"]
                ],
        special3:
            gameData.ITEM_NAME_SUFFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special3"]
                ],
        ambushed: false,
        seed: discoveredBeastEventCC.seed,
        discoveryTime: new Date(),
        timestamp: new Date(),
      };
      const discoveredBeastBeastDataCC = {
        beast: gameData.BEASTS[discoveredBeastEventCC.id],
        health:discoveredBeastEventCC.beastHealth,
        level: discoveredBeastEventCC.beastSpecs["level"],
        special1:
            gameData.ITEM_SUFFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special1"]
                ],
        special2:
            gameData.ITEM_NAME_PREFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special2"]
                ],
        special3:
            gameData.ITEM_NAME_SUFFIXES[
                discoveredBeastEventCC.beastSpecs["specials"]["special3"]
                ],
        seed: discoveredBeastEventCC.seed,
        adventurerId: discoveredBeastEventCC.adventurerState["adventurerId"].low,
        slainOnTime: null,
        createdTime: new Date(),
        lastUpdatedTime: new Date(),
        timestamp: new Date(),
      };
      return [
        discoveredBeastAdventurerDataCC,
        discoveredBeastDataCC,
        discoveredBeastBeastDataCC,
      ];
    case "AttackedBeastCC":
      const attackedBeastEventCC = event as AttackedBeastEventCC;
      const attackedBeastAdventurerDataCC = processAdventurerState(
          attackedBeastEventCC,
          currentAdventurer
      );
      const attackedBeastDataCC = {
        txHash: txHash,
        beast: gameData.BEASTS[attackedBeastEventCC.id],
        beastHealth:attackedBeastEventCC.beastHealth,
            //attackedBeastEventCC.adventurerState["adventurer"]["beastHealth"],
        beastLevel: attackedBeastEventCC.beastSpecs["level"],
        special1:
            gameData.ITEM_NAME_PREFIXES[
                attackedBeastEventCC.beastSpecs["specials"]["special1"]
                ],
        special2:
            gameData.ITEM_NAME_SUFFIXES[
                attackedBeastEventCC.beastSpecs["specials"]["special2"]
                ],
        special3:
            gameData.ITEM_SUFFIXES[
                attackedBeastEventCC.beastSpecs["specials"]["special3"]
                ],
        seed: attackedBeastEventCC.seed,
        adventurerId: attackedBeastEventCC.adventurerState["adventurerId"].low,
        adventurerHealth:
            attackedBeastEventCC.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: null,
        damageDealt: attackedBeastEventCC.damage,
        criticalHit: attackedBeastEventCC.criticalHit,
        damageTaken: 0,
        damageLocation: gameData.SLOTS[attackedBeastEventCC.location],
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [attackedBeastAdventurerDataCC, attackedBeastDataCC];
    case "AttackedByBeastCC":
      const attackedByBeastEventCC = event as AttackedByBeastEventCC;
      const attackedByBeastAdventurerDataCC = processAdventurerState(
          attackedByBeastEventCC,
          currentAdventurer
      );
      const attackedByBeastDataCC = {
        txHash: txHash,
        beast: gameData.BEASTS[attackedByBeastEventCC.id],
        beastHealth:
            attackedByBeastEventCC.adventurerState["adventurer"]["beastHealth"],
        beastLevel: attackedByBeastEventCC.beastSpecs["level"],
        special1:
            gameData.ITEM_NAME_PREFIXES[
                attackedByBeastEventCC.beastSpecs["specials"]["special1"]
                ],
        special2:
            gameData.ITEM_NAME_SUFFIXES[
                attackedByBeastEventCC.beastSpecs["specials"]["special2"]
                ],
        special3:
            gameData.ITEM_SUFFIXES[
                attackedByBeastEventCC.beastSpecs["specials"]["special3"]
                ],
        seed: attackedByBeastEventCC.seed,
        adventurerId: attackedByBeastEventCC.adventurerState["adventurerId"].low,
        adventurerHealth:
            attackedByBeastEventCC.adventurerState["adventurer"]["health"],
        attacker: "Beast",
        fled: null,
        damageDealt: 0,
        criticalHit: attackedByBeastEventCC.criticalHit,
        damageTaken: attackedByBeastEventCC.damage,
        damageLocation: gameData.SLOTS[attackedByBeastEventCC.location],
        xpEarnedAdventurer: 0,
        xpEarnedItems: 0,
        goldEarned: 0,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
      };
      return [attackedByBeastAdventurerDataCC, attackedByBeastDataCC];
    case "SlayedBeastCC":
      const slayedBeastEventCC = event as SlayedBeastEventCC;
      const slayedBeastAdventurerDataCC = processAdventurerState(
          slayedBeastEventCC,
          currentAdventurer
      );
      const slayedBeastDataCC = {
        txHash: txHash,
        beast: gameData.BEASTS[slayedBeastEventCC.id],
        beastHealth:
            slayedBeastEventCC.adventurerState["adventurer"]["beastHealth"],
        beastLevel: slayedBeastEventCC.beastSpecs["level"],
        special1:
            gameData.ITEM_NAME_PREFIXES[
                slayedBeastEventCC.beastSpecs["specials"]["special1"]
                ],
        special2:
            gameData.ITEM_NAME_SUFFIXES[
                slayedBeastEventCC.beastSpecs["specials"]["special2"]
                ],
        special3:
            gameData.ITEM_SUFFIXES[
                slayedBeastEventCC.beastSpecs["specials"]["special3"]
                ],
        seed: slayedBeastEventCC.seed,
        adventurerId: slayedBeastEventCC.adventurerState["adventurerId"].low,
        adventurerHealth:
            slayedBeastEventCC.adventurerState["adventurer"]["health"],
        attacker: "Adventurer",
        fled: null,
        damageDealt: slayedBeastEventCC.damageDealt,
        criticalHit: slayedBeastEventCC.criticalHit,
        damageTaken: 0,
        damageLocation: null,
        xpEarnedAdventurer: slayedBeastEventCC.xpEarnedAdventurer,
        xpEarnedItems: slayedBeastEventCC.xpEarnedItems,
        goldEarned: slayedBeastEventCC.goldEarned,
        discoveryTime: new Date(),
        blockTime: new Date(),
        timestamp: new Date(),
        curr_beast:slayedBeastEventCC.curr_beast
      };
      const slayedBeastItemsXPCC = processItemsXP(slayedBeastEventCC);
      return [slayedBeastAdventurerDataCC, slayedBeastDataCC, slayedBeastItemsXPCC];
    case "AdventurerUpgradedCC":
      const adventurerUpgradedEventCC = event as AdventurerUpgradedEvent;
      return processAdventurerState(adventurerUpgradedEventCC, currentAdventurer);
  }
}
