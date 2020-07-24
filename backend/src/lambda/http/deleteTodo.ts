import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {deleteTodoItem } from '../../service/todoService'
import { getJwtToken } from '../../auth/utils'

const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info(`Deleting TODO item with itemId - ${todoId}`)
  const token= getJwtToken(event)

  await deleteTodoItem(token, todoId); 
  return {
    statusCode: 200, 
    body: 'Sucessfully deleted!'
}

});

handler.use(
  cors({ credentials: true})
)
