export default {
  // argument (parent) is each user in the users array
  posts: (parent, args, { db }, info) => db.posts.filter(post => post.author === parent.id),
  comments: (parent, args, { db }, info) =>
    db.comments.filter(comment => comment.author === parent.id),
}
