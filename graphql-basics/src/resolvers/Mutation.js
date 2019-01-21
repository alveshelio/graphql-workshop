import uuidv4 from 'uuid/v4'

import { COMMENT, CREATED, DELETED, POST, PUBLISHED, UNPUBLISHED, USER } from '../constants'

export default {
  createUser: (parent, { data }, { db }, info) => {
    const { email, name, age } = data
    const emailTaken = db.users.some(user => user.email === email)
    if (emailTaken) {
      throw new Error('Email taken.')
    }
    const user = { id: uuidv4(), name, email, age }
    db.users.push(user)

    return user
  },
  deleteUser: (parent, { id }, { db }, info) => {
    const userFound = db.users.find(user => user.id === id)
    if (!userFound) {
      throw new Error('User not found')
    }
    db.users = db.users.filter(user => user.id !== userFound.id)

    const postFound = db.posts.find(post => post.author === id)
    if (postFound) {
      db.posts = db.posts.filter(post => post.id !== postFound.id)
    }

    const commentFound = db.comments.find(comment => comment.author === id)
    if (commentFound) {
      db.comments = db.comments.filter(comment => comment.id !== commentFound.id)
    }

    return userFound
  },
  updateUser: (parent, { id, data: { name, email, age } }, { db }, info) => {
    const userFound = db.users.find(user => user.id === id)

    if (!userFound) {
      throw new Error('User not found!')
    }

    if (email) {
      const emailTaken = db.users.some(user => user.email === email)

      if (emailTaken) {
        throw new Error('This email is already taken, please use another email')
      }

      userFound.email = email
    }

    if (name) {
      userFound.name = name
    }

    if (age) {
      userFound.age = age
    }
  },
  createPost: (parent, { data }, { db, pubsub }, info) => {
    const { title, body, author, published } = data
    const userExists = db.users.some(user => user.id === author)
    if (!userExists) {
      throw new Error('The user does not exists')
    }
    const post = { id: uuidv4(), title, body, published, author, comments: [] }
    db.posts.push(post)

    if (post.published) {
      pubsub.publish(POST, {
        post: {
          mutation: CREATED,
          data: post,
          status: post.published ? PUBLISHED : UNPUBLISHED,
        },
      })
    }

    return post
  },
  deletePost: (parent, { title }, { db, pubsub }, info) => {
    const postFound = db.posts.find(post => post.title.toLowerCase() === title.toLowerCase())

    if (!postFound) {
      throw new Error('Post not found')
    }
    db.posts = db.posts.filter(post => post.id !== postFound.id)

    pubsub.publish(POST, {
      post: {
        mutation: DELETED,
        data: postFound,
        status: null,
      },
    })

    const commentsFound = db.comments.filter(comment => postFound.comments.includes(comment.id))

    if (commentsFound.length) {
      db.comments = db.comments.filter(comment => !postFound.comments.includes(comment.id))
    }

    return postFound
  },
  updatePost: (parent, { id, data: { title, body, author, published } }, { db, pubsub }, info) => {
    const postFound = db.posts.find(post => post.id === id)
    const authorFound = db.users.find(user => user.id === author)

    const originalPost = { ...postFound }

    if (!postFound) {
      throw new Error('Post not found')
    }

    if (title) {
      postFound.title = title
    }

    if (body) {
      postFound.body = body
    }

    if (typeof published === 'boolean') {
      postFound.published = published
    }

    if (!authorFound) {
      throw new Error('Author not found')
    }

    if (author && authorFound) {
      postFound.author = author
    }

    return postFound
  },
  createComment: (parent, { data }, { db, pubsub }, info) => {
    const { text, author, post } = data
    const authorExists = db.users.find(user => user.id === author)
    const postExists = db.posts.find(p => p.id === post && p.published)

    if (!authorExists) {
      throw new Error('This author does not exists')
    }

    if (!postExists) {
      throw new Error('This post does not exists')
    }

    const comment = { id: uuidv4(), text, author, post }
    db.comments.push(comment)

    pubsub.publish(`${COMMENT} ${post}`, { comment })
    return comment
  },
  deleteComment: (parent, { text }, { db }, info) => {
    const commentFound = db.comments.find(
      comment => comment.text.toLowerCase() === text.toLowerCase()
    )

    if (!commentFound) {
      throw new Error('Comment not found')
    }

    const postIndex = db.posts.findIndex(post => post.id === commentFound.post)
    db.posts[postIndex].comments.filter(comment => {
      return comment !== commentFound.id
    })
    return commentFound
  },
  togglePublishedOnPost: (parent, { postId }, { db }, info) => {
    const postExists = db.posts.some(post => post.id === postId)

    if (!postExists) {
      throw new Error('This post does not exists')
    }

    db.posts.forEach(post => {
      if (post.id === postId) {
        post.published = !post.published
      }
      return post
    })

    return db.posts.find(post => post.id === postId)
  },
}
