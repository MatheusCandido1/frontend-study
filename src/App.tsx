import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./views/Home";
import TinderCat from "./projects/CatTinder/CatTinder";
import PokemonList from "./projects/Pokemon/Pokemon";
import SearchAndFilter from "./projects/SearchAndFilter/SearchAndFilter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/cat-tinder" element={<TinderCat />} />
        <Route path="/projects/pokemon-list" element={<PokemonList />} />
        <Route path="/projects/search-filter" element={<SearchAndFilter />} />
      </Routes>


    </BrowserRouter>
  )
}
