import { COMMENT, POST } from '../constants'

export default {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postFound = db.posts.find(post => post.id === postId && post.published)

      if (!postFound) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`${COMMENT} ${postId}`)
    },
  },
  post: {
    subscribe: (parent, args, { db, pubsub }, info) => pubsub.asyncIterator(POST),
  },
}
