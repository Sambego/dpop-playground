import type { FC, ReactNode } from 'react'
import styles from '../styles/Columns.module.css';

type ColumnsProps = {
  children: ReactNode
}

const Columns: FC<ColumnsProps> = ({children}) => {  
  return (
    <div className={styles.columns}>{children}</div>        
  )
}

export default Columns

