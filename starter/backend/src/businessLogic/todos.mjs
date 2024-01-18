import { TodosDB } from '../dataLayer/todosDB.mjs'
import { TodosS3 } from '../fileStorage/todosS3.mjs';
import * as uuid from 'uuid'

const todosDB = new TodosDB()
const todosS3 = new TodosS3()

export async function getTodos(userId) {
    return await todosDB.getTodoItems(userId);
}

export async function createTodo(userId, newTodo) {
    const todoId = uuid.v4();
    const dueDateTimestamp = Date.parse(newTodo.dueDate);

    const newItem = {
        userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: newTodo.name || 'New Todo',
        dueDate: new Date(dueDateTimestamp).toISOString(),
        done: false,
        attachmentUrl: 'default'
    };
    return await todosDB.createTodo(newItem);
}

export async function updateTodo(userId, todoId, updatedTodo) {
    await todosDB.updateTodoItem(userId, todoId, updatedTodo);
}

export async function deleteTodo(userId, todoId) {
    await todosDB.deleteTodoItem(userId, todoId)
}

export async function generateUploadUrl(attachmentId) {
    const uploadUrl = await todosS3.generateUploadUrl(attachmentId)
  
    return uploadUrl
}

export async function updateAttachmentUrl(userId, todoId, attachmentId) {
    const attachmentUrl = await todosS3.getAttachmentUrl(attachmentId)
    
    await todosDB.updateAttachmentUrl(userId, todoId, attachmentUrl)
  }