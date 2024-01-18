import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { AWSXRay  } from 'aws-xray-sdk-core'

export class TodosDB {

    constructor() {
      this.docClient = DynamoDBDocument.from(AWSXRay.captureAWSv3Client(new DynamoDB())),
      this.todosTable = process.env.TODOS_TABLE,
      this.todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
    }
  
  
    async getTodoItems(userId) {  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      });
  
      console.log('result', result);
      const items = result.Items;
    
      return items
    }

    async createTodo(todoItem) {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem
      });

      return todoItem;
    }

    async getTodoItem(todoId) {
      const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {
          todoId
        }
      });
  
      return result.Item;
    }


    async updateTodoItem(userId, todoId, todoUpdate) {
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          "#name": "name"
        },
        ExpressionAttributeValues: {
          ":name": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done
        }
      })
    }

    async deleteTodoItem(userId, todoId) {  
      await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
    }

    async updateAttachmentUrl(userId, todoId, attachmentUrl) {  
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
    }
}