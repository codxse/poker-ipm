import * as jwt from 'jsonwebtoken'

export default class Jwt {
  static readonly _ALGORITHM_: jwt.Algorithm = 'HS512'

  static encode(payload: Record<'string', any> | {}, secret: string) {
    if (!payload['sub'] || !payload['id']) throw new Error("sub can't be null")

    const accessToken = jwt.sign(payload, secret, {
      algorithm: Jwt._ALGORITHM_,
    })

    return accessToken
  }

  static decode(accessToken: string, secret: string) {
    if (!accessToken) throw new Error("accessToken can't be null")

    const payload = jwt.verify(accessToken, secret, {
      algorithms: [Jwt._ALGORITHM_],
      complete: false,
    })

    return payload
  }
}
