import React, {ChangeEvent, useState} from "react";
import {Button} from "../components/buttons/Button";


import {EnterCode} from "../components/crypts/EnterCode";
import {MapInfo} from "../components/crypts/MapInfo";
import Info from "../components/adventurer/Info";
import {NullAdventurer} from "../types";
import {useQueriesStore} from "../hooks/useQueryStore";


/**
 * @container
 * @description
 */
export default function CryptsScreen() {

    const { data, setData, setIsLoading, setNotLoading, refetch } =
        useQueriesStore();


    const adventurer =
        data.leaderboardByIdQuery?.adventurers[0] ?? NullAdventurer;



    const [formData, setFormData] = useState<FormData>({
        name: "",
    });

    const [step, setStep] = useState(1);


    const onEnterCode = ()=>{
        // alert("entercode");
        console.log(formData);
        setStep(2);
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
                    <MapInfo handleBack={onEnterCode} setFormData={setFormData} formData={formData}></MapInfo>
                </div>
            </div>
        );
    }
}
