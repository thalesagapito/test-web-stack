import IPData from 'ipdata'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async(event) => {
  const { Parameters } = await (new AWS.SSM())
    .getParameters({
      Names: ['IP_DATA_API_KEY'].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise()
  const ipDataApiKey = Parameters[0].Value as string

  const ipData = new IPData(ipDataApiKey)

  const userIp = event.requestContext.identity.sourceIp
  const lookupResult = await ipData.lookup(userIp, null, ['city', 'region'])

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(lookupResult),
  }
  return response
}
