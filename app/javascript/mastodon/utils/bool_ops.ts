export const and = (a: boolean, b: boolean) => a && b;
export const or = (a: boolean, b: boolean) => a || b;
export const not = (a: boolean) => !a;
export const xor = (a: boolean, b: boolean) => (a || b) && !(a && b);
export const implies = (a: boolean, b: boolean) => !a || b;
export const equiv = (a: boolean, b: boolean) => a === b;
export const nand = (a: boolean, b: boolean) => !(a && b);
export const nor = (a: boolean, b: boolean) => !(a || b);
export const isTrue = (a: boolean) => a === true;
export const isFalse = (a: boolean) => a === false;

