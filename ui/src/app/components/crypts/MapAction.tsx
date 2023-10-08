import React, {useState, ChangeEvent} from "react";
import {Button} from "../buttons/Button";
import {FormData} from "@/app/types";
import CryptsBeastScreen from "../../containers/CryptsBeastScreen";
import Discovery from "../actions/Discovery";
import MazeLoader from "../icons/MazeLoader";
import VerticalKeyboardControl from "../menu/VerticalMenu";
import useAdventurerStore from "../../hooks/useAdventurerStore";

interface MapActionProps {
    attack: (...args: any[]) => any;
    flee: (...args: any[]) => any;
}

export const MapAction = ({
                              attack, flee
                          }: MapActionProps) => {

    const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);

    const adventurer = useAdventurerStore((state) => state.adventurer);

    return (
        <>
            {
                hasBeast ? (
                    <CryptsBeastScreen attack={attack} flee={flee}/>
                ) : (
                    <div className="flex flex-col sm:flex-row flex-wrap">
                        <div className="flex flex-row items-center justify-center mr-3">
                            <h3 className="text-center">&nbsp;&nbsp;&nbsp;Please Select an Adventurer</h3>
                        </div>
                    </div>
                )
            }
        </>
    );
};
