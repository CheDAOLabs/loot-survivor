import KeyboardControl, {ButtonData} from "../components/KeyboardControls";
import {BattleDisplay} from "../components/beast/BattleDisplay";
import {BeastDisplay} from "../components/beast/BeastDisplay";
import useLoadingStore from "../hooks/useLoadingStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import {useQueriesStore} from "../hooks/useQueryStore";
import React, {useEffect, useState} from "react";
import {processBeastName} from "../lib/utils";
import {Battle, NullDiscovery, NullBeast, UpgradeStats, ZeroUpgrade, NullCave, CcCave,Monster} from "../types";
import {Button} from "../components/buttons/Button";
// import Neck from "../../../public/icons/loot/neck.svg";
// import Heart from "../../../public/icons/heart.svg";
import {HeartVitalityIcon} from "../components/icons/Icons";
// import Storage from "../lib/storage";
import useTransactionCartStore from "../hooks/useTransactionCartStore"
import {useContracts} from "@/app/hooks/useContracts";
import useUIStore from "@/app/hooks/useUIStore";
import {syscalls} from "../lib/utils/syscalls"

const buffs = [
    {
        "id": 0,
        "strength": 1,
        "dexterity": 1,
        "vitality": 1,
        "intelligence": 0,
        "wisdom": 0,
        "charisma": 0,
    },
    {
        "id": 1,
        "strength": 0,
        "dexterity": 1,
        "vitality": 1,
        "intelligence": 1,
        "wisdom": 0,
        "charisma": 0,
    },
    {
        "id": 2,
        "strength": 0,
        "dexterity": 0,
        "vitality": 1,
        "intelligence": 1,
        "wisdom": 1,
        "charisma": 0,
    },
    {
        "id": 3,
        "strength": 0,
        "dexterity": 0,
        "vitality": 0,
        "intelligence": 1,
        "wisdom": 1,
        "charisma": 1,
    },
    {
        "id": 4,
        "strength": 1,
        "dexterity": 0,
        "vitality": 1,
        "intelligence": 0,
        "wisdom": 1,
        "charisma": 0,
    },
    {
        "id": 5,
        "strength": 0,
        "dexterity": 1,
        "vitality": 0,
        "intelligence": 1,
        "wisdom": 0,
        "charisma": 1,
    },
    {
        "id": 6,
        "strength": 1,
        "dexterity": 0,
        "vitality": 1,
        "intelligence": 0,
        "wisdom": 0,
        "charisma": 1,
    },
];

function getRandomBuff() {
    const randomIndex = Math.floor(Math.random() * buffs.length);
    return buffs[randomIndex];
}

interface BeastScreenProps {
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
    exit: (...args: any[]) => any;
    explore: (...args: any[]) => any;
    upgrade: (...args: any[]) => any;
}

/**
 * @container
 * @description Provides the beast screen for adventurer battles.
 */
export default function BeastScreen({attack, flee, exit, explore, upgrade}: BeastScreenProps) {
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

    const addToCalls = useTransactionCartStore((state) => state.addToCalls);
    const removeEntrypointFromCalls = useTransactionCartStore(
        (state) => state.removeEntrypointFromCalls
    );
    const {gameContract, lordsContract} = useContracts();
    const upgrades = useUIStore((state) => state.upgrades);
    const setUpgrades = useUIStore((state) => state.setUpgrades);
    const potionAmount = useUIStore((state) => state.potionAmount);
    const setPotionAmount = useUIStore((state) => state.setPotionAmount);


    // const [buttonText, setButtonText] = useState("Flee!");
    // const [selected, setSelected] = useState("");


    const beastName = processBeastName(
        beastData?.beast ?? "",
        beastData?.special2 ?? "",
        beastData?.special3 ?? ""
    );

    const [victory, setVictory] = useState(false);

    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedValue, setSelectedValue] = useState(0);

    const handleOptionChange = (option: any, value: any) => {
        console.log("handleOptionChange", option, value);
        // removeEntrypointFromCalls("upgrade_adventurer");
        // alert("handleOptionChange: " + option);
        if (selectedOption != option) {
            setSelectedOption(option);
            setSelectedValue(value);

            handleAddUpgradeTx(option, value);
        }
    };

    const handleAddUpgradeTx = (
        option: string,
        value: number
    ) => {

        option = option.toLowerCase();
        console.log("option", option);
        console.log("value", value);

        removeEntrypointFromCalls("buff_adventurer");
        const upgradeTx = {
            contractAddress: gameContract?.address ?? "",
            entrypoint: "buff_adventurer",
            calldata: [
                // adventurerId
                adventurer?.id?.toString() ?? "",
                "0",
                // potion
                option === "hp" ? value.toString() : potionAmount.toString(),
                // statUpgrades
                option === "strength"
                    ? value.toString()
                    : "0",
                option === "dexterity"
                    ? value.toString()
                    : "0",
                option === "vitality"
                    ? value.toString()
                    : "0",
                option === "intelligence"
                    ? value.toString()
                    : "0",
                option === "wisdom"
                    ? value.toString()
                    : "0",
                option === "charisma"
                    ? value.toString()
                    : "0",
            ],
        };
        addToCalls(upgradeTx);
    };

    const handleSubmitUpgradeTx = async () => {
        resetNotification();
        await upgrade(upgrades, [], 0);
        setPotionAmount(0);
        setUpgrades({...ZeroUpgrade});
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

    // const monsters = () => {
    //     let monsters = [
    //         {
    //             name: "MONSTER 1",
    //             status: "attack",
    //         }
    //     ]
    //
    //     console.log("asdasdasdasdadasd")
    //
    //     // for(let i = 0; i < ccCaveData.beast_amount; i++) {
    //     //     monsters.push({
    //     //         name: "MONSTER " + (i + 1),
    //     //         status: "alive"
    //     //     })
    //     // }
    //
    //     const monsterIndex=  0;//ccCaveData.curr_beast;
    //     // const monsterIndex = (Number)(Storage.get('monsterIndex' + adventurer?.id)) || 0;
    //
    //     if (monsterIndex) {
    //         for (let i = 0; i <= monsterIndex; i++) {
    //             if (monsters[i - 1]) {
    //                 monsters[i - 1].status = "dead";
    //             }
    //         }
    //         monsters[monsterIndex - 1].status = "attack"
    //
    //         for (let i = monsterIndex; i <= monsters.length; i++) {
    //             if (monsters[i]) {
    //                 monsters[i].status = "alive";
    //             }
    //         }
    //     }
    //
    //     console.log("monsters", monsters);
    //     return monsters;
    // };

    const [MyBuff, setMyBuff] = useState({
        strength: 0,
        dexterity: 0,
        vitality: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        luck: 0,
        hp: 0
    });


    // const [monsterIndex, setMonsterIndex] = useState(4)


    const onAttack = async (index: any) => {


        console.log("onAttack", beastData)

        // if (!hasBeast || beastData.health == 0) {
        //     await explore(true);
        //     return;
        // }

        try {
            let beastDead = await attack(false, beastData);
            console.log("attack succ", beastDead);

            if (beastDead) {
                setVictory(true);
            }

            // Storage.set('victory' + adventurer?.id, JSON.stringify(true));
            // (window as any).monsterIndex += 1;

        } catch (e) {
            console.error(e);
        }


        // setMonsterIndex(index)
        // (window as any).monsterIndex = index
        // setIsVictory(true)
        // (window as any).isVictory = true;
    }

    const [isClearance, setIsClearance] = useState(false);


    const onConfirm = async () => {

        let myBuff = JSON.parse(JSON.stringify(MyBuff));
        switch (selectedOption.toLowerCase()) {
            case 'strength':
                myBuff.strength += selectedValue;
                break
            case 'dexterity':
                myBuff.dexterity += selectedValue;
                break
            case 'vitality':
                myBuff.vitality += selectedValue;
                break
            case 'intelligence':
                myBuff.intelligence += selectedValue;
                break
            case 'wisdom':
                myBuff.wisdom += selectedValue;
                break
            case 'charisma':
                myBuff.charisma += selectedValue;
                break
            case 'hp':
                myBuff.hp += selectedValue;
                break
        }

        setMyBuff(myBuff);
        // Storage.set('buff_' + adventurer?.id, JSON.stringify(myBuff));
        // Storage.set('victory' + adventurer?.id, JSON.stringify(false));
        // (window as any).isVictory = false;

        await handleSubmitUpgradeTx();

        setVictory(false)
    }


    const onExit = async () => {
        exit();
    }


    const randBuff = () => {

        let result = [];
        const buff1 = getRandomBuff();
        for (const [key, value] of Object.entries(buff1)) {
            if (key != "id" && value > 0) {
                result.push({
                    key: key.toUpperCase(),
                    value: value
                });
            }
        }

        return result;
    };
    const [currBuff, setCurrBuff] = useState(randBuff());

    useEffect(() => {

        // const bf = Storage.get('buff_' + adventurer?.id);
        // if (bf) {
        //     const buff = JSON.parse(bf);
        //     setMyBuff(buff);
        // }

    }, [(window) as any]);

    const [monsters, setMonsters] = useState([] as Monster[])

    useEffect(() => {

        // const bf = Storage.get('buff_' + adventurer?.id);
        // if (bf) {
        //     const buff = JSON.parse(bf);
        //     setMyBuff(buff);
        // }
        console.log("asdasda", ccCaveData)


        setHasBeast(ccCaveData.curr_beast < ccCaveData.beast_amount);
        setIsClearance(ccCaveData.curr_beast == ccCaveData.beast_amount);

        let monsters: Monster[] = [];

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

    }, [ccCaveData]);

    // const isVictory = () => {
    //     // let res = Storage.get('victory' + adventurer?.id);
    //     // if (res) {
    //     //     console.log("isVictory", JSON.parse(res));
    //     //     return JSON.parse(res);
    //     // }
    //     console.log("isVictory", false);
    //     return false;
    // }

    return (
        <div className="sm:w-2/3 sm:h-2/3 flex flex-col sm:flex-row">

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
                {isAlive && !victory && !isClearance && (
                    <>
                        <div className="flex flex-row gap-2 sm:flex-col items-center justify-center">
                            <h3>BUFF</h3>
                            <div className="flex gap-2 ">
                                <p>STRENGTH:{MyBuff.strength}</p>
                                <p>DEXTERITY:{MyBuff.dexterity}</p>
                                <p>VITALITY:{MyBuff.vitality}</p>
                            </div>
                            <div className="flex  gap-2 border-b border-terminal-green">
                                <p>INTELLIGENCE:{MyBuff.intelligence}</p>
                                <p>WISDOM:{MyBuff.wisdom}</p>
                                <p>CHARISMA:{MyBuff.charisma}</p>
                            </div>
                            <div className="flex  gap-2 border-b border-terminal-green">
                                <p>LUCK:{MyBuff.luck}</p>
                                <p>HP:{MyBuff.hp}</p>
                            </div>

                        </div>
                        <div className="flex flex-col mt-3">
                            {monsters.map((monster:Monster, index) => (
                                <Button
                                    size={"lg"}
                                    disabled={monster.status == 'dead'}
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

                {isAlive && victory && !isClearance && (
                    <>
                        <h3>VICTORY</h3>
                        <h4>CHOOSE A BUFF EFFECT</h4>

                        <div className="flex flex-col m-3">

                            {currBuff.map((cb, index) => (
                                <Button
                                    size={"lg"}
                                    className={`${selectedOption === cb.key ? 'animate-pulse' : ''
                                    } m-1 `}
                                    onClick={() =>
                                        handleOptionChange(cb.key, cb.value)
                                    }
                                >
                                    {cb.key}: +{cb.value}
                                </Button>
                            ))}


                        </div>

                        <Button size={"lg"} className="" onClick={onConfirm}>CONFIRM</Button>

                    </>
                )}

                {isAlive && isClearance && (
                    <>
                        <h3>FULL CLEARANCE</h3>
                        <h4>YOU WON ALL THE BATTLES</h4>
                        <div className="flex flex-col ">
                            <div className="flex flex-row bg-terminal-green text-black mb-1 px-9">XP:55</div>
                            <div className="flex flex-row bg-terminal-green text-black mb-1 px-9">
                                <HeartVitalityIcon className=""/>:+55
                            </div>
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
