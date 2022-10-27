import type { FC, FormEvent, FormEventHandler } from 'react'
import Button from '../button'
import Columns from '../columns'
import Num from '../number'
import SPA from '../SPA'

type Step1Props = {
  handleNext: Function,
  activeStep: number
}

const Step1: FC<Step1Props> = ({handleNext, activeStep}) => {
  const handleLogin: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    handleNext();
  }
  
  return (
    <section>
        <Columns>
          <SPA onLogin={handleLogin} isActive={activeStep === 1}/>
          <div>
            <h2><Num>1.</Num>A user want to login on your application</h2>
            <p>Modern applications often require users to login to see certain pages or perform specific actions. In a modern OAuth/OpenID Connect scenario, the user is often redirected to a the authorization server.</p>
            <p>When the users clicks the login button, we are going to initiate the redirect, and request an Authorization Code.</p>
            <Button onClick={handleLogin}>Let's go to the login page</Button>
            <p className="note">For this example we're using the Authorization Code Grant. Depending on your type of application this might not be the right choice. How to leverage DPoP to demonstrate proof of possession will remain the same for all OAuth flows.</p>
          </div>
        </Columns>
    </section>        
  )
}

export default Step1

