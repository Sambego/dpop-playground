import { FC, FormEventHandler, useState, useEffect } from 'react'
import Columns from '../columns'
import Terminal from '../Terminal'
import * as jose from 'jose'
import Button from '../button'
import JWT from '../jwt'
import Code from '../code'
import Num from '../number'
import { KeyPair } from 'dpop'

type Step4Props = {
    proof: string,
    DPoPPublicKey: jose.KeyLike,
    handleNext: FormEventHandler,
    activeStep: number,
}

const Step4: FC<Step4Props> = ({proof, DPoPPublicKey, handleNext, activeStep}) => {
    const [header, setHeader] = useState<jose.CompactJWSHeaderParameters>();
    const [payload, setPayload] = useState<string>('{}');

    useEffect(() => {
        (async () => {
            if (DPoPPublicKey) {
                const publicKeyJWK = await jose.exportJWK(DPoPPublicKey);
                const { payload, protectedHeader } = await jose.compactVerify(proof, await jose.importJWK(publicKeyJWK, 'ES256'))
                setHeader(protectedHeader);
                setPayload(new TextDecoder().decode(payload));
            }
        })();
    }, [DPoPPublicKey]);
    
    return (
        <section>
            <Columns>
                <div>
                    <h2><Num>4.</Num>Create a DPoP proof</h2>  
                    {/* <code><pre>proof: {proof}</pre></code> */}
                    <p>DPoP introduces the concept of a DPoP proof, which is a JSON Web Token (JWT) created by the client and sent with an HTTP request using the DPoP header field. Each HTTP request requires a unique DPoP proof.</p>
                    <p>A valid DPoP proof demonstrates to the server that the client holds the private key that was used to sign the DPoP proof JWT. This enables authorization servers to bind issued tokens to the corresponding public key and for resource servers to verify the key-binding of tokens that it receives, which prevents said tokens from being used by any entity that does not have access to the private key.</p>
                    <p>The DPoP proof demonstrates possession of a key and, by itself, is not an authentication or access control mechanism.</p>
                    
                    <h3>The DPoP JWT header</h3>
                    <p>The decoded header of our DPoP proof JSON Web token contain a few usefull pieces of information.</p>
                    <ul>
                        <li><strong>The algorithm (alg)</strong> let<>&apos;</>s us know which digital signing algorithm has been used to sign the JWT.</li>
                        <li><strong>The type (typ)</strong> tells us we<>&apos;</>re dealing with a JWT that can be used as a DPoP proof (<Code>dpop+jwt</Code>).</li>
                        <li><strong>The JSON Web Key (jwk)</strong> provides us with the public key we can use to validate the signature.</li>
                    </ul>

                    <h3>The DPoP JWT payload</h3>
                    <p>If we take a look at the decoded payload, we can see more about the request this proof was intended for.</p>
                    <ul>
                        <li><strong>The issued at timestamp (iat)</strong> is a standard JSON Web Token claim that tells us what time the token has been created.</li>
                        <li><strong>The JWT ID (jti)</strong>  claim provides a unique identifier for the JWT.</li>
                        <li><strong>The HTTP Method (htm)</strong> states which HTTP method can be used with this proof.</li>
                        <li><strong>The HTTP Request URI (htu)</strong> let<>&apos;</>s is know which URI we can request with this DPoP proof.</li>
                    </ul>

                    <Button disabled={activeStep !== 4} onClick={handleNext}>It<>&apos;</>s time to request an Access Token</Button>
                </div>
                <div>
                    <Terminal title="DPoP Proof JWT"><JWT jwt={proof}/></Terminal>
                    <Terminal title="Decoded DPoP Proof header">{JSON.stringify(header, null, 2)}</Terminal>
                    <Terminal title="Decoded DPoP Proof payload">{JSON.stringify(JSON.parse(payload), null, 2)}</Terminal>
                </div>
            </Columns>
        </section>        
    )
}

export default Step4

