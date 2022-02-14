export const truncate = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n - 1) + '...' : str;
};

export const truncateBasic = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n - 1) : str;
};
