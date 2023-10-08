import React, {useState, ChangeEvent} from "react";
import {Button} from "../buttons/Button";
import {FormData} from "@/app/types";

export interface MapInfoProps {
    setFormData: (data: FormData) => void;
    formData: FormData;
    handleBack: () => void;
    handleEnter: () => void;
    step: number;
    setStep: (step: number) => void;
}

export const MapInfo = ({
                            setFormData,
                            formData,
                            handleBack,
                            handleEnter,
                            step,
                            setStep,
                        }: MapInfoProps) => {
    const [isMaxLength, setIsMaxLength] = useState(false);


    return (
        <>
            <div className="sm:w-3/4 text-center p-4 uppercase 2xl:flex 2xl:flex-col 2xl:gap-10 2xl:h-[700px]">
                <h3 className="2xl:text-5xl">Owner: 123123123123123</h3>
                <h3 className="2xl:text-5xl">Type: 123123123123123</h3>
                <h3 className="2xl:text-5xl">ADMISSION FEE: 1/20</h3>

                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10">
                    <img src="https://openseauserdata.com/files/d2c0f4b0bd85871bfd3b6eea02e9059a.svg" width={200}/>
                </div>

                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10 mt-3">
                    <Button size={"lg"} onClick={handleBack}>BACK</Button>
                    <Button size={"lg"} className="ml-3" onClick={handleEnter}>ENTER</Button>

                </div>
            </div>
        </>
    );
};
