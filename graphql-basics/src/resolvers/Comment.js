export default {
  // argument (parent) is each comment in comments array
  author: (parent, args, { db }, info) => db.users.find(user => user.id === parent.author),
  post: (parent, args, { db }, info) => db.posts.find(post => post.id === parent.post),
}
