import { useDrag } from '@use-gesture/react';
import '../../styles/CatCard.css'

interface CatCardProps {
  cat: {
    id: number;
    name: string;
    picture: string;
  },
}

export function CatCard({ cat }: CatCardProps) {

  const THRESHOLD = 500;
  const HIDE_PX = 2000;

  function handleCardMovement({ el, x, y, transition = false }: { el: HTMLElement, x: number, y: number, transition?: boolean }) {
    el.style.transition = transition ? 'transform 2s ease' : 'none';
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  const bind = useDrag(({ event, dragging, movement: [x, y] }) => {
    const el = event.currentTarget as HTMLElement;

    if (dragging) {
      handleCardMovement({ el, x, y });
      return;
    }

    if (x > THRESHOLD && !dragging) {
      handleCardMovement({ el, x: HIDE_PX, y: y, transition: true });
    } else if (x < -THRESHOLD && !dragging) {
      handleCardMovement({ el, x: -HIDE_PX, y: y, transition: true });
    } else {
      handleCardMovement({ el, x: 0, y: 0, transition: true });
    }

  }, { axis: 'x', 'filterTaps': true, enabled: true });

  return (
    <div
      id="cat-card-container"
      {...bind()}
    >
      <img draggable={false} src={cat.picture} alt={cat.name} style={{ display: 'block', width: '70%', height: '70%', borderRadius: "10px 10px 0 0", }} />
      <div style={{ position: "absolute", backgroundColor: "#FFF", bottom: 22, left: 22, padding: "4px 8px", borderRadius: "4px", width: '80%' }}>
        <p style={{ color: "#000", fontSize: "20px", margin: 0 }}>{cat.name}</p>
      </div>
    </div>
  )
}
