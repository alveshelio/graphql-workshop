// Demo user data
const users = [
  {
    id: '1',
    name: 'Helio Alves',
    email: 'heliosjalves@gmail.com',
    age: 42,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@gmail.com',
  },
  {
    id: '3',
    name: 'John',
    email: 'john@gmail.com',
  },
]

const posts = [
  {
    id: 'NY57XJ22',
    title: 'This is my great post',
    body: 'A great post body',
    published: true,
    author: '1',
    comments: ['1', '3'],
  },
  {
    id: 'NY57XJ11',
    title: 'This is my second post',
    body: 'A great second body post',
    published: true,
    author: '1',
    comments: ['2'],
  },
  {
    id: 'NY32BB54',
    title: 'This is my third post',
    body: 'My 3rd body post',
    published: true,
    author: '2',
    comments: ['3'],
  },
  {
    id: 'AA12XJ00',
    title: 'This is a draft post',
    body: 'Some gibberish body post',
    published: false,
    author: '3',
    comments: [],
  },
]

const comments = [
  {
    id: '1',
    text: 'Great comment for a great article',
    author: '1',
    post: 'NY57XJ22',
  },
  {
    id: '2',
    text: 'Comment 1 for the second article',
    author: '2',
    post: 'NY57XJ11',
  },
  {
    id: '3',
    text: 'Yet another comment for a great article',
    author: '1',
    post: 'NY57XJ22',
  },
  {
    id: '4',
    text: 'A comment for the 3rd article',
    author: '3',
    post: 'NY32BB54',
  },
]

const db = {
  users,
  posts,
  comments,
}
export default db
