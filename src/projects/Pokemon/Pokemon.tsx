import { useEffect, useRef, useState } from "react";

type Pokemon = {
  id: number;
  name: string;
  picture: string;
}


const LIMIT = 20;

export default function Pokemon() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasUserScrolledRef = useRef(false);

  const [offset, setOffset] = useState(0);


  async function fetchPokemons({ currentOffSet }: { currentOffSet: number }) {
    try {
      setIsFetching(true);

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffSet}`);
      const data = await response.json();

      const pokemonsData = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const response = await fetch(pokemon.url);
          const pokemonData = await response.json();

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            picture: pokemonData.sprites.front_default,
          };
        })
      );

      if (pokemonsData.length > 0) {
        setPokemons((prev) => [...prev, ...pokemonsData]);
      }

    } catch (error) {
      console.error("Error fetching pokemons:", error);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    const onScroll = () => {
      hasUserScrolledRef.current = true;
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) return;

        // ✅ don't trigger on first load
        if (!hasUserScrolledRef.current) return;

        setOffset((prevOffset) => prevOffset + LIMIT);
      },
      { threshold: 0.1, rootMargin: '500px' }
    );

    const el = bottomRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchPokemons({ currentOffSet: 0 });
  }, []);

  useEffect(() => {
    if (offset === 0) return;
    fetchPokemons({ currentOffSet: offset });
  }, [offset]);

  return (
    <div>
      <header>
        <h1>Pokedex</h1>
      </header>
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} style={{ marginBottom: 16, border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
          <img src={pokemon.picture} alt={pokemon.name} style={{ display: 'block', width: '100px', height: '100px' }} />
          <p style={{ fontSize: "18px", marginTop: 8 }}>{pokemon.name}</p>
        </div>
      ))}

      <footer ref={bottomRef} style={{ height: 1 }}></footer>
    </div>
  );
}
