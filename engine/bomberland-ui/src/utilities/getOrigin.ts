export const getOrigin = () => {
    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    } else {
        return ``;
    }
};
