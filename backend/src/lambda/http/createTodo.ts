import 'source-map-support/register'

import { APIGatewayProxyEvent,  APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'
import { getJwtToken } from '../../auth/utils'
import { createTodo } from '../../businessLogic/todoService'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTodo')
export const handler=middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info(`Creating new todo item- ${newTodo}`)
  
  const jwtToken = getJwtToken(event)
  const newItem = await createTodo(newTodo, jwtToken)
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
});

handler.use(
  cors({ credentials: true})
)