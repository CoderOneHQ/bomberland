import * as React from "react";
import { useEffect, useState } from "react";

export const SSRGuard: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
};
