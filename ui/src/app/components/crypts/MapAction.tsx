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
    exit: (...args: any[]) => any;
    buffAdventurer: (...args: any[]) => any;
}


export const MapAction = ({attack, flee, exit,buffAdventurer}: MapActionProps) => {

    const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);

    // const adventurer = useAdventurerStore((state) => state.adventurer);

    return (
        <>
            {
                <CryptsBeastScreen
                    attack={attack} flee={flee} exit={exit} buffAdventurer={buffAdventurer}/>
            }
        </>
    );
};
