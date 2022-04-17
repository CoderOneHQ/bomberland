import * as React from "react";
import { useState } from "react";

interface ISoundContext {
    readonly volume: number;
    readonly setVolume: (value: number) => void;
}

export const SoundContext = React.createContext({} as ISoundContext);

export const SoundContextProvider: React.FC = ({ children }) => {
    const [volume, setVolume] = useState(0);

    return <SoundContext.Provider value={{ volume, setVolume }}>{children}</SoundContext.Provider>;
};
