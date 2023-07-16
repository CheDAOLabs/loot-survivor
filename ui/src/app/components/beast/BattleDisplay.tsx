import TwitterShareButton from "../buttons/TwitterShareButtons";
import useAdventurerStore from "../../hooks/useAdventurerStore";
import { useQueriesStore } from "../../hooks/useQueryStore";
import { getRankFromList, getOrdinalSuffix } from "../../lib/utils";
import { processBeastName, getBeastData } from "../../lib/utils";
import { Adventurer, Battle } from "@/app/types";
import Head from "../../../../public/icons/loot/head.svg";
import Hand from "../../../../public/icons/loot/hand.svg";
import Chest from "../../../../public/icons/loot/chest.svg";
import Waist from "../../../../public/icons/loot/waist.svg";
import Foot from "../../../../public/icons/loot/foot.svg";
import { appUrl } from "@/app/lib/constants";

interface BattleDisplayProps {
  adventurer: Adventurer;
  battleData: Battle;
  beastName: string;
}

const getAttackLocationIcon = (attackLocation: string) => {
  if (!attackLocation) return null;

  if (attackLocation == "Hand")
    return <Hand className="self-center w-6 h-6 fill-current" />;
  if (attackLocation == "Chest")
    return <Chest className="self-center w-6 h-6 fill-current" />;
  if (attackLocation == "Waist")
    return <Waist className="self-center w-6 h-6 fill-current" />;
  if (attackLocation == "Foot")
    return <Foot className="self-center w-6 h-6 fill-current" />;
  if (attackLocation == "Head")
    return <Head className="self-center w-6 h-6 fill-current" />;
};

/**
 * @component
 * @description Displays the battle results.
 */
export const BattleDisplay = ({
  adventurer,
  battleData,
  beastName,
}: BattleDisplayProps) => {
  const damageLocation = battleData?.damageLocation ?? "";
  const damageIcon = getAttackLocationIcon(damageLocation);
  const BeastFled = battleData.fled;
  const AdventurerAttack = battleData.attacker === "Adventurer";
  const BeastAttack = battleData.attacker === "Beast";
  const BeastHealthExists = (battleData.beastHealth ?? 0) > 0;
  const AdventurerHealthExists = (adventurer.health ?? 0) > 0;
  const NoDamageDealt = battleData.damageDealt === 0;
  const NoDamageTaken = battleData.damageTaken === 0;
  const IdleDamagePenalty = !battleData.beast;

  return (
    <div className="w-full text-xl">
      {BeastFled && <p>PHEW! You fled the {beastName}!</p>}
      {AdventurerAttack && NoDamageDealt && NoDamageTaken && !BeastFled && (
        <p className="w-full justify-between">
          OH NO! You could not flee the {beastName}!
        </p>
      )}
      {AdventurerAttack && BeastHealthExists && !NoDamageDealt && (
        <p className="w-full justify-between">
          NICE! You attacked the {beastName} for {battleData?.damageDealt}{" "}
          damage!
        </p>
      )}
      {AdventurerAttack && !BeastHealthExists && !BeastFled && (
        <p className="w-full justify-between">
          GREAT! You defeated the {beastName} with a final blow of{" "}
          {battleData?.damageDealt} damage!
        </p>
      )}
      {BeastAttack && AdventurerHealthExists && (
        <p>
          OUCH! The {beastName} struck you down with a mighty strike dealing{" "}
          {battleData?.damageTaken} damage to your {damageLocation}!
        </p>
      )}
      {BeastAttack && !AdventurerHealthExists && (
        <p>
          YIKES! You were killed by the {beastName} as it dealt{" "}
          {battleData?.damageTaken} damage to your {damageLocation}!
        </p>
      )}
      {BeastAttack && AdventurerHealthExists && NoDamageTaken && (
        <p>PHEW! The {beastName} attacked but you defended it well!</p>
      )}
      {IdleDamagePenalty && (
        <p>OOPS! You were hit for 80 damage from idle penalty!</p>
      )}
    </div>
  );
};

interface NotificationBattleDisplayProps {
  battleData: Battle[] | Battle;
  type: string;
}

export const NotificationBattleDisplay = ({
  battleData,
  type,
}: NotificationBattleDisplayProps) => {
  const adventurer = useAdventurerStore((state) => state.adventurer);

  const isArray = Array.isArray(battleData);
  const handleBeastInfo = () => {
    if (isArray) {
      const beastName = processBeastName(
        battleData[0]?.beast ?? "",
        battleData[0]?.special2 ?? "",
        battleData[0]?.special3 ?? ""
      );
      const beastLevel = battleData[0]?.beastLevel;
      const { tier, attack, armor, image } = getBeastData(
        battleData[0]?.beast ?? ""
      );
      return { beastName, beastLevel, tier, attack, armor, image };
    } else {
      const beastName = processBeastName(
        battleData?.beast ?? "",
        battleData?.special2 ?? "",
        battleData?.special3 ?? ""
      );
      const beastLevel = battleData?.beastLevel;
      const { tier, attack, armor, image } = getBeastData(
        battleData?.beast ?? ""
      );
      return { beastName, beastLevel, tier, attack, armor, image };
    }
  };

  const { beastName, beastLevel, tier } = handleBeastInfo();
  const { data } = useQueriesStore();
  const rank = getRankFromList(
    adventurer?.id ?? 0,
    data.adventurersByXPQuery?.adventurers ?? []
  );
  const ordinalRank = getOrdinalSuffix(rank + 1 ?? 0);
  const BeastFled = isArray && battleData.some((data) => data.fled);
  const FailedToFlee =
    isArray &&
    battleData.length == 1 &&
    battleData[0]?.attacker === "Beast" &&
    (adventurer?.health ?? 0) > 0;
  const KilledTryingToFlee =
    isArray &&
    battleData.length == 1 &&
    battleData[0]?.attacker === "Beast" &&
    adventurer?.health === 0;
  const Attacked =
    isArray &&
    battleData.some(
      (data) => data.attacker === "Adventurer" && (data.beastHealth ?? 0) > 0
    );
  const Slayed =
    isArray &&
    battleData.some(
      (data) => data.attacker === "Adventurer" && (data.beastHealth ?? 0) === 0
    );
  const Killed =
    isArray &&
    battleData.some((data) => data.attacker === "Beast") &&
    adventurer?.health === 0;

  return (
    <div>
      {BeastFled && <p>You fled the {beastName || ""}!</p>}
      {FailedToFlee && (
        <p>
          You failed to flee the {beastName || ""} and were attacked taking{" "}
          {battleData[1]?.damageTaken} damage!{" "}
        </p>
      )}
      {KilledTryingToFlee && (
        <p>
          You were killed trying to flee the {beastName || ""} taking{" "}
          {battleData[0]?.damageTaken} damage!{" "}
        </p>
      )}
      {Attacked && (
        <p>
          You attacked the {beastName || ""} with a mighty strike and dealt{" "}
          {battleData[1]?.damageDealt} damage! They counterattacked for{" "}
          {battleData[0]?.damageTaken} damage!
        </p>
      )}
      {Slayed && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <p>
            You slayed the {beastName || ""} after inflicting{" "}
            {battleData[0]?.damageDealt} damage!
          </p>
          <TwitterShareButton
            text={`My adventurer just slew a level ${beastLevel} ${beastName} (Tier ${tier}) on #LootSurvivor.\n\n${adventurer?.name} is currently ${ordinalRank} place on the leaderboard.\n\nThink you can out-survive me?\n\nEnter here and try to survive: ${appUrl}\n\n@lootrealms #Starknet #Play2Die #LootSurvivor`}
          />
        </div>
      )}
      {Killed && (
        <p>
          You were killed by the {beastName || ""} taking{" "}
          {battleData[1]?.damageTaken} damage!
        </p>
      )}
    </div>
  );
};
