import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = async (event) => {
  logger.info('createTodo event', event);
  const newTodo = JSON.parse(event.body);
  const userId = getUserId(event);
  logger.info('createTodo userId', userId);
  const newItem = await createTodo(userId, newTodo);
  logger.info('createTodo newitem', newItem);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}

