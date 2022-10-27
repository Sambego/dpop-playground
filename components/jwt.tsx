import { FC, ReactNode } from 'react';
import styles from '../styles/JWT.module.css';

type JWTProps = {
    jwt: string
}

const JWT: FC<JWTProps> = ({jwt}) => {
    const [header, payload, signature] = jwt.split('.');
    
    return (
        <span className={styles.jwt}>
            <span className={styles.header}>{header}</span>.
            <span className={styles.payload}>{payload}</span>.
            <span className={styles.signature}>{signature}</span>
        </span>
    )
}

export default JWT
