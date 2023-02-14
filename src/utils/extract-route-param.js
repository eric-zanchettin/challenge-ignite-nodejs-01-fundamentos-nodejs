export default function extractUUID(url) {
    const uuidRegEx = /([A-Za-z0-9]+(-[A-Za-z0-9]+)+)/

    return url.match(uuidRegEx)[0];
};