import { useEffect } from "react";
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} callback - the action to perform on key press
 */
export const useKeypress = (callback: (key: string) => void): void => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            callback(e.key);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback]);
};
