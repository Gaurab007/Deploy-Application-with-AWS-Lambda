import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = getUserId(event)

  logger.info('updateTodo', {
    todoId: todoId,
    userId: userId,
    updatedTodo: updatedTodo
  })
  await updateTodo(userId, todoId, updatedTodo);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  }
}
