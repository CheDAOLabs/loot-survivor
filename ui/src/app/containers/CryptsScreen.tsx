import React, {ChangeEvent, useState} from "react";
import {Button} from "../components/buttons/Button";


export interface CryptsProps {
    setFormData: (data: FormData) => void;
    formData: FormData;
    handleBack: () => void;
    step: number;
    setStep: (step: number) => void;
}

/**
 * @container
 * @description
 */
export default function CryptsScreen() {


    const [isMaxLength, setIsMaxLength] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value.slice(0, 13),
        });
        if (value.length >= 13) {
            setIsMaxLength(true);
        } else {
            setIsMaxLength(false);
        }
    };

    return (

        <div className="sm:w-3/4 text-center p-4 uppercase 2xl:flex 2xl:flex-col 2xl:gap-10 2xl:h-[700px]">
            <h3 className="2xl:text-5xl">Please Enter The Code</h3>
            <div className="relative items-center flex flex-col gap-2">
                <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    className="p-1 m-2 2xl:h-16 2xl:w-64 2xl:text-4xl bg-terminal-black border border-terminal-green animate-pulse transform"
                    maxLength={13}
                />
                {isMaxLength && (
                    <p className="absolute top-10 sm:top-20">MAX LENGTH!</p>
                )}
            </div>
            <div className="hidden sm:flex flex-row justify-center">
                <Button size={"lg"}>INQUIRE</Button>
            </div>
            <div className="hidden sm:flex flex-row justify-center 2xl:gap-10">
                <a>CODING LIBRARY</a>
                <a>MY CC</a>
            </div>
        </div>
    );
}
