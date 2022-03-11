export const truncate = (str: string, n: number) => {
    if (!str) {
        return '';
    }
    return str.length > n ? str.substring(0, n - 1) + '...' : str;
};

export const truncateBasic = (str: string, n: number) => {
    if (!str) {
        return '';
    }
    return str.length > n ? str.substring(0, n - 1) : str;
};
