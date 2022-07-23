import { AxiosRequestConfig } from "axios";
import { telemetry } from "./Telemetry/Telemetry";

export const getAxiosRequestConfig = (token?: string | null, signal?: AbortSignal | undefined): AxiosRequestConfig => {
    const defaultHeaders = { "x-initId": telemetry.InitId };
    return {
        headers: {
            ...defaultHeaders,
            ...(token !== null && { Authorization: `Bearer ${token}` }),
        },
        ...(signal !== undefined && { signal }),
    };
};
