import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "../buttons/Button";
import { FormData } from "@/app/types";
import { constants, Provider, Contract } from "starknet";


export interface MapInfoProps {
    handleBack: () => void;
    handleEnter: () => void;
    owner: any;
    svg: any;
    name: any;
    render: () => any;
    dungeon: any;
}

export const MapInfo = ({handleBack, handleEnter, owner, name, svg, render, dungeon}: MapInfoProps) => {
    
    return (
        <>
            <div className=" text-center p-4 uppercase 2xl:flex 2xl:flex-col 2xl:gap-10 {/*2xl:h-[700px*/}]">
                <div className="2xl:text-xl">
                    Owner: { owner }
                    <br/>Type:{ name }
                    <br/>ADMISSION FEE: 1/20
                </div>
                
                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10">
                    {/*<img src="https://openseauserdata.com/files/d2c0f4b0bd85871bfd3b6eea02e9059a.svg" width={200}/>*/ }
                    <div style={ {
                        display: "flex", /*height: "500px",*/ width: "500px", justifyContent: "center",
                    } }>
                        <pre style={ {} } dangerouslySetInnerHTML={ {__html: render()} }/>
                    </div>
                </div>
                
                <div className="hidden sm:flex flex-row justify-center 2xl:gap-10 mt-3">
                    <Button size={ "lg" } onClick={ handleBack }>BACK</Button>
                    <Button size={ "lg" } className="ml-3" onClick={ handleEnter }>ENTER</Button>
                </div>
            </div>
        </>
    );
};
