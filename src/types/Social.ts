type Social = {
  users: Array<User>;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  posts: Array<Post>;
  friends: Array<User["id"]>;
};

export type Post = {
  userId: User["id"];
  username: User["name"];
  useravatar: User["avatar"];
  imageSource: string;
  imageDescription: string;
  content: string;
  comments: Array<Comment>;
  timestamp: number;
  likes: Array<User["id"]>;
  conditions: Array<string>;
};

export type Comment = {
  userId: User["id"];
  useravatar: User["avatar"];
  username: User["name"];
  content: string;
  timestamp: number;
  likes: Array<User["id"]>;
};

export default Social;
