import { FC, ReactNode } from 'react';
import { APP_DOMAIN } from '../helpers/constants';
import styles from '../styles/Termminal.module.css';

type TermminalProps = {
    children: ReactNode,
    title?: string,
    padded?: boolean
}

const Termminal: FC<TermminalProps> = ({children, title = 'Terminal', padded = true}) => {
    return (
        <div className={styles.termminal}>
            <header className={styles.header}>
                <div className={styles.title}>{title}</div>
            </header>
            <div className={`${styles.content}`}><pre>{children}</pre></div>
        </div>        
    )
}

export default Termminal

