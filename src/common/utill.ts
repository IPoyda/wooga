export const patternValidator = (pattern: { test: (val: string) => boolean}) => (value: string) => {
    return typeof pattern?.test === "function" ? pattern.test(value) : false;
};


