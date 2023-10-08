import React, {useState, ChangeEvent} from "react";
import {Button} from "../buttons/Button";
import {FormData} from "@/app/types";
import BeastScreen from "../../containers/BeastScreen";
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
    const [isMaxLength, setIsMaxLength] = useState(false);

    const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);

    const adventurer = useAdventurerStore((state) => state.adventurer);

    return (
        <>
            {
                hasBeast ? (
                    <BeastScreen attack={attack} flee={flee}/>
                ) : (
                    <></>
                )
            }
        </>
    );
};
