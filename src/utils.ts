export function screenName(pathname: string) {
  const [match, path, params] = pathname.match(/^\/?(.*)\/(\w+)\/?$/) || [];

  if (!match) return undefined;

  switch (path) {
    case "contacts":
      return params ? "conversation_" + params : undefined;
    case "ai":
      return params ? "ai_" + params : undefined;
    default:
      return "home";
  }
}

export function pathname(screen: string) {
  const [match, route, resource] =
    screen.match(/([A-Za-z]+)_?([A-Za-z]+)/) || [];

  if (!match) return undefined;

  switch (route) {
    case "conversation":
      return "/contacts/" + resource;
    case "ai":
      return "/ai/" + resource;
    default:
      return "/";
  }
}
