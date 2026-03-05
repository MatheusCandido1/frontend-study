import { CatCard } from "../../components/CatTinder/CatCard";
import { cats } from "../../data/cat";

export default function CatTinder() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <div style={{ position: "relative", width: "100%", height: 500 }}>
        {cats.map((cat, i) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
