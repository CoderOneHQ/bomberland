import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Constants } from "../../utilities/Constants";
import { getAxiosRequestConfig } from "../../utilities/getAxiosRequestConfig";

interface IResponse {
    readonly build: number;
}

const getBuild = async () => {
    const config = getAxiosRequestConfig();
    const uri = `${Constants.ApiRoot}/build`;
    try {
        const { data } = await axios.get<IResponse>(uri, config);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const useBuild = () => {
    return useQuery(["build"], () => getBuild());
};
