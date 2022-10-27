import { FC, FormEventHandler } from 'react'
import { APP_DOMAIN } from '../../helpers/constants'
import Button from '../button'
import Code from '../code'
import Columns from '../columns'
import Num from '../number'
import SPA from '../SPA'

type Step3Props = {
  authorizationCode: string,
  handleNext: FormEventHandler,
  activeStep: number
}

const Step3: FC<Step3Props> = ({authorizationCode, handleNext, activeStep}) => {  
  return (
    <section>
        <Columns>
          <SPA isActive={activeStep === 3} loggedIn url={`${APP_DOMAIN}?code=${authorizationCode}`}/>
          <div>
            <h2><Num>3.</Num>Get the Authorization Code</h2>  
            <p>We were redirected back to our application on succeful logging in.</p>
            <p>When our Authorization server sent us back to our application, it attached the Authorization Code <Code>{authorizationCode}</Code> as the <Code>code</Code> url parameter.</p>
            <Button disabled={activeStep !== 3} onClick={handleNext}>Now, let<>&apos;</>s create a DPoP proof</Button>
          </div>
        </Columns>
    </section>        
  )
}

export default Step3

