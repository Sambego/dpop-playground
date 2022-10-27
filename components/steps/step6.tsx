import DPoP, { KeyPair } from 'dpop'
import { FC, FormEventHandler, useState, useEffect } from 'react'
import Code from '../code'
import Columns from '../columns'
import Termminal from '../Terminal'
import { API_SERVER } from '../../helpers/constants'
import { getDPoPPublicKeyThumbprint } from '../../helpers/dpop';
import Light from '../light'
import Indent from '../indent'
import Num from '../number'

type Step6Props = {
    DPoPKeyPair: KeyPair | undefined,
    accessToken: string,
    handleNext: FormEventHandler,
    activeStep: number
}

const Step6: FC<Step6Props> = ({DPoPKeyPair, accessToken = '', handleNext}) => {
    // const [request, setRequest] = useState<string>('');
    const [DPoPProof, setDPoPProof] = useState<string>('');
        
    useEffect(() => {
        (async () => {
            if (DPoPKeyPair) {
                const accessTokenBuffer: Uint8Array = new TextEncoder().encode(accessToken);
                const hash:ArrayBuffer = await crypto.subtle.digest('SHA-256', accessTokenBuffer);
                const hashString: string = Buffer.from(hash).toString('base64');
                setDPoPProof(await DPoP(DPoPKeyPair, `${API_SERVER}/protected/endpoint`, 'GET', undefined, hashString));
            }
        })();
    }, [DPoPKeyPair])
    
    // useEffect(() => {
    //     if (accessToken && DPoPProof) {
    //         // @ts-ignore: Object is possibly 'null'.
    //         setRequest(`GET /protectedresource HTTP/1.1\nHost: ${API_SERVER}/protected/endpoint\nAuthorization: DPoP ${accessToken.match(/.{45}/g).join("\n  ")}\nDPoP: ${DPoPProof.match(/.{45}/g).join("\n  ")}`)
    //     }
    // }, [accessToken, DPoPProof])

    return (
        <section>
            <Columns>
                <div>
                    <h2><Num>6.</Num>Request protected API endopoints with a DPoP Protect Access token</h2>  
                    <p>To make a request to a protected API endpoint using our DPoP protected Acces token, we can attach is to the <Code>Authorization</Code> header, using the DPoP authentication scheme.</p>
                    <p>The request should also contain the DPoP header with a new DPoP proof. This DPoP proof must include an Access Token Hash (<Code>ath</Code>) claim with a valid hash of the associated Access Token.</p>

                    <h3>Compatibility with the Bearer authentication scheme</h3>
                    <p>Protected resources simultaneously supporting both the DPoP and Bearer schemes need to update how evaluation of bearer tokens is performed to prevent downgraded usage of a DPoP-bound access token. Specifically, such a protected resource MUST reject a DPoP-bound access token received as a bearer token.</p>
                </div>
                <Termminal title="API request with DPoP protected Access Token">
                    <strong>GET</strong> <Light>/protectedresource HTTP/1.1</Light><br/>
                    <strong>Host:</strong> <Light>${API_SERVER}/protected/endpoint</Light><br/>
                    {/*  @ts-ignore: Object is possibly 'null'. */}
                    <Indent><strong>Authorization:</strong> <Light>DPoP {accessToken}</Light></Indent>
                    {/*  @ts-ignore: Object is possibly 'null'. */}
                    <Indent><strong>DPoP:</strong> <Light>{DPoPProof ? DPoPProof : ''}</Light></Indent>
                </Termminal>
            </Columns>
        </section>        
    )
}

export default Step6
