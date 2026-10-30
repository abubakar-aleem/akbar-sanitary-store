export const rs = (n: number) => 'Rs. ' + Math.round(n).toLocaleString('en-PK');
export const approx = (n: number) => 'Approx. ' + rs(n);
export const pad2 = (n: number) => String(n).padStart(2, '0');
