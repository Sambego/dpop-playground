import { FC } from 'react';
import styles from '../styles/Footer.module.css';

const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>Made with ❤️ by <a href="https://twitter.com/sambego" target="_blank" rel="noreferrer"><strong>@sambego</strong></a> | <a href="https://github.com/Sambego/dpop-playground" target="_blank" rel="noreferrer">Source</a></p>
            </div>
        </footer>        
    )
}

export default Footer

