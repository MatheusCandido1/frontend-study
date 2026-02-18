import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export type SwipeItem = {
  id: string | number;
  title: string;
  subtitle?: string;
};

export type Direction = "left" | "right";

export type SwipeDeckProps<T extends SwipeItem> = {
  items: T[];
  onSwipe: (dir: Direction, item: T) => void;
  swipeThreshold?: number;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export default function SwipeDeck<T extends SwipeItem>({
  items,
  onSwipe,
  swipeThreshold = 120,
}: SwipeDeckProps<T>) {
  const topCardRef = useRef<HTMLDivElement | null>(null);
  const likeRef = useRef<HTMLDivElement | null>(null);
  const nopeRef = useRef<HTMLDivElement | null>(null);

  const remaining = useMemo(() => items, [items]);
  const topItem = remaining[0];

  useEffect(() => {
    const el = topCardRef.current;
    if (!el || !topItem) return;

    gsap.set([likeRef.current, nopeRef.current], { autoAlpha: 0 });
    Draggable.get(el)?.kill();

    const draggable = Draggable.create(el, {
      type: "x,y",
      inertia: true,
      onDrag: function () {
        const x = this.x as number;
        const rot = clamp(x / 12, -18, 18);
        gsap.set(el, { rotation: rot, transformOrigin: "50% 80%" });

        const strength = clamp(Math.abs(x) / swipeThreshold, 0, 1);
        if (x > 0) {
          if (likeRef.current) gsap.set(likeRef.current, { autoAlpha: strength });
          if (nopeRef.current) gsap.set(nopeRef.current, { autoAlpha: 0 });
        } else {
          if (nopeRef.current) gsap.set(nopeRef.current, { autoAlpha: strength });
          if (likeRef.current) gsap.set(likeRef.current, { autoAlpha: 0 });
        }
      },
      onRelease: function () {
        const x = this.x as number;
        if (x > swipeThreshold) swipeOut("right");
        else if (x < -swipeThreshold) swipeOut("left");
        else snapBack();
      },
    })[0];

    function snapBack() {
      gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: "power3.out" });
      gsap.set([likeRef.current, nopeRef.current], { autoAlpha: 0 });
    }

    function swipeOut(dir: Direction) {
      draggable.disable();
      const flyX = dir === "right" ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
      const flyRot = dir === "right" ? 22 : -22;

      gsap.to(el, {
        x: flyX,
        y: gsap.utils.random(-120, 120),
        rotation: flyRot,
        duration: 0.45,
        ease: "power4.in",
        onComplete: () => {
          onSwipe(dir, topItem);
          gsap.set(el, { x: 0, y: 0, rotation: 0 });
        },
      });
    }

    return () => draggable?.kill();
  }, [topItem, swipeThreshold, onSwipe]);

  if (!topItem) {
    return (
      <div style={styles.empty}>
        <div>No more cards</div>
      </div>
    );
  }

  return (
    <div style={styles.stage}>
      {remaining.slice(0, 3).reverse().map((item, i, arr) => {
        const isTop = i === arr.length - 1;
        const depth = arr.length - 1 - i;

        return (
          <div
            key={item.id}
            ref={isTop ? topCardRef : null}
            style={{
              ...styles.card,
              transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.03})`,
              zIndex: 10 + i,
            }}
          >
            {isTop && (
              <>
                <div ref={likeRef} style={{ ...styles.badge, ...styles.like }}>
                  LIKE
                </div>
                <div ref={nopeRef} style={{ ...styles.badge, ...styles.nope }}>
                  NOPE
                </div>
              </>
            )}

            <div style={styles.content}>
              <div style={styles.title}>{item.title}</div>
              {item.subtitle && <div style={styles.subtitle}>{item.subtitle}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  stage: {
    width: "min(360px, 92vw)",
    height: "520px",
    margin: "40px auto",
    position: "relative",
    touchAction: "none",
    userSelect: "none",
  },
  card: {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    background: "white",
    overflow: "hidden",
    cursor: "grab",
    display: "flex",
    alignItems: "flex-end",
  },
  content: {
    padding: 20,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
    color: "white",
    minHeight: 160,
  },
  title: { fontSize: 28, fontWeight: 800, lineHeight: 1.1 },
  subtitle: { marginTop: 8, fontSize: 16, opacity: 0.9 },
  badge: {
    position: "absolute",
    top: 18,
    padding: "8px 12px",
    borderRadius: 12,
    fontWeight: 900,
    letterSpacing: 1,
    border: "3px solid",
    background: "rgba(255,255,255,0.85)",
    opacity: 0,
  },
  like: {
    left: 18,
    color: "#19b36b",
    borderColor: "#19b36b",
    transform: "rotate(-12deg)",
  },
  nope: {
    right: 18,
    color: "#e24545",
    borderColor: "#e24545",
    transform: "rotate(12deg)",
  },
  empty: {
    width: "min(360px, 92vw)",
    height: "520px",
    margin: "40px auto",
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    border: "2px dashed rgba(0,0,0,0.2)",
    color: "rgba(0,0,0,0.55)",
  },
};
