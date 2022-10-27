import * as jose from 'jose'
import { AUTHORIZATION_SERVER, API_SERVER } from './constants'
import { getClientId, getJTI, getSub } from './randomData'

export async function getAccessToken(DPoPPublicKeyThumbprint: string, authorizationServerKeyPair: jose.GenerateKeyPairResult, clientId: string): Promise<string> {
    return new jose.SignJWT({
        "client_id": clientId,
        "scope": "openid profile"
    })
    .setProtectedHeader({ 
        "alg": "ES256", 
        "typ": "at+JWT",
        "cnf": {
            "jkt": DPoPPublicKeyThumbprint
        }
    })
    .setSubject(getSub())
    .setIssuedAt()
    .setIssuer(AUTHORIZATION_SERVER)
    .setAudience(API_SERVER)
    .setExpirationTime('2h')
    .setJti(getJTI())
    .sign(authorizationServerKeyPair?.privateKey);
}