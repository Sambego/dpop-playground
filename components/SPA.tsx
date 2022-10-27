import { FC, FormEventHandler, useEffect, useState } from 'react';
import Window from './window';
import styles from '../styles/SPA.module.css';
import Button from './button';
import { getRandomInt } from '../helpers/randomData';
import { APP_DOMAIN, USER } from '../helpers/constants';

type SPAProps = {
    onLogin?: FormEventHandler
    loggedIn?: boolean,
    url?: string,
    isActive: boolean
}

const SPA: FC<SPAProps> = ({url = APP_DOMAIN, loggedIn = false, onLogin = () => {}, isActive}) => {
    const lines:number = 10;
    const [lineLengths, setLineLengths] = useState<Array<number>>([])

    useEffect(() => {
        let randomValues: Array<number> = [];
        let i: number = 0;
        
        for(; i < lines; i++) {
            randomValues = [...randomValues, getRandomInt(40,100)];
            setLineLengths(randomValues)
        }
    }, [lines])
    
    return (
        <Window padded={false} url={url}>
           <header className={styles.header}>
               DPoP Central
               {!loggedIn && <Button full={false} onClick={onLogin} disabled={!isActive}>Login</Button>}
               {loggedIn && <div><span className={styles.user}></span> {USER}</div>}
            </header>
            <section className={styles.content}>
                {lineLengths.map((lineLength: number, index: number) => <div style={{width: `${lineLength}%`}} key={index} className={`${styles.line} ${index === 0 ? styles.first : ''} ${index === Math.floor(lines/2) ? styles.h : ''}`} />)}
            </section>
        </Window>        
    )
}

export default SPA

