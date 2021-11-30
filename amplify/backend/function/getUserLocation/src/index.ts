import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async(event) => {
  // TODO implement
  // console.log(event)

  const userIp = event.requestContext.identity.sourceIp

  const { Parameters } = await (new AWS.SSM())
    .getParameters({
      Names: ['IP_DATA_API_KEY'].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise()
  const ipDataApiKey = Parameters[0].Value as string

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(`Hello from Lambda! ${ipDataApiKey}, ${userIp}`),
  }
  return response
}
