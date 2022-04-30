import React, {FC, useCallback, useState, ReactNode, ReactPortal, useMemo} from 'react';
import {FieldValue, FormData, Validator} from "../../types";
import Button from "../button/Button";
import styles from "./GenericForm.module.css";
import classnames from "classnames";

type GenericFormProps = {
    children: Array<ReactNode>;
    classes?: { root?: string, actions?: string };
    onSubmit: (formData: FormData) => void;
}

const GenericForm: FC<GenericFormProps> = (props: GenericFormProps) => {
    const {children, classes, onSubmit} = props;

    const [formData, setFormData] = useState<FormData>({});
    const [formSubmitted, setFromSubmitted] = useState<boolean>(false);

    const handleFieldChange = useCallback((name: string, value: string) =>
        setFormData({ ...formData, [name]: value }), [formData]);

    const formFields: any = useMemo(() => {
        return React.Children.map(children, field => {
            let childComponent = field;
            if (React.isValidElement(field)) {
                const fieldProps = (field as ReactPortal).props;
                const isFieldValid = isValidField(formData[fieldProps.name], fieldProps.validators);
                childComponent = React.cloneElement(field, {
                    showError: formSubmitted && !isFieldValid,
                    onChange: handleFieldChange
                });
            }
            return childComponent;
        });
    }, [children, formData, formSubmitted, handleFieldChange]);

    const handleSubmit = useCallback(() => {
        setFromSubmitted(true);
        if (isValidForm(formFields, formData)) {
            onSubmit(formData);
        }
    }, [formFields, formData, onSubmit]);

    return (
        <div className={classnames(styles.genericFormContainer, classes?.root)}>
            {formFields}
            <div className={classnames(styles.formActions, classes?.actions)}>
                <Button classes={{ root: styles.submit }} onClick={handleSubmit}>{"Submit"}</Button>
            </div>
        </div>
    )
};

function isValidForm (formFields: Array<ReactNode>, formData: FormData) {
    return formFields.every((field: ReactNode) =>  {
        const fieldProps = (field as ReactPortal).props;
        return isValidField(formData[fieldProps.name], fieldProps.validators);
    })
}

function isValidField (value: FieldValue, validators: Array<Validator> = []) {
    return validators.every((validator: Validator) => validator(value));
}

export default GenericForm;
