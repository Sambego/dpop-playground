import { EventHandler, FC, FormEventHandler, ReactNode } from 'react';
import styles from '../styles/Button.module.css';

type ButtonProps = {
    children: ReactNode,
    submit?: boolean,
    disabled?: boolean,
    full?: boolean,
    onClick?: FormEventHandler
}

const Button: FC<ButtonProps> = ({children, submit = false, full = true, onClick = () => {}}) => {
    return (
        <button className={`${styles.button} ${full ? styles.full : ''}`} type={submit ? 'submit' : 'button'} onClick={onClick}>{children}</button>
    )
}

export default Button

