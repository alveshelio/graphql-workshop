import { COMMENT } from '../constants'

export default {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0

      setInterval(() => {
        count++
        pubsub.publish('count', { count })
      }, 1000)
      return pubsub.asyncIterator('count') // asyncIterator takes a channel
    },
  },
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postFound = db.posts.find(post => post.id === postId && post.published)

      if (!postFound) {
        throw new Error('Post not found')
      }

      return pubsub.asyncIterator(`${COMMENT} ${postId}`)
    },
  },
}
