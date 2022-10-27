import { FC, ReactNode } from 'react';
import { APP_DOMAIN } from '../helpers/constants';
import styles from '../styles/Window.module.css';

type WindowProps = {
    children: ReactNode,
    url?: string,
    padded?: boolean
}

const Window: FC<WindowProps> = ({children, url = APP_DOMAIN, padded = true}) => {
    return (
        <div className={styles.window}>
            <header className={styles.header}>
                <div className={styles.traffic}>
                    <span className={styles.red} />
                    <span className={styles.yellow} />
                    <span className={styles.green} />
                </div>
                <input className={styles.address} type="text" value={url} disabled />
            </header>
            <div className={`${styles.content} ${padded ? 'padded' : ''}`}>{children}</div>
        </div>        
    )
}

export default Window

