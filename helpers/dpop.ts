import { KeyPair } from "dpop";
import * as jose from 'jose'

export async function getDPoPPublicKeyThumbprint(DPoPKeyPair: KeyPair | undefined): Promise<string> {
    if (DPoPKeyPair) {
        const DPoPPublicKeyJWK = await jose.exportJWK(DPoPKeyPair?.publicKey as jose.KeyLike);
    
        return await jose.calculateJwkThumbprint(DPoPPublicKeyJWK)
    }

    return '';
};