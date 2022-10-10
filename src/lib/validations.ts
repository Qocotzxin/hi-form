export const required = (value: string | number | boolean) => !!value;
export const minLength = (value: string) => value && value.length;
