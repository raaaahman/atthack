import { Avatar } from "@/components/Avatar";
import { PLAYER_ID } from "@/constants";
import Social from "@/types/Social";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/social/")({
  loader: async ({ context }) => {
    const response = await fetch("/social.json");
    const data: Social = await response.json();

    return data.users
      .filter(
        (user) => user.id === PLAYER_ID || user.friends.includes(PLAYER_ID)
      )
      .flatMap((user) =>
        user.posts.map((post) => ({
          ...post,
          userId: user.id,
          username: user.name,
          useravatar: user.avatar,
          date: new Date(parseInt(post.timestamp.toString())),
          comments: post.comments.map((comment) => ({
            ...comment,
            date: new Date(parseInt(comment.timestamp.toString())),
          })),
        }))
      )
      .filter((post) =>
        post.conditions.reduce(
          (final, condition) =>
            final &&
            new Function(
              '"use strict"; const [ visited ] = arguments; return (' +
                condition +
                ")"
            )(
              (nodeName: string) =>
                !!context.dialogue?.history.find(
                  (node) => node.metadata.title === nodeName
                )
            ),
          true
        )
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const posts = useLoaderData({ from: "/social/" });

  return (
    <>
      <header className="fixed w-full z-[5] h-16 p-2 bg-base-100 flex justify-between md:justify-center items-center">
        <Link to="/" className="block md:hidden">
          <span className="sr-only">Back Home</span>
          <ChevronLeftIcon
            title="Back Home"
            role="presentation"
            className="btn btn-circle bg-base-100 border-base-300"
          />
        </Link>
        <h1 className="text-2xl font-bold text-center p-2 shadow-sm">
          Your Feed
        </h1>
        <div className="w-12 md:hidden" />
      </header>
      <main className="bg-neutral-300 px-4 flex-grow mt-16">
        {posts.length === 0 ? (
          <div className="container mx-auto h-full flex flex-col justify-center">
            <p className="text-center">No activity.</p>
          </div>
        ) : (
          <ul className="container mx-auto h-full">
            {posts.map((post) => {
              return (
                <li
                  key={`${post.userId}-${post.timestamp}`}
                  className="card bg-base-100 w-full shadow-sm my-4"
                >
                  {post.imageSource ? (
                    <figure className="bg-base-200">
                      <img
                        src={"/images/" + post.imageSource}
                        alt={post.imageDescription}
                        className="block max-h-96 mx-auto"
                      />
                    </figure>
                  ) : null}
                  <div className="card-body">
                    <Details {...post} />

                    <p>{post.content}</p>
                    <div
                      tabIndex={0}
                      className="collapse collapse-arrow bg-base-100, border-base-300 border"
                    >
                      <input type="checkbox" />
                      <p className="collapse-title">
                        {post.comments.length} comment
                        {post.comments.length === 0 || post.comments.length > 1
                          ? "s"
                          : ""}
                      </p>
                      <ul className="collapse-content">
                        {post.comments.map((comment) => (
                          <li>
                            <Details {...comment} />
                            <p>{comment.content}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}

type DetailsProps = {
  userId: string;
  username: string;
  date: Date;
};

function Details({ userId, username, date }: DetailsProps) {
  return (
    <div className="flex items-center">
      <Avatar
        characterId={userId}
        className={userId === PLAYER_ID ? "-scale-x-100" : ""}
      />
      <div>
        <span className="block font-bold">{username}</span>
        <time dateTime={date.toISOString()} className="block text-sm">
          {date.toLocaleDateString("en-us", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            hourCycle: "h11",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  );
}
