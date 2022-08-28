import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../../utilities/i18n";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});

export const AppContext: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
