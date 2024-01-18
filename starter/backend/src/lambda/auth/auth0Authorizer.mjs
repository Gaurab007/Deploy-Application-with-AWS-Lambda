import Axios from 'axios'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJFgw5yZvpDJylMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi14eWJ2bzF0N2I0NTV4dnkxLnVzLmF1dGgwLmNvbTAeFw0yNDAxMTMy
MDQwMjlaFw0zNzA5MjEyMDQwMjlaMCwxKjAoBgNVBAMTIWRldi14eWJ2bzF0N2I0
NTV4dnkxLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJxiXkhWqn59oml0ydEmVR1+W/Z7+L+N+BpnkxHe+jCXte9JtL5iqWJn+IUn
0drDIeywPA2KI2L8y/YgYSj+6DOjQ/ji5bYFdPok4RjvxKoYiW2dVD08qh77z1Xi
7/0Gv0MXbRPzW22V18HQfIxoF1QUV6XNsaYAG34AMVFQBpDcrffCn1Yc2vTXSr1l
8fqf2tLAaDGnHkW+nj+jbp8X1nGlTcc4+8hX+xs8auP8Cy9wTV+EDHBdNYH6uy0T
qeQvSJ7uORS159vBLDhoQCbtjcijtHnFOOQQ48fCCZN3OfxWdd2KXPCVkmVGaFqI
irDzYvzaSi2yRqVE8tv4TN+8dfsCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUCHpE1WOsqngX9TeeV6zTx2cy65YwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQB0eN+tna6bOJWQ18U1EfXCNyDkT4D7n1QsuEneKOgG
xqmLoSYalN2738gGrR7NXJevjMdSZhJIserP1PIXWyBSj3bJUSIqwdEgyA5XaUHB
PtuylEbOVYorAMgkARj1EUvXj+2AHk0yiukgxGrLj9AOdXU7G2stGNnWm3rPxgLu
TkKAcjca5SzwLgYcUD+p3BgWu3+/7lkF4un74bQqPc1zb2icHUmeRsNG3btMoOnz
QxSfp7sfGFLq4u4lXxg9FucZ1ZojE/lwl9p2Oy6m+AJE/ehC6WjK5L4L71V6XMR1
sf0M3i+GB6MZTQjTdQWFYLRJOjgdyga+eA4Dmnyp4Ccl
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  // const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  const jwt = verify(token, certificate, { algorithms: ['RS256'] })
  return jwt;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
