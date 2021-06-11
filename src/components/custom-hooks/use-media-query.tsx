import * as React from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window?.matchMedia && window.matchMedia(query);
    if (media?.matches !== matches) {
      setMatches(media?.matches);
    }
    const listener = () => {
      setMatches(media?.matches);
    };
    media?.addListener(listener);
    return () => media?.removeListener(listener);
  }, [matches, query]);

  return matches;
}
