import { ProjectItem } from "../components/ Home/ProjectItem";
import type { IProject } from "../types/IProject";

export function Home() {

  const projects: IProject[] = [
    {
      id: 1,
      title: "Cat Tinder",
      description: "A fun app to swipe through cat profiles and find your purrfect match!",
      features: ['Gesture', 'Swipe'],
      url: '/projects/cat-tinder'
    },
    {
      id: 2,
      title: 'Pokemon List',
      description: 'A simple app to browse through a list of Pokemon and their details.',
      features: ['Promise All', 'Pagination', 'Infinite Scroll'],
      url: '/projects/pokemon-list'
    },
    {
      id: 3,
      title: 'Search + Filter',
      description: 'An app that allows users to search and filter through a large dataset of items.',
      features: ['Search', 'Filter', 'Debounce'],
      url: '/projects/search-filter'
    }
  ]

  return (
    <main className="flex w-screen text-white p-6">
      <section className="grid xs:grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </section>
    </main>
  )
}
