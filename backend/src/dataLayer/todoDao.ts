import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import { TodoUpdate } from '../models/TodoUpdate'
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

const logger = createLogger('todoDao')
const bucketName= process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
export class TodoDao {

    constructor(
      // document client work with DynamoDB locally: 
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      // name of table to store /groups
      private readonly todosTable = process.env.TODO_TABLE,
      private readonly indexTable = process.env.USER_ID_INDEX
    ) {}

    // get todos list based on userId
    // todo list is an array so return TodoItem[]
    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info(`Fetching todo item from user ${userId}`);

        // use query() instead of scan(): 
        const result = await this.docClient.query({
            TableName: this.todosTable, 
            IndexName: this.indexTable, 
            KeyConditionExpression: 'userId = :userId', 
            ExpressionAttributeValues: { ':userId': userId },
            ScanIndexForward: false 
        }).promise()

        // return todos as array of objects
        const todos = result.Items;
        return todos as TodoItem[]
    }
    
    // insert new item into Todos talbe:
    // match with TodoItem model:  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info(`todoDao: Saving new ${todo.name} into ${this.todosTable}`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo as TodoItem
    }

    // update todo item based on userId and todoId
    async updateTodo(userId: string, todoId: string, todoItem: TodoUpdate) {
        logger.info(`Update todo with name ${todoItem.name} of user ${userId}`);

        await this.docClient.update({
            TableName: this.todosTable, 
            // Update with key: 
            Key: {
                userId, 
                todoId, 
            }, 
            UpdateExpression: 
                'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeValues: {
                ':name': todoItem.name,
                ':dueDate': todoItem.dueDate, 
                ':done': todoItem.done
            }, 
            ExpressionAttributeNames: {
                '#name': 'name', 
                '#dueDate': 'dueDate', 
                '#done': 'done'
            }
        }).promise()
    }

    // delete todo item created by userId with todoId: 
    async deleteTodo(userId: string, todoId: string) {
        logger.info(`Delete item with id ${todoId}`); 

        await this.docClient.delete({
            TableName: this.todosTable, 
            // delete based on Key: userId and todoId: 
            Key: { "userId": userId, "todoId": todoId }
        }).promise()
    }

    getUploadUrl(todoId: string){
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId, 
            Expires: urlExpiration
        })
    }
}