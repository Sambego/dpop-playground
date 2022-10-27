import { FC, ReactNode } from 'react';
import styles from '../styles/Light.module.css';

type LightProps = {
    children: ReactNode
}

const Light: FC<LightProps> = ({children}) => {
    return (
        <span className={styles.light}>{children} </span>        
    )
}

export default Light

