import { useEffect, useState, useMemo, useRef } from "react"
import type { IUser } from "../../types/IUser";


export default function SearchAndFilter() {

  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("matheus");
  const [isFetching, setIsFetching] = useState(false);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    fetchUsers({ search: "" });
  }, []);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        fetchUsers({ search });
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  async function fetchUsers({ search }: { search?: string } = {}) {
    try {
      setIsFetching(true);

      const response = await fetch(`https://api.github.com/search/users?q=${search}`);
      const data = await response.json();

      console.log(data.items)
      setUsers(data.items);

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <div className="flex p-10 justify-center items-center">
      <div className="w-screen h-[800px] bg-white rounded-lg">
        <section className="flex flex-col w-full items-center p-6">
          <input
            value={search}
            onChange={handleSearchChange}
            type="text" placeholder="Search..." className="border p-2 rounded-lg w-full border-orange-400 border-2" />
        </section>

        <section>
          {
            users.slice(0, 6).map((user: IUser) => (
              <div key={user.id} className="flex items-center gap-4 p-4 border-b">
                <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full" />
                <span>{user.login}</span>
              </div>
            ))
          }
        </section>

      </div>
    </div>
  )
}
