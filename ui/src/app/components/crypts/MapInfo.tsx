import React, {useState, ChangeEvent} from "react";
import {Button} from "../buttons/Button";
import {FormData} from "@/app/types";
import {constants, Provider, Contract} from "starknet";


export interface MapInfoProps {
    handleBack: () => void;
    handleEnter: () => void;
    owner: any;
    svg: any;
    name: any;
}


export const MapInfo = ({
                            handleBack,
                            handleEnter,
                            owner, name, svg
                        }: MapInfoProps) => {
    const [isMaxLength, setIsMaxLength] = useState(false);


    return (
        <>
            <div className=" text-center p-4 uppercase 2xl:flex 2xl:flex-col 2xl:gap-10 2xl:h-[700px]">
                <div className="2xl:text-3xl">Owner: {owner}<br/>Type:{name}<br/>ADMISSION FEE: 1/20
                </div>


                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10"  >
                    {/*<img src="https://openseauserdata.com/files/d2c0f4b0bd85871bfd3b6eea02e9059a.svg" width={200}/>*/}
                    <div style={{"height":"200px","width":"200px"}} dangerouslySetInnerHTML={{__html:svg}}/>
                </div>

                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10 mt-3">
                    <Button size={"lg"} onClick={handleBack}>BACK</Button>
                    <Button size={"lg"} className="ml-3" onClick={handleEnter}>ENTER</Button>

                </div>
            </div>
        </>
    );
};
