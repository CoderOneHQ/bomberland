import React from "react";
import Bomberman from "../components/PageSwitch/pages/Game/Bomberman.page";
import { SSRGuard } from "../components/SSRGuard/SSRGuard";
const Page: React.FC = () => {
    return (
        <>
            <SSRGuard>
                <Bomberman />
            </SSRGuard>
        </>
    );
};

export default Page;
