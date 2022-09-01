import { AppContext } from "./src/components/AppContext/AppContext";
import * as React from "react";

export const wrapPageElement = ({ element, props }) => {
    return <AppContext {...props}>{element}</AppContext>;
};
