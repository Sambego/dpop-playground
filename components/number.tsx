import { FC, ReactNode } from 'react';
import styles from '../styles/Number.module.css';

type NumProps = {
    children: ReactNode
}

const Num: FC<NumProps> = ({children}) => {
    return (
        <span className={styles.number}>{children}</span>
    )
}

export default Num

