import React, {ChangeEvent, useState} from "react";
import {Button} from "../components/buttons/Button";


import {EnterCode} from "../components/crypts/EnterCode";
import {MapInfo} from "../components/crypts/MapInfo";
import {MapAction} from "../components/crypts/MapAction";

import Info from "../components/adventurer/Info";
import {NullAdventurer} from "../types";
import {useQueriesStore} from "../hooks/useQueryStore";
import useAdventurerStore from "../hooks/useAdventurerStore";


interface CryptsScreenProps {
    explore: (...args: any[]) => any;
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
}

/**
 * @container
 * @description
 */

export default function CryptsScreen({
                                         explore,
                                         attack,
                                         flee,
                                     }: CryptsScreenProps) {


    const adventurer = useAdventurerStore((state) => state.adventurer);

    const [formData, setFormData] = useState<FormData>({
        name: "",
    });

    const [step, setStep] = useState(1);


    const onEnterCode = () => {
        // alert("entercode");
        console.log(formData);
        setStep(2);
    }

    const onEnter = () => {
        setStep(3);
    }

    const onBack = () => {
        setStep(1);
    }


    const onExit = () => {
        // alert("exit");
        setStep(1);
    }

    if (step === 1) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer}/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <EnterCode handleBack={onEnterCode} setFormData={setFormData} formData={formData}></EnterCode>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer}/>
                </div>
                <div className="hidden sm:block sm:w-1/2 lg:w-2/3">
                    <MapInfo handleBack={onBack} handleEnter={onEnter}></MapInfo>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col sm:flex-row flex-wrap">
                <div className="hidden sm:block sm:w-1/2 lg:w-1/3">
                    <Info adventurer={adventurer}/>
                </div>
                {/*<div className="hidden sm:block sm:w-1/2 lg:w-2/3">*/}
                <MapAction attack={attack} exit={onExit}></MapAction>
                {/*</div>*/}
            </div>
        );
    }
}
