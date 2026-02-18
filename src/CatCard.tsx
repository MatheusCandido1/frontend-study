import './styles/CatCard.css'

interface CatCardProps {
  cat: {
    id: number;
    name: string;
    picture: string;
  }
}

export function CatCard({ cat }: CatCardProps) {
  return (
    <div id="cat-card-container">
      <img src={cat.picture} alt={cat.name} style={{ display: 'block', width: '100%', height: '100%', borderRadius: "10px 10px 0 0" }} />
      <div style={{ position: "absolute", backgroundColor: "#FFF", bottom: 22, left: 22, padding: "4px 8px", borderRadius: "4px", width: '80%' }}>
        <p style={{ color: "#000", fontSize: "20px", margin: 0 }}>{cat.name}</p>
      </div>
    </div>
  )
}
