import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUploadUrl } from '../../service/todoService'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info(`Generating s3 signed url for upload - ${todoId}`)
  // get the pre-signed url from S3 by todoId:
  const url = getUploadUrl(todoId);   

  return {
      statusCode: 200,
      body: JSON.stringify({
          uploadUrl: url, 
      })
  }
});

handler.use(
  cors({ credentials: true})
)
