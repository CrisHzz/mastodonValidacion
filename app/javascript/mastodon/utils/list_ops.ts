export const first = <T>(arr: T[]) => arr[0];
export const last = <T>(arr: T[]) => arr[arr.length - 1];
export const head = <T>(arr: T[]) => arr.slice(0, 1);
export const tail = <T>(arr: T[]) => arr.slice(1);
export const take = <T>(arr: T[], n: number) => arr.slice(0, n);
export const drop = <T>(arr: T[], n: number) => arr.slice(n);
export const reverse = <T>(arr: T[]) => [...arr].reverse();
export const concat2 = <T>(a: T[], b: T[]) => [...a, ...b];
export const length = <T>(arr: T[]) => arr.length;
export const isEmpty = <T>(arr: T[]) => arr.length === 0;

