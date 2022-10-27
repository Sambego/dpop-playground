import { FC, FormEventHandler } from 'react';
import { APP_DOMAIN, AUTHORIZATION_SERVER, USER } from '../helpers/constants';
import Window from './window';
import styles from '../styles/Login.module.css';
import Button from './button';

type LoginProps = {
    onSubmit: FormEventHandler,
    isActive: boolean,
    clientId: string
}

const Login: FC<LoginProps> = ({isActive, clientId, onSubmit = () => {}}) => {
    console.log(isActive)

    return (
        <Window url={`${AUTHORIZATION_SERVER}?response_type=code&redirect_uri=${encodeURIComponent(APP_DOMAIN)}&scope=openid%20profile&client_id=${clientId}`}>
            <form className={styles.form} onSubmit={onSubmit}>
                <h3 className={styles.title}>Please login</h3>
                <label className={styles.label} htmlFor="username">Username</label>
                <input className={styles.input} type="text" name="username" value={USER} disabled/>
                <label className={styles.label} htmlFor="password">Username</label>
                <input className={styles.input} type="password" name="password" value="password" disabled/>
                <Button disabled={!isActive} submit>Log in</Button>
            </form>
        </Window>        
    )
}

export default Login