import { getUserId } from '../utils.mjs'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos.mjs'
import * as uuid from 'uuid'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const attachmentId = uuid.v4()

  const uploadUrl = await generateUploadUrl(attachmentId)

  logger.info('generateUpload', {
    todoId: todoId,
    userId: userId,
    attachmentId: attachmentId,
    uploadUrl: uploadUrl
  })

  await updateAttachmentUrl(userId, todoId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}

