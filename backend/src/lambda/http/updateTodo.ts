import 'source-map-support/register'
import { updateTodoItem } from '../../service/todoService'
import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getJwtToken } from '../../auth/utils'

const logger = createLogger('Update Todo');
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info(`Update Todo Item- ${updatedTodo}`);
  const jwtToken = getJwtToken(event)
  // update todo item from business logic layer: 
  await updateTodoItem(jwtToken, todoId, updatedTodo)

  return {
      statusCode: 200, 
      body: 'Sucessfully updated!'
  }
});

handler.use(
  cors({ credentials: true})
)