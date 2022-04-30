import React, {FC, useCallback, useState, ReactNode, ReactPortal, useMemo, ReactElement} from 'react';
import {FieldValue, FormData, FormField, Validator} from "../../types";
import styles from "./GenericForm.module.css";
import classnames from "classnames";

type GenericFormContainerProps = {
    children: ReactNode;
    classes?: { root?: string, actions?: string };
    onSubmit: (formData: FormData) => void;
}

type GenericFormHeaderProps = { label: string; classes?: { root?: string } };

type GenericFormBodyProps = { children: ReactNode; classes?: { root?: string } };

type GenericFormActionsProps = { children: ReactNode; classes?: { root?: string } };

type FormComponents = {header: ReactNode, body: ReactNode, actions: ReactNode};

export const GenericFormContainer: FC<GenericFormContainerProps> = (props: GenericFormContainerProps) => {
    const {children, classes, onSubmit} = props;

    const [formData, setFormData] = useState<FormData>({});
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const handleFieldChange = useCallback((name: string, value: string) =>
        setFormData({...formData, [name]: value}), [formData]);

    const {header: formHeader, body, actions} = useMemo(() => getFormComponents(children), [children]);

    const formFields = useMemo(() => React.Children.map((body as ReactPortal)?.props?.children, childNode => {
        let childComponent = childNode;
        if (React.isValidElement(childNode)) {
            const childProps = childNode.props as FormField;
            const isFieldValid = isValidField(formData[childProps.name], childProps.validators);
            childComponent = React.cloneElement(childNode as ReactElement, {
                showError: formSubmitted && !isFieldValid,
                onChange: handleFieldChange
            });
        }
        return childComponent;
    }), [body, formSubmitted, handleFieldChange]);

    const handleSubmit = useCallback(() => {
        setFormSubmitted(true);
        if (isValidForm(formFields, formData)) {
            onSubmit(formData);
        }
    }, [formFields, formData, onSubmit]);

    const formActions = useMemo(() => React.Children.map((actions as ReactPortal)?.props?.children, childNode => {
        let childComponent = childNode;
        if (React.isValidElement(childNode)) {
            const childProps = childNode.props as { type: string };
            if (childProps.type === "submit") {
                childComponent = React.cloneElement(childNode as ReactElement, {
                    onClick: handleSubmit
                });
            }
        }
        return childComponent;
    }), [actions, handleSubmit]);

    return (
        <div className={classnames(styles.genericFormContainer, classes?.root)}>
            {formHeader}
            {formFields}
            {formActions}
        </div>
    )
}

export const GenericFormHeader: FC<GenericFormHeaderProps> = (props: GenericFormHeaderProps) => {
    const {label, classes} = props;
    return (
        <div className={classnames(styles.genericFormHeader, classes?.root)}>
            {label}
        </div>
    )
}

export const GenericFormBody: FC<GenericFormBodyProps> = (props: GenericFormBodyProps) => {
    const {children, classes} = props;
    return (
        <div className={classnames(styles.genericFormBody, classes?.root)}>
            {children}
        </div>
    )
}

export const GenericFormActions: FC<GenericFormActionsProps> = (props: GenericFormActionsProps) => {
    const {children, classes} = props;
    return (
        <div className={classnames(styles.genericFormActions, classes?.root)}>
            {children}
        </div>
    )
}

function getFormComponents(nodes: ReactNode): FormComponents {
    const result = {header: {}, body: {}, actions: {}} as FormComponents;
    React.Children.map(nodes, node => {
        if (React.isValidElement(node)) {
            const nodeName = (node?.type as any)?.name;
            if (nodeName === "GenericFormHeader") {
                result.header = React.cloneElement(node);
            }
            if (nodeName === "GenericFormBody") {
                result.body = React.cloneElement(node);
            }
            if (nodeName === "GenericFormActions") {
                result.actions = React.cloneElement(node);
            }
        }
    });
    return result;
}

function isValidForm(formFields: Array<ReactNode>, formData: FormData) {
    return formFields.every((field: ReactNode) => {
        const fieldProps = (field as ReactPortal).props;
        return isValidField(formData[fieldProps.name], fieldProps.validators);
    })
}

function isValidField(value: FieldValue, validators: Array<Validator> = []) {
    return validators.every((validator: Validator) => validator(value));
}
