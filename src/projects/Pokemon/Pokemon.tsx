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
  const fetchingRef = useRef(false);

  const [offset, setOffset] = useState(0);


  async function fetchPokemons({ currentOffSet }: { currentOffSet: number }) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

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
      fetchingRef.current = false;
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
        if (!hasUserScrolledRef.current) return;
        if (fetchingRef.current) return;

        setOffset((prevOffset) => prevOffset + LIMIT);
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    const el = bottomRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {

    if (fetchingRef.current) return;

    fetchPokemons({ currentOffSet: 0 });
  }, []);

  useEffect(() => {
    if (offset === 0) return;
    fetchPokemons({ currentOffSet: offset });
  }, [offset]);

  return (
    <div className="w-full h-screen overflow-y-auto bg-white p-6">
      <header>
        <h1 className="text-2xl font-bold text-center mb-6">Pokedex</h1>
      </header>
      <div className="grid grid-cols-1 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="border border-gray-300 rounded-lg flex justify-center gap-2 items-center">
            <img src={pokemon.picture} alt={pokemon.name} className="w-20 h-20 object-contain" />
            <p className="text-md font-semibold">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
          </div>
        ))}
      </div>

      <footer ref={bottomRef} style={{ height: 1 }}></footer>
    </div>
  );
}
