import React, {FC, useCallback} from 'react';
import {FormData} from "../../common/types";
import styles from "./ContatcsForm.module.css";
import {
    GenericFormActions,
    GenericFormBody,
    GenericFormContainer,
    GenericFormHeader
} from "../../common/components/form/GenericForm";
import TextInput from "../../common/components/text-field/TextInput";
import {patternValidator} from "../../common/utill";
import {VALIDATION_REGEXPS} from "../../common/constants";
import Button from "../../common/components/button/Button";

const fields = [
    {
        label: "First Name",
        name: "firstName",
        errorMessage: "Should start with 'wooga.name'",
        validators: [patternValidator(VALIDATION_REGEXPS.WOOGA_NAME)]
    },
    { label: "Last Name", name: "lastName" },
    { label: "Email", name: "email", validators: [patternValidator(VALIDATION_REGEXPS.EMAIL)] },
    {
        label: "Password",
        name: "password",
        errorMessage: "Should contain at least one digit, one lower case, one upper case, least 8 characters",
        validators: [patternValidator(VALIDATION_REGEXPS.PASSWORD)]
    },
    { label: "Phone", name: "phone" }
];

const ContactsForm: FC = () => {
    const handleSubmit = useCallback((formData: FormData) => {
        alert(JSON.stringify(formData, null, 2));
    }, []);

    return (
        <div className={styles.contactsFormContainer}>
            <GenericFormContainer onSubmit={handleSubmit}>
                <GenericFormHeader label={"Contacts Form"}/>
                <GenericFormBody>
                    {fields.map((field: typeof fields[0]) => (
                        <TextInput
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            errorMessage={field.errorMessage}
                            validators={field.validators}
                        />
                    ))}
                </GenericFormBody>
                <GenericFormActions>
                    <Button type="submit" classes={{root: styles.submit}}>{"Submit"}</Button>
                </GenericFormActions>
            </GenericFormContainer>
        </div>
    );
};

export default ContactsForm;