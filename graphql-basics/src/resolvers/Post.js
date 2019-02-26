export default {
  // argument (parent) is each sing post in the posts array
  author: (parent, args, { db }, info) => db.users.find(user => user.id === parent.author),
  comments: (parent, args, { db }, info) =>
    db.comments.filter(comment => comment.post === parent.id),
}
