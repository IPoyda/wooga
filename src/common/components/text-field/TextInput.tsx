import React, {FC, ChangeEvent, useCallback} from 'react';
import classNames from "classnames";
import styles from "./TextInput.module.css";

type TextInputProps = {
    label: string;
    name: string;
    showError?: boolean; 
    placeholder?: string;
    errorMessage?: string;
    classes?: { root?: string, label?: string, input?: string, error?: string };
    validators?: Array<(value: string) => boolean>;
    onChange?: (name: string, value: string) => void;
}

const DEFAULT_ERROR_MESSAGE = "Invalid data input";

const TextInput: FC<TextInputProps> = (props: TextInputProps) => {
    const {label, name, placeholder, classes = {}, errorMessage = DEFAULT_ERROR_MESSAGE, showError, onChange} = props;

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) =>
        onChange && onChange(name, e.target.value), [name, onChange]);

    return (
        <div className={classNames(styles.textInputContainer, classes?.root)}>
            <label htmlFor={name} className={classNames(styles.textInputLabel, classes?.label)}>{label}</label>
            <input
                type="text"
                name={name}
                placeholder={placeholder || name}
                onChange={handleChange}
                className={classNames(styles.textInput, classes?.input)}
            />
            {showError && <p className={classNames(styles.inputError, classes.error)}>{errorMessage}</p>}
        </div>
    );
};

export default TextInput;