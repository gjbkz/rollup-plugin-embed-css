export const compareString = (
    s1: string,
    s2: string,
): -1 | 0 | 1 => {
    if (s1 > s2) {
        return 1;
    } else if (s1 < s2) {
        return -1;
    }
    return 0;
};
