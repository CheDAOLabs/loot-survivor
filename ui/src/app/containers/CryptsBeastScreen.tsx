import KeyboardControl, {ButtonData} from "../components/KeyboardControls";
import {BattleDisplay} from "../components/beast/BattleDisplay";
import {BeastDisplay} from "../components/beast/BeastDisplay";
import useLoadingStore from "../hooks/useLoadingStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import {useQueriesStore} from "../hooks/useQueryStore";
import React, {useEffect, useState} from "react";
import {processBeastName} from "../lib/utils";
import {Battle, NullDiscovery, NullBeast, UpgradeStats, ZeroUpgrade, NullCave, CcCave, Monster} from "../types";
import {Button} from "../components/buttons/Button";
import {type} from "os";

const buffs =
    [
        {
            id: 1,
            strength: 1,
            dexterity: 1,
            vitality: 1,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
        },
        {
            id: 2,
            strength: 0,
            dexterity: 1,
            vitality: 1,
            intelligence: 1,
            wisdom: 0,
            charisma: 0,
        },
        {
            id: 3,
            strength: 0,
            dexterity: 0,
            vitality: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 0,
        },
        {
            id: 4,
            strength: 0,
            dexterity: 0,
            vitality: 0,
            intelligence: 1,
            wisdom: 1,
            charisma: 1,
        },
        {
            id: 5,
            strength: 1,
            dexterity: 0,
            vitality: 1,
            intelligence: 0,
            wisdom: 1,
            charisma: 0,
        },
        {
            id: 5,
            strength: 0,
            dexterity: 1,
            vitality: 0,
            intelligence: 1,
            wisdom: 0,
            charisma: 1,
        },
        {
            id: 6,
            strength: 1,
            dexterity: 0,
            vitality: 1,
            intelligence: 0,
            wisdom: 0,
            charisma: 1,
        }];

function getRandomBuff() {
    const randomIndex = Math.floor(Math.random() * buffs.length);
    return buffs[randomIndex];
}

interface BeastScreenProps {
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
    exit: (...args: any[]) => any;
    buffAdventurer: (...args: any[]) => any;
}

/**
 * @container
 * @description Provides the beast screen for adventurer battles.
 */
export default function BeastScreen({attack, flee, exit, buffAdventurer}: BeastScreenProps) {
    /* eslint-disable */

    const adventurer = useAdventurerStore((state) => state.adventurer);
    const loading = useLoadingStore((state) => state.loading);
    const resetNotification = useLoadingStore((state) => state.resetNotification);
    const [showBattleLog, setShowBattleLog] = useState(false);

    const [hasBeast, setHasBeast] = useState(true);//useAdventurerStore((state) => state.computed.hasBeast);
    const isAlive = useAdventurerStore((state) => state.computed.isAlive);
    const lastBeast = useQueriesStore(
        (state) => state.data.lastBeastQuery?.discoveries[0] || NullDiscovery
    );
    const beastData = useQueriesStore(
        (state) => state.data.beastQueryCC?.beasts[0] || NullBeast
    );

    const ccCaveData = useQueriesStore(
        (state) => state.data.enterCC?.cc_cave[0] as CcCave || NullCave
    );

    const formatBattles = useQueriesStore(
        (state) => state.data.battlesByBeastQuery?.battles || []
    );

    interface cb {
        key: string,
        value: number
    }

    const [rewardItems, setRewardItems] = useState([] as string[])
    const [hasRewardBuff, setHasRewardBuff] = useState(false);
    const [selectedKey, setSelectedKey] = useState("");
    const [isClearance, setIsClearance] = useState(false);
    const [monsters, setMonsters] = useState([] as Monster[])
    const [currBuff, setCurrBuff] = useState([] as cb[]);

    const beastName = processBeastName(
        beastData?.beast ?? "",
        beastData?.special2 ?? "",
        beastData?.special3 ?? ""
    );

    const handleOptionChange = (key: string) => {
        setSelectedKey(key);
    };

    const BattleLog: React.FC = () => (
        <div className="flex flex-col p-2 items-center">
            <div>
            </div>
            <Button
                className="w-1/2 sm:hidden"
                onClick={() => setShowBattleLog(false)}
            >
                Back
            </Button>
            <div className="flex flex-col items-center gap-5 p-2">
                <div className="text-xl uppercase">
                    Battle log with {beastData?.beast}
                </div>
                <div className="flex flex-col gap-2 ext-sm overflow-y-auto h-96 text-center">
                    {formatBattles.map((battle: Battle, index: number) => (
                        <div className="border p-2 border-terminal-green" key={index}>
                            <BattleDisplay battleData={battle} beastName={beastName}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (showBattleLog) {
        return <BattleLog/>;
    }

    const onAttack = async (index: any) => {
        console.log("onAttack", beastData)
        try {
            let reward_items = await attack(false, beastData);
            if (reward_items.length > 0) {
                console.log("setRewardItems", reward_items);
                setRewardItems(reward_items);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onConfirm = async () => {
        let selectedIndex = 0;
        if(selectedKey === "strength"){
            selectedIndex = 1;
        }
        if(selectedKey === "dexterity"){
            selectedIndex = 2;
        }
        if(selectedKey === "vitality"){
            selectedIndex = 3;
        }
        if(selectedKey === "intelligence"){
            selectedIndex = 4;
        }
        if(selectedKey === "wisdom"){
            selectedIndex = 5;
        }
        if(selectedKey === "charisma"){
            selectedIndex = 6;
        }
        if(selectedIndex >0) {
            await buffAdventurer(selectedIndex);
        }
    }

    const onExit = async () => {
        exit();
    }


    const id2cbs = (id: number) => {
        let cbs = []
        let buff: { [key: string]: number } | undefined = buffs.find(b => b.id === id);
        console.log("find Buff" , id,buff)
        if (!buff) {
            return [];
        }
        let keys = Object.keys(buff);
        for (let key of keys) {
            if (key === 'id') continue;
            let value = buff[key];
            if (value > 0) {
                cbs.push({
                    key: key,
                    value: value
                });
            }
        }
        return cbs;
    }

    useEffect(() => {
        setHasBeast(ccCaveData.curr_beast < ccCaveData.beast_amount);
        setIsClearance(ccCaveData.curr_beast == ccCaveData.beast_amount);
        // setIsClearance(true);
        let monsters: Monster[] = [];

        let cbs: cb[] = id2cbs(ccCaveData.has_reward)
        setCurrBuff(cbs);

        for (let i = 0; i < ccCaveData.beast_amount; i++) {
            monsters.push({
                name: "MONSTER " + (i + 1),
                status: "alive"
            })
        }

        const monsterIndex = ccCaveData.curr_beast;


        for (let i = 0; i <= monsterIndex; i++) {
            if (monsters[i]) {
                monsters[i].status = "dead";
            }
        }
        if (monsters[monsterIndex]) {
            monsters[monsterIndex].status = "attack"
        }


        for (let i = monsterIndex + 1; i <= monsters.length; i++) {
            if (monsters[i]) {
                monsters[i].status = "alive";
            }
        }


        setMonsters(monsters);
        setHasRewardBuff(ccCaveData.has_reward > 0)

    }, [ccCaveData]);


    return (
        <div className="sm:w-2/3 sm:h-2/3 flex flex-col sm:flex-row" style={{height: "600px"}}>
            <div className="sm:w-1/2 order-1 sm:order-2">
                {hasBeast ? (
                    <>
                        <BeastDisplay beastData={beastData}/>
                    </>
                ) : (
                    <div className="flex flex-col items-center border-2 border-terminal-green">
                        <p className="m-auto text-lg uppercase text-terminal-green">
                            Beast not yet discovered.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 items-center sm:w-1/2 sm:p-4 order-1 text-lg">
                {isAlive && !hasRewardBuff && !isClearance && (
                    <>
                        <div className="flex flex-row gap-2 sm:flex-col items-center justify-center">
                            <h3>BUFF</h3>
                            <div className="flex gap-2 ">
                                <p>STRENGTH:{ccCaveData.strength_increase}</p>
                                <p>DEXTERITY:{ccCaveData.dexterity_increase}</p>
                                <p>VITALITY:{ccCaveData.vitality_increase}</p>
                            </div>
                            <div className="flex  gap-2 border-b border-terminal-green">
                                <p>INTELLIGENCE:{ccCaveData.intelligence_increase}</p>
                                <p>WISDOM:{ccCaveData.wisdom_increase}</p>
                                <p>CHARISMA:{ccCaveData.charisma_increase}</p>
                            </div>
                            {/*<div className="flex  gap-2 border-b border-terminal-green">*/}
                            {/*    <p>LUCK:0</p>*/}
                            {/*    <p>HP:0</p>*/}
                            {/*</div>*/}

                        </div>
                        <div className="flex flex-col mt-3">
                            {monsters.map((monster: Monster, index) => (
                                <Button
                                    size={"lg"}
                                    disabled={monster.status == 'dead' || loading}
                                    key={index}
                                    onClick={() => {
                                        if (monster.status === 'attack') {
                                            onAttack(index);
                                        }
                                    }}
                                    className={`${monster.status === 'alive' ? 'bg-black-800 text-green' : ''
                                    } p-1 `}
                                >
                                    {monster.status === 'attack' ? "ATTACK" : monster.name}

                                </Button>
                            ))}

                        </div>
                    </>
                )}

                {isAlive && hasRewardBuff && !isClearance && (
                    <>
                        <h3>VICTORY</h3>
                        <h4>CHOOSE A BUFF EFFECT</h4>

                        <div className="flex flex-col m-3">

                            {currBuff.map((cb, index) => (
                                <Button
                                    disabled={loading}
                                    key={index}
                                    size={"lg"}
                                    className={`${selectedKey === cb.key ? 'animate-pulse' : ''
                                    } m-1 `}
                                    onClick={() =>
                                        handleOptionChange(
                                            cb.key)
                                    }
                                >
                                    {cb.key}: +{cb.value}
                                </Button>
                            ))}


                        </div>

                        <Button disabled={loading} size={"lg"} className="" onClick={onConfirm}>CONFIRM</Button>

                    </>
                )}

                {isAlive && isClearance && (
                    <>
                        <h3>FULL CLEARANCE</h3>
                        <h4>YOU WON ALL THE BATTLES</h4>
                        <div className="flex flex-col ">
                            {rewardItems.map((item_name, index) => (
                                <div key={index}
                                     className="flex flex-row bg-terminal-green text-black mb-1 px-9">{item_name}</div>
                            ))}
                        </div>
                        <Button size={"lg"} onClick={exit}>EXIT</Button>
                    </>
                )}

                {/*{!isAlive && (*/}
                {/*    <>*/}
                {/*        <h3>DEFEAT</h3>*/}
                {/*        <h4>UNFORTUNATELY,<br/>YOU WERE DEFEATED BY MONSTER 1 </h4>*/}

                {/*        <h3>REWARDS</h3>*/}
                {/*        <div className="flex flex-row">*/}
                {/*            <div className="flex flex-row bg-terminal-green text-black mb-1 px-9">XP:55</div>*/}
                {/*            <div className="flex flex-row bg-terminal-green text-black mb-1 px-9">*/}
                {/*                <HeartVitalityIcon className=""/>:+55*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <Button size={"lg"} onClick={exit}>EXIT</Button>*/}
                {/*    </>*/}
                {/*)}*/}


                {/*<div className="hidden sm:block xl:h-[500px] 2xl:h-full">*/}
                {/*    {(hasBeast || formatBattles.length > 0) && <BattleLog/>}*/}
                {/*</div>*/}

                {/*<Button*/}
                {/*    className="sm:hidden uppercase"*/}
                {/*    onClick={() => setShowBattleLog(true)}*/}
                {/*>*/}
                {/*    Battle log with {beastData?.beast}*/}
                {/*</Button>*/}
            </div>
        </div>
    );
    /* eslint-enable */

}
