import fetch from 'node-fetch'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

async function getUserInfoFromIpData(ip: string, apiKey: string) {
  const response = await fetch(`https://api.ipdata.co/${ip}?api-key=${apiKey}`)
  const userDataFromIp = await response.json()
  return userDataFromIp
}

export const handler: APIGatewayProxyHandler = async(event) => {
  const { Parameters } = await (new AWS.SSM())
    .getParameters({
      Names: ['IP_DATA_API_KEY'].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise()
  const ipDataApiKey = Parameters[0].Value as string

  const userIp = event.requestContext.identity.sourceIp
  const userDataFromIp = await getUserInfoFromIpData(userIp, ipDataApiKey)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(userDataFromIp),
  }
  return response
}
