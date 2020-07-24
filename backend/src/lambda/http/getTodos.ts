import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getJwtToken } from '../../auth/utils'
import { getTodoList } from '../../service/todoService'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTodo')
export const handler=middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Get all todo items for current user')
  const token= getJwtToken(event)
  const todoList = await getTodoList(token); 

  logger.info(`List of item: ${todoList}`);

  return {
        statusCode: 200,
        body: JSON.stringify({
            items: todoList
        })
  }
  
});

handler.use(
  cors({ credentials: true})
)
