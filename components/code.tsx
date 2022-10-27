import { FC, ReactNode } from 'react';
import styles from '../styles/Code.module.css';

type CodeProps = {
    children: ReactNode,
    block?: boolean
}

const Code: FC<CodeProps> = ({block, children}) => {
    return (
        <code className={`${styles.code} ${block ? styles.block : ''}`}>{children}</code>        
    )
}

export default Code

