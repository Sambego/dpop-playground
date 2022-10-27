import { FC } from 'react';
import styles from '../styles/Header.module.css';
import Container from './container';

const Header: FC = () => {
    return (
        <header className={styles.header}>
            <Container>
                <h1 className={styles.title}>DPoP</h1>  
                <p className={styles.intro}><strong>DPoP (for Demonstrating Proof-of-Possession at the Application Layer)</strong> is an application-level mechanism for sender-constraining OAuth access and refresh tokens. It enables a client to prove the possession of a public/private key pair by including a DPoP header in an HTTP request. The value of the header is a JSON Web Token (JWT) [RFC7519] that enables the authorization server to bind issued tokens to the public part of a client's key pair. Recipients of such tokens are then able to verify the binding of the token to the key pair that the client has demonstrated that it holds via the DPoP header, thereby providing some assurance that the client presenting the token also possesses the private key. In other words, the legitimate presenter of the token is constrained to be the sender that holds and can prove possession of the private part of the key pair.</p>
            </Container>
        </header>        
    )
}

export default Header

