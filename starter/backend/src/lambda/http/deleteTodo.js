import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  logger.info('deleteTodo todoId', todoId);
  logger.info('deleteTodo userId', userId);

  await deleteTodo(userId, todoId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
