import { useEffect, useState } from "react";
import { useContracts } from "../hooks/useContracts";
import {
  getItemData,
  getValueFromKey,
  getItemPrice,
  getPotionPrice,
} from "../lib/utils";
import { GameData } from "../components/GameData";
import VerticalKeyboardControl from "../components/menu/VerticalMenu";
import useLoadingStore from "../hooks/useLoadingStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import useTransactionCartStore from "../hooks/useTransactionCartStore";
import Info from "../components/adventurer/Info";
import { Button } from "../components/buttons/Button";
import {
  ArrowTargetIcon,
  CatIcon,
  CoinIcon,
  CoinCharismaIcon,
  HeartVitalityIcon,
  LightbulbIcon,
  ScrollIcon,
  HealthPotionIcon,
  HeartIcon,
} from "../components/icons/Icons";
import PurchaseHealth from "../components/actions/PurchaseHealth";
import MarketplaceScreen from "./MarketplaceScreen";
import { UpgradeNav } from "../components/upgrade/UpgradeNav";
import { StatAttribute } from "../components/upgrade/StatAttribute";
import useUIStore from "../hooks/useUIStore";
import { UpgradeStats, ZeroUpgrade, UpgradeSummary } from "../types";
import Summary from "../components/upgrade/Summary";
import { HealthCountDown } from "../components/CountDown";

interface UpgradeScreenProps {
  upgrade: (...args: any[]) => any;
}

/**
 * @container
 * @description Provides the upgrade screen for the adventurer.
 */
export default function UpgradeScreen({ upgrade }: UpgradeScreenProps) {
  const { gameContract, lordsContract } = useContracts();
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const loading = useLoadingStore((state) => state.loading);
  const txAccepted = useLoadingStore((state) => state.txAccepted);
  const resetNotification = useLoadingStore((state) => state.resetNotification);
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);
  const removeEntrypointFromCalls = useTransactionCartStore(
    (state) => state.removeEntrypointFromCalls
  );
  const hasStatUpgrades = useAdventurerStore(
    (state) => state.computed.hasStatUpgrades
  );
  const [selected, setSelected] = useState("");
  const upgradeScreen = useUIStore((state) => state.upgradeScreen);
  const setUpgradeScreen = useUIStore((state) => state.setUpgradeScreen);
  const potionAmount = useUIStore((state) => state.potionAmount);
  const setPotionAmount = useUIStore((state) => state.setPotionAmount);
  const upgrades = useUIStore((state) => state.upgrades);
  const setUpgrades = useUIStore((state) => state.setUpgrades);
  const purchaseItems = useUIStore((state) => state.purchaseItems);
  const setPurchaseItems = useUIStore((state) => state.setPurchaseItems);
  const setScreen = useUIStore((state) => state.setScreen);
  const pendingMessage = useLoadingStore((state) => state.pendingMessage);
  const [summary, setSummary] = useState<UpgradeSummary>({
    Stats: { ...ZeroUpgrade },
    Items: [],
    Potions: 0,
  });

  const gameData = new GameData();

  // useCustomQuery("latestMarketItemsQuery", getLatestMarketItems, {
  //   adventurerId: adventurer?.id,
  //   limit: 20 * (adventurer?.statUpgrades ?? 0),
  // });

  const checkTransacting =
    typeof pendingMessage === "string" &&
    (pendingMessage as string).startsWith("Upgrading");

  const attributes = [
    {
      name: "Strength",
      icon: <ArrowTargetIcon />,
      description: "Strength increases attack damage by 10%",
      buttonText: "Upgrade Strength",
      abbrev: "STR",
    },
    {
      name: "Dexterity",
      icon: <CatIcon />,
      description: "Dexterity increases chance of fleeing Beasts",
      buttonText: "Upgrade Dexterity",
      abbrev: "DEX",
    },
    {
      name: "Vitality",
      id: 3,
      icon: <HeartVitalityIcon />,
      description: "Vitality increases max health and gives +10hp ",
      buttonText: "Upgrade Vitality",
      abbrev: "VIT",
    },
    {
      name: "Intelligence",
      icon: <LightbulbIcon />,
      description: "Intelligence increases chance of avoiding Obstacles",
      buttonText: "Upgrade Intelligence",
      abbrev: "INT",
    },
    {
      name: "Wisdom",
      icon: <ScrollIcon />,
      description: "Wisdom increases chance of avoiding a Beast ambush",
      buttonText: "Upgrade Wisdom",
      abbrev: "WIS",
    },
    {
      name: "Charisma",
      icon: <CoinCharismaIcon />,
      description: "Charisma provides discounts on the marketplace and potions",
      buttonText: "Upgrade Charisma",
      abbrev: "CHA",
    },
  ];

  function renderContent() {
    const attribute = attributes.find((attr) => attr.name === selected);
    return (
      <div className="order-1 sm:order-2 flex sm:w-2/3 h-24 sm:h-full items-center justify-center p-auto">
        {attribute && (
          <StatAttribute upgradeHandler={handleAddUpgradeTx} {...attribute} />
        )}
      </div>
    );
  }

  function renderVerticalKeyboardControl() {
    const upgradeMenu = [
      {
        id: 1,
        label: `Strength - ${adventurer?.strength}`,
        icon: <ArrowTargetIcon />,
        value: "Strength",
        action: async () => setSelected("Strength"),
        disabled: false,
      },
      {
        id: 2,
        label: `Dexterity - ${adventurer?.dexterity}`,
        icon: <CatIcon />,
        value: "Dexterity",
        action: async () => setSelected("Dexterity"),
        disabled: false,
      },
      {
        id: 3,
        label: `Vitality - ${adventurer?.vitality}`,
        icon: <HeartVitalityIcon />,
        value: "Vitality",
        action: async () => setSelected("Vitality"),
        disabled: false,
      },
      {
        id: 4,
        label: `Intelligence - ${adventurer?.intelligence}`,
        icon: <LightbulbIcon />,
        value: "Intelligence",
        action: async () => setSelected("Intelligence"),
        disabled: false,
      },
      {
        id: 5,
        label: `Wisdom - ${adventurer?.wisdom}`,
        icon: <ScrollIcon />,
        value: "Wisdom",
        action: async () => setSelected("Wisdom"),
        disabled: false,
      },
      {
        id: 6,
        label: `Charisma - ${adventurer?.charisma}`,
        icon: <CoinCharismaIcon />,
        value: "Charisma",
        action: async () => setSelected("Charisma"),
        disabled: false,
      },
    ];
    return (
      <div className="order-2 sm:order-1 sm:w-1/3 sm:border-r sm:border-terminal-green">
        <VerticalKeyboardControl
          buttonsData={upgradeMenu}
          onSelected={setSelected}
          onEnterAction={true}
        />
      </div>
    );
  }

  const selectedCharisma = upgrades["Charisma"] ?? 0;
  const selectedVitality = upgrades["Vitality"] ?? 0;

  const totalVitality = (adventurer?.vitality ?? 0) + selectedVitality;
  const totalCharisma = (adventurer?.charisma ?? 0) + selectedCharisma;

  const purchaseGoldAmount =
    potionAmount * getPotionPrice(adventurer?.level ?? 0, totalCharisma);

  const itemsGoldSum = purchaseItems.reduce((accumulator, current) => {
    const { tier } = getItemData(
      getValueFromKey(gameData.ITEMS, parseInt(current.item)) ?? ""
    );
    const itemPrice = getItemPrice(tier, totalCharisma);
    return accumulator + (isNaN(itemPrice) ? 0 : itemPrice);
  }, 0);

  const upgradeTotalCost = purchaseGoldAmount + itemsGoldSum;

  const handleAddUpgradeTx = (
    currenUpgrades?: UpgradeStats,
    potions?: number,
    items?: any[]
  ) => {

    console.log("currenUpgrades", currenUpgrades);
    console.log("potions", potions);
    console.log("items", items);
    console.log("potionAmount",potionAmount)

    removeEntrypointFromCalls("upgrade_adventurer");
    removeEntrypointFromCalls("buff_adventurer");
    const upgradeTx = {
      contractAddress: gameContract?.address ?? "",
      entrypoint: "upgrade_adventurer",
      calldata: [
        adventurer?.id?.toString() ?? "",
        "0",
        potions ? potions.toString() : potionAmount.toString(),
        currenUpgrades
          ? currenUpgrades["Strength"].toString()
          : upgrades["Strength"].toString(),
        currenUpgrades
          ? currenUpgrades["Dexterity"].toString()
          : upgrades["Dexterity"].toString(),
        currenUpgrades
          ? currenUpgrades["Vitality"].toString()
          : upgrades["Vitality"].toString(),
        currenUpgrades
          ? currenUpgrades["Intelligence"].toString()
          : upgrades["Intelligence"].toString(),
        currenUpgrades
          ? currenUpgrades["Wisdom"].toString()
          : upgrades["Wisdom"].toString(),
        currenUpgrades
          ? currenUpgrades["Charisma"].toString()
          : upgrades["Charisma"].toString(),
        items ? items.length.toString() : purchaseItems.length.toString(),
        ...(items
          ? items.flatMap(Object.values)
          : purchaseItems.flatMap(Object.values)),
      ],
    };
    addToCalls(upgradeTx);
  };

  const handleSubmitUpgradeTx = async () => {
    renderSummary();
    resetNotification();
    await upgrade(upgrades, purchaseItems, potionAmount);
    setPotionAmount(0);
    setPurchaseItems([]);
    setUpgrades({ ...ZeroUpgrade });
  };

  const upgradesTotal = Object.values(upgrades)
    .filter((value) => value !== 0)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const nextDisabled = upgradesTotal !== adventurer?.statUpgrades;

  useEffect(() => {
    if (upgrades.length === 0) {
      setUpgradeScreen(1);
    }
  }, [upgrades]);

  const renderSummary = () => {
    setSummary({
      Stats: upgrades,
      Items: purchaseItems,
      Potions: potionAmount,
    });
  };

  const totalStatUpgrades = (adventurer?.statUpgrades ?? 0) - upgradesTotal;

  const maxHealth = Math.min(100 + totalVitality * 10, 720);

  const healthPlus = Math.min(
    (selectedVitality + potionAmount) * 10,
    maxHealth - (adventurer?.health ?? 0)
  );

  const maxHealthPlus = selectedVitality * 10;

  const totalHealth = Math.min(
    (adventurer?.health ?? 0) + healthPlus,
    maxHealth
  );

  return (
    <>
      {hasStatUpgrades ? (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <div className="w-1/3 hidden sm:block">
            <Info adventurer={adventurer} upgradeCost={upgradeTotalCost} />
          </div>
          {!checkTransacting ? (
            <div className="w-full sm:w-2/3 xl:h-[500px] xl:overflow-y-auto 2xl:h-full">
              <div className="flex flex-col gap-2 xl:gap-0 xl:h-[300px] 2xl:h-full">
                <div className="justify-center text-terminal-green">
                  <div className="text-center text-2xl 2xl:text-4xl xl:text-xl sm:p-2 xl:p-0 animate-pulse uppercase">
                    Level up!
                  </div>
                  <div className="flex flex-row gap-2 xl:gap-0 justify-center text-lg 2xl:text-2xl text-shadow-none">
                    <span>
                      {totalStatUpgrades > 0
                        ? `Stat Upgrades Available ${totalStatUpgrades}`
                        : "All Stats Chosen!"}
                    </span>
                  </div>
                  <UpgradeNav activeSection={upgradeScreen} />
                  <div className="flex flex-col text-sm sm:text-base items-center justify-center">
                    <div className="flex flex-row gap-3">
                      <span className="flex flex-row gap-1 items-center">
                        <p className="uppercase">Cost:</p>
                        <span className="flex flex-row items-center text-xl">
                          <CoinIcon className="self-center w-5 h-5 fill-current text-terminal-yellow" />
                          <p
                            className={
                              upgradeTotalCost > (adventurer?.gold ?? 0)
                                ? "text-red-600"
                                : "text-terminal-yellow"
                            }
                          >
                            {upgradeTotalCost}
                          </p>
                        </span>
                      </span>
                      <span className="flex flex-row gap-1 items-center">
                        <p className="uppercase">Potions:</p>
                        <span className="flex text-xl text-terminal-yellow">
                          {potionAmount?.toString() ?? 0}
                        </span>
                      </span>
                      <span className="flex flex-row gap-1 items-center">
                        <p className="uppercase text-lg">Items:</p>
                        <span className="flex text-xl text-terminal-yellow">
                          {purchaseItems?.length}
                        </span>
                      </span>
                    </div>
                    <div className="sm:hidden flex flex-row gap-3 items-center text-lg">
                      <span className="flex flex-row">
                        Gold:{" "}
                        <span className="flex flex-row text-terminal-yellow">
                          <CoinIcon className="self-center mt-1 w-5 h-5 fill-current" />{" "}
                          {(adventurer?.gold ?? 0) - upgradeTotalCost}
                        </span>
                      </span>
                      <span className="relative flex flex-row items-center">
                        Health:{" "}
                        <span className="flex items-center ">
                          <HeartIcon className="self-center mt-1 w-5 h-5 fill-current" />{" "}
                          <HealthCountDown health={totalHealth || 0} />
                          {`/${maxHealth}`}
                        </span>
                        {(potionAmount > 0 || selectedVitality > 0) && (
                          <p className="absolute top-[-5px] sm:top-[-10px] right-[30px] sm:right-[40px] text-xs sm:text-sm">
                            +{healthPlus}
                          </p>
                        )}
                        {selectedVitality > 0 && (
                          <p className="absolute top-[-5px] sm:top-[-10px] right-0 text-xs sm:text-sm">
                            +{maxHealthPlus}
                          </p>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {upgradeScreen === 1 && (
                    <div className="flex flex-col sm:gap-2 items-center w-full">
                      <div className="flex flex-col gap-0 sm:flex-row w-full border-terminal-green border sm:items-center">
                        {renderContent()}
                        {renderVerticalKeyboardControl()}
                      </div>
                    </div>
                  )}

                  {upgradeScreen === 2 && (
                    <div
                      className="flex flex-col gap-5 sm:gap-2
                     sm:flex-row items-center justify-center flex-wrap"
                    >
                      <p className="text-sm 2xl:text-2xl">Potions</p>
                      <PurchaseHealth
                        upgradeTotalCost={upgradeTotalCost}
                        potionAmount={potionAmount}
                        setPotionAmount={setPotionAmount}
                        totalCharisma={totalCharisma}
                        upgradeHandler={handleAddUpgradeTx}
                        totalVitality={totalVitality}
                      />
                    </div>
                  )}

                  {upgradeScreen === 2 && (
                    <div className="hidden sm:flex flex-col items-center sm:gap-2 w-full">
                      <p className="text-xl text-center lg:text-2xl sm:hidden">
                        Loot Fountain
                      </p>
                      <MarketplaceScreen
                        upgradeTotalCost={upgradeTotalCost}
                        purchaseItems={purchaseItems}
                        setPurchaseItems={setPurchaseItems}
                        upgradeHandler={handleAddUpgradeTx}
                        totalCharisma={totalCharisma}
                      />
                    </div>
                  )}
                  {upgradeScreen === 3 && (
                    <div className="sm:hidden flex-col items-center sm:gap-2 w-full">
                      {/* <p className="text-xl text-center lg:text-2xl sm:hidden">
                        Loot Fountain
                      </p> */}
                      <MarketplaceScreen
                        upgradeTotalCost={upgradeTotalCost}
                        purchaseItems={purchaseItems}
                        setPurchaseItems={setPurchaseItems}
                        upgradeHandler={handleAddUpgradeTx}
                        totalCharisma={totalCharisma}
                      />
                    </div>
                  )}
                  <div className="w-1/2 flex flex-row gap-2 mx-auto">
                    <Button
                      className="w-1/2"
                      variant={"outline"}
                      onClick={() => setUpgradeScreen(upgradeScreen - 1)}
                      disabled={upgradeScreen == 1}
                    >
                      Back
                    </Button>
                    <Button
                      className={` ${
                        upgradeScreen == 2
                          ? "hidden sm:block"
                          : upgradeScreen == 3
                          ? "sm:hidden"
                          : "hidden"
                      } w-1/2`}
                      onClick={() => {
                        handleSubmitUpgradeTx();
                        setUpgradeScreen(1);
                      }}
                      disabled={nextDisabled || loading}
                    >
                      {loading ? (
                        <span>Upgrading...</span>
                      ) : (
                        <span>Upgrade</span>
                      )}
                    </Button>
                    <Button
                      className={` ${
                        upgradeScreen == 2
                          ? "sm:hidden"
                          : upgradeScreen == 3
                          ? "hidden"
                          : ""
                      } w-1/2`}
                      onClick={() => {
                        setUpgradeScreen(upgradeScreen + 1);
                      }}
                      disabled={nextDisabled || loading}
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Summary summary={summary} attributes={attributes} />
          )}
        </div>
      ) : (
        <h1 className="mx-auto">No upgrades available!</h1>
      )}
    </>
  );
}
