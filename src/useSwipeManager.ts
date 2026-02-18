import { useCallback, useMemo, useState } from "react";
import type { Direction, SwipeItem } from "./SwipeDeck";

export type SwipeManagerState<T extends SwipeItem> = {
  deck: T[];
  liked: T[];
  disliked: T[];
  onSwipe: (dir: Direction, item: T) => void;
  reset: () => void;
};

export function useSwipeManager<T extends SwipeItem>(initialCards: T[]): SwipeManagerState<T> {
  const initial = useMemo(() => initialCards, [initialCards]);

  const [deck, setDeck] = useState<T[]>(initial);
  const [liked, setLiked] = useState<T[]>([]);
  const [disliked, setDisliked] = useState<T[]>([]);

  const reset = useCallback(() => {
    setDeck(initial);
    setLiked([]);
    setDisliked([]);
  }, [initial]);

  const onSwipe = useCallback((dir: Direction, item: T) => {
    console.log("TODO handle swipe:", dir, item);

    // 1) Remove the swiped card from the deck (optimistic update)
    setDeck(prevDeck => prevDeck.filter(card => card.id !== item.id))
    // 2) Add it to liked/disliked depending on dir
    // 3) Ensure this is safe if multiple swipes happen quickly (avoid stale state)
    if (dir === 'left') setDisliked(prev => [...prev, item])
    else setLiked(prev => [...prev, item])
    // 4) When deck becomes empty, it should remain [] (SwipeDeck will show empty UI)
    setDeck(prevDeck => {
      if (prevDeck.length < 1) return [];
      return prevDeck.filter(card => card.id !== item.id);
    });
  }, []);

  return { deck, liked, disliked, onSwipe, reset };
}
