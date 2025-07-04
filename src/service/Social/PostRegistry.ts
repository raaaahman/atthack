import Social, { Post, User } from "@/types/Social";
import { DialogueRunner } from "../DialogueRunner";

export class PostRegistry {
  private data?: Social;
  private logger: Console;

  constructor(public dialogue: DialogueRunner) {
    this.logger = window.console;
  }

  async init() {
    try {
      const response = await fetch("/social.json");
      this.data = await response.json();
    } catch (error) {
      if (this.logger && error instanceof Error) this.logger.log(error.message);
    }
  }

  validate(post: Post) {
    return post.conditions.reduce(
      (final, condition) =>
        final &&
        new Function(
          '"use strict"; const [ visited ] = arguments; return (' +
            condition +
            ")"
        )(
          (nodeName: string) =>
            !!this.dialogue.history.find(
              (node) => node.metadata.title === nodeName
            )
        ),
      true
    );
  }

  async all() {
    if (!this.data) await this.init();

    return this.data?.users.flatMap((user) => user.posts);
  }

  async findByUserId(id: string) {
    if (!this.data) await this.init();

    const user = this.data?.users.find((user) => user.id === id);

    return user ? user.posts.map((post) => this.formatPost(post, user)) : [];
  }

  private formatPost(post: Post, user: User) {
    return {
      ...post,
      userId: user.id,
      username: user.name,
      useravatar: user.avatar,
      date: new Date(parseInt(post.timestamp.toString())),
      comments: post.comments.map((comment) => ({
        ...comment,
        date: new Date(parseInt(comment.timestamp.toString())),
      })),
    };
  }

  async findByFriends(id: string) {
    if (!this.data) await this.init();

    const users = this.data?.users.filter(
      (user) => user.id === id || user.friends.includes(id)
    );

    return users
      ? (
          await Promise.all(users.map((user) => this.findByUserId(user.id)))
        ).flat()
      : [];
  }
}
