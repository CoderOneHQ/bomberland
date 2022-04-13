import axios from "axios";

interface IGetEngineVersionResponse {
    readonly latest: number;
    readonly minBuild: number;
}
const DEV_BUILD_NUMBER = -1;

const evaluateBuildNumber = (build: string) => {
    if (build === "dev") {
        return DEV_BUILD_NUMBER;
    } else {
        return parseInt(build);
    }
};

export const checkLatestEngineVersion = async (environment: string, build: string) => {
    const buildNumber = evaluateBuildNumber(build);
    try {
        const url = environment === "production" ? "https://gocoder.one/api/engine-version" : "http://api:8080/engine-version";
        const response = await axios.get<IGetEngineVersionResponse>(url);
        if (buildNumber !== DEV_BUILD_NUMBER) {
            const { data } = response;
            if (buildNumber < data.minBuild) {
                console.warn(
                    `Warning: Your build of the game engine: ${buildNumber} is no longer supported. Minimum supported build is: ${data.minBuild}. There are no guarantees that things will continue to work.`
                );
            }
            if (buildNumber < data.latest) {
                console.info(`Latest build of the game engine is: ${data.latest} you are currently running build: ${buildNumber}`);
            }
        }
    } catch {}
};
