export type Validator = (value: string | number | null | undefined) => boolean;

export type FormField = {
    name: string;
    showError?: boolean;
    validators?: Array<Validator>;
}
export type FieldValue = string | number | undefined | null;
export type FormData = { [key: string]: FieldValue };