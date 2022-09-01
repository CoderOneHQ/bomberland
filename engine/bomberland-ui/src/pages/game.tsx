import React from "react";
import Bomberman from "../components/Game/Bomberman.page";
import { SSRGuard } from "../components/SSRGuard/SSRGuard";
const Page: React.FC<React.PropsWithChildren<unknown>> = () => {
    return (
        <>
            <SSRGuard>
                <Bomberman />
            </SSRGuard>
        </>
    );
};

export default Page;
