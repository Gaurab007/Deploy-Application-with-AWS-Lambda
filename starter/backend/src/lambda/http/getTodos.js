import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = async (event) => {
  // TODO: Get all TODO items for a current user
  logger.info('getTodos Event: ', event);
  const userId = getUserId(event);
  logger.info('getTodos userid', userId);
  const items = await getTodos(userId);
  logger.info('getTodos items', items);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
