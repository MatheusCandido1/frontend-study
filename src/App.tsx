import SwipeDeck from "./SwipeDeck";
import type { SwipeItem, Direction } from "./SwipeDeck";
import { useSwipeManager } from "./useSwipeManager";

type PersonCard = SwipeItem & { age: number };

const initialCards: PersonCard[] = [
  { id: 1, title: "Ava", subtitle: "Coffee • Hiking • Dogs", age: 26 },
  { id: 2, title: "Noah", subtitle: "Music • Food • Travel", age: 28 },
  { id: 3, title: "Mia", subtitle: "Art • Movies • Yoga", age: 24 },
];

export default function App() {
  const { deck, liked, disliked, onSwipe, reset } = useSwipeManager<PersonCard>(initialCards);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>Interview Round: Swipe Manager</h2>

      <SwipeDeck items={deck} onSwipe={onSwipe} />

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
        <button onClick={reset} style={{ padding: "8px 12px", borderRadius: 8 }}>
          Reset
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 16 }}>
        <div>
          <strong>Liked:</strong> {liked.map((c) => c.id).join(", ") || "—"}
        </div>
        <div>
          <strong>Disliked:</strong> {disliked.map((c) => c.id).join(", ") || "—"}
        </div>
      </div>
    </div>
  );
}
