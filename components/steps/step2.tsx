import type { FC, FormEvent, FormEventHandler } from 'react'
import Button from '../button'
import Code from '../code'
import Columns from '../columns'
import Login from '../login'
import Num from '../number'

type Step2Props = {
  handleNext: Function,
  activeStep: number,
  clientId: string
}

const Step2: FC<Step2Props> = ({handleNext, clientId, activeStep}) => {
  const handleLogin: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    
    if (activeStep === 2) {
      handleNext();
    }
  }
  
  return (
    <section>
        <Columns>
          <div>
            <h2><Num>2.</Num>Redirect to the authorization server to login</h2>
            <p>Once the user has clicked on the login button within our application, we will redirect to our Authorization Server to deal with logging in the user.</p>
            <p>If the user provides the correct credentials, the Authorization server will redirect back to the application as specified in the <Code>redirect_uri</Code> query parameter. It will also attach an Authorization code, which we exchange for an Access Token.</p>
            <Button onClick={handleLogin}>Redirect back to our application</Button>
          </div>
          <Login onSubmit={handleLogin} isActive={activeStep === 2} clientId={clientId}/>
        </Columns>
    </section>        
  )
}

export default Step2

