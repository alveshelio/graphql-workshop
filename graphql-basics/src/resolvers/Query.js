const Query = {
  // all resolvers receive 4 arguments:
  // parent => used when working with relational data base
  // args => contains the operation information in our case (name)
  // context => useful for contextual data. For example, if a user is logged in, it contains the
  // information of the user
  // info => contains information about the operations sent to the server

  users(parent, { query }, { db }, info) {
    console.log('query', query)
    console.log('db.users', db.users)
    return query
      ? db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
      : db.users
  },
  me() {
    return {
      id: '12GY98XX37AK',
      name: 'Helio Alves',
      email: 'heliosjalves@gmail.com',
      age: 42,
    }
  },
  post() {
    return {
      id: 'NY57XJ22',
      title: 'This is my great post',
      body: 'A great post body',
      published: true,
    }
  },
  posts(parent, { query, published }, { db }, info) {
    const findInPost = (post, findBy) => {
      const isTitleMatch = post.title.toLowerCase().includes(findBy.toLowerCase())
      const isBodyMatch = post.body.toLowerCase().includes(findBy.toLowerCase())

      return isTitleMatch || isBodyMatch
    }
    if (query && published !== undefined) {
      return db.posts.filter(post => findInPost(post, query) && post.published === published)
    } else if (query) {
      return db.posts.filter(post => findInPost(post, query))
    } else if (published !== undefined) {
      return db.posts.filter(post => post.published === published)
    } else {
      return db.posts
    }
  },
  comments(parent, args, { db }, info) {
    return db.comments
  },
}

export default Query
