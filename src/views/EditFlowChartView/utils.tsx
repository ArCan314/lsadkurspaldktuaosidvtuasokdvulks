export const toNumber = (num: number | string): number => {
    if (typeof num === 'string')
        return parseInt(num);
    return num;
};