export const getOrigin = () => {
    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}`;
    } else {
        return ``;
    }
};
