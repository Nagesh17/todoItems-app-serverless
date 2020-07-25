import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils' // get userId from jwt token
import { TodoDao } from '../dataLayer/todoDao'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const logger = createLogger('todoService')
const bucketName= process.env.TODO_S3_BUCKET

// initialize new object from TodoAccess class: 
const todoDao = new TodoDao()

// find todo list by userId from JwtToken
export async function getTodoList(jwtToken: string): Promise<TodoItem[]> {
    logger.info('TodoService: Processing Get todoList')
    const userId = parseUserId(jwtToken); 
    return todoDao.getTodos(userId);
}

// create todo with corresponding userId: 
export async function createTodo(
    newTodo: CreateTodoRequest, 
    jwtToken: string
): Promise<TodoItem> {

    const itemId = uuid.v4() // generate unique todo id: 
    const userId = parseUserId(jwtToken) // return userId

    logger.info(`Service: Create Todo for user ${userId}`)
    const imageUrl= `https://${bucketName}.s3.amazonaws.com/${itemId}`

    return await todoDao.createTodo({
        userId, 
        todoId: itemId,
        createdAt: new Date().toISOString(),
        done: false,
        ...newTodo, // name and dueDate
        attachmentUrl: imageUrl
    }) as TodoItem
}

// update todo Item with userId and todoId: 
export async function updateTodoItem(
    jwtToken: string, 
    todoId: string,
    updateTodoItem: UpdateTodoRequest,
) {
    await todoDao.updateTodo(parseUserId(jwtToken), todoId, updateTodoItem);
}

// delete todo item with userId and todoId:
export async function deleteTodoItem(
    jwtToken: string,
    todoId: string,
) {
    await todoDao.deleteTodo(parseUserId(jwtToken), todoId);
}

export function getUploadUrl(todoId: string){
    logger.info(`Generating s3 signed url for todoItemId - ${todoId}`)
    return todoDao.getUploadUrl(todoId)
}