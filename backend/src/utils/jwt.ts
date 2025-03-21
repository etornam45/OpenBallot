import {verify, sign} from "jsonwebtoken"

export function Sign(data: any, secret: string): string {
    return sign(data, secret);
}

