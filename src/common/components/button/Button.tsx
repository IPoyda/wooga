import React, {FC, ReactNode} from "react";
import styles from "./Button.module.css";
import classnames from "classnames";

type IButtonProps = {
    children: ReactNode,
    classes?: { root?: string },
    disabled?: boolean;
    type?: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
}

const Button: FC<IButtonProps> = (props: IButtonProps) => {
    const { children, classes, ...rest } = props;
    return (
        <button className={classnames(styles.primaryButton, classes?.root)} {...rest}>
            {children}
        </button>
    )

};

export default Button;
