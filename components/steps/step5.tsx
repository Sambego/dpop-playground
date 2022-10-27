import { FC, FormEventHandler, useState, useEffect } from 'react'
import Columns from '../columns'
import Terminal from '../Terminal'
import * as jose from 'jose'
import Button from '../button'
import { APP_DOMAIN, AUTHORIZATION_SERVER } from '../../helpers/constants'
import Code from '../code'
import JWT from '../jwt'
import Light from '../light'
import Indent from '../indent'
import Num from '../number'

type Step5Props = {
    proof: string,
    accessToken: string,
    authorizationCode: string,
    authorizationServerPublicKey: jose.KeyLike,
    handleNext: FormEventHandler,
    activeStep: number
}
const Step5: FC<Step5Props> = ({proof = '', authorizationCode = '', accessToken = '', authorizationServerPublicKey, handleNext, activeStep}) => {
    // @ts-ignore: Object is possibly 'null'.
    const [header, setHeader] = useState<jose.CompactJWSHeaderParameters>();
    const [payload, setPayload] = useState<string>('{}');

    useEffect(() => {
        (async () => {
            if (authorizationServerPublicKey) {
                const { payload, protectedHeader } = await jose.compactVerify(accessToken, authorizationServerPublicKey)
                setHeader(protectedHeader);
                setPayload(new TextDecoder().decode(payload));
            }
        })();
    }, [authorizationServerPublicKey]);
    return (
        <section>
            <Columns>
                <div>
                    <Terminal title="Request an Access token">
                    <strong>POST</strong> <Light>/token HTTP/1.1</Light><br/>
                    <strong>Host:</strong> <Light>server.example.com</Light><br/>
                    <strong>Content-Type:</strong> <Light>application/x-www-form-urlencoded</Light><br/>
                    <Indent><strong>DPoP:</strong> <Light>{proof}</Light></Indent>
                    <strong>grant_type</strong>=<Light>authorization_code</Light><br/>
                    <strong>&code</strong>=<Light>{authorizationCode}</Light><br/>
                    <strong>&redirect_uri</strong>=<Light>{encodeURIComponent(APP_DOMAIN)}</Light><br/>
                    </Terminal>
                    <Terminal title="DPoP Protected Access Token"><JWT jwt={accessToken}/></Terminal>
                    <Terminal title="DPoP Protected Access Token decoded header">{JSON.stringify(header, null, 2)}</Terminal>
                </div>
                <div>
                    <h2><Num>5.</Num>Exchange the authorization code for an access token with the DPoP proof</h2>  
                    <h3>Attach the DPoP proof to the request using the DPoP header</h3>
                    <p>To request an access token that is bound to a public key using DPoP, the client must provide a valid DPoP proof JWT in a DPoP header when making an access token request to the authorization server<>&apos;</>s <Code>/token</Code> endpoint. This is applicable for all access token requests regardless of grant type (including, for example, the common <Code>authorization_code</Code> and <Code>refresh_token</Code> grant types but also extension grants such as the JWT authorization grant.</p>

                    <h3>Validate DPoP proof on the Authorization server</h3>
                    <p>The Auhtorization can validate that the DPoP proof found in the DPoP header has a valid signature, and is issued for the correct <Code>{AUTHORIZATION_SERVER}/token</Code> URI and <Code>POST</Code> HTTP method.</p>

                    <h3>Add the DPoP public key thumbrint to the Access Token</h3>
                    <p>When access tokens are represented as JSON Web Tokens, the DPoP proof<>&apos;</>s public key information should be represented using the <Code>jkt</Code> confirmation method member in the access tokens header..</p>
                    <p>To convey the hash of a public key in a JSON Web Token, the specification introduces the JSON Web Key Thumbprint <Code>jkt</Code> member under the confirmation <Code>cnf</Code> claim.</p>
                    <p>With the DPoP proof<>&apos;</>s public keys thumbprint available in the Access Token, we can validate subsequent DPoP proofs are issued by the same application that requested the Access Token.</p>

                    <h3>Use OAuths introspection to confirm the Public Key<>&apos;</>s thumbprint</h3>
                    <p>If your access token is not a JSON Web Token, you can use OAuth<>&apos;</>s introspection endpoint to get more metainformation about the token. When you query the introspection endpoint for a DPoP protected Access Token, it should also return that confirmatin <Code>cnf</Code> claim with the DPoP Proof<>&apos;</>s public key<>&apos;</>s thumbprint <Code>jkt</Code>.</p>
                    <Button disabled={activeStep !== 5} onClick={handleNext}>Now you can use your DPoP Access Token</Button>
                </div>
            </Columns>
        </section>        
    )
}

export default Step5

