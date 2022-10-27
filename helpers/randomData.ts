const allowedCharacters: string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function getRandomInt(min: number, max: number): number {       
    const byteArray: Uint8Array = new Uint8Array(1);
    self.crypto.getRandomValues(byteArray);

    const range: number = max - min + 1;
    const maxRange: number = 256;
    
    if (byteArray[0] >= Math.floor(maxRange / range) * range) {
        return getRandomInt(min, max);
    }

    return min + (byteArray[0] % range);
}

export function getRandomString(length: number = 24): string {
    const min: number = 0;
    const max = allowedCharacters.length;

    let result: string = '';
    let i = 0;
    for(; i < length; i++) {
        result += allowedCharacters[getRandomInt(min, max)];
    }

    return result;
}

export function getAuthorizationCode(): string {
    return getRandomString();
}

export function getJTI(): string {
    return getRandomString(40);
}

export function getSub(): string {
    return getRandomString(10);
}

export function getClientId(): string {
    return getRandomString(10);
}

