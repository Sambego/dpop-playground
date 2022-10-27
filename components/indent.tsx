import { FC, ReactNode } from 'react';
import styles from '../styles/Indent.module.css';

type IndentProps = {
    children: ReactNode
}

const Indent: FC<IndentProps> = ({children}) => {
    return (
        <span className={styles.indent}>{children} </span>        
    )
}

export default Indent

