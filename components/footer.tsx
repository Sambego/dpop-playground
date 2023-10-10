import { FC } from 'react';
import styles from '../styles/Footer.module.css';
import Container from './container';

const Footer: FC = () => {
    return (
        <header className={styles.header}>
            <Container>
                <p>Made with ❤️ by <a href="https://twitter.com/sambego" target="_blank" rel="noreferrer"><strong>@sambego</strong></a> | <a href="https://github.com/Sambego/dpop-playground" target="_blank" rel="noreferrer">Source</a></p>
            </Container>
        </header>        
    )
}

export default Footer

