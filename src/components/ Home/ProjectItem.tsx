import type { IProject } from "../../types/IProject";
import { Link, useNavigate } from "react-router-dom";

interface ProjectItemProps {
  project: IProject;
}

export function ProjectItem({ project }: ProjectItemProps) {

  const navigate = useNavigate();

  function handleClick() {
    const { url } = project;
    navigate(url);
  }

  return (
    <div className="w-[360px] h-[200px] bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer" onClick={handleClick}>
      <div>
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm">{project.description}</p>
      </div>
      <section className="flex flex-wrap gap-2 mt-4">
        {project.features.map(feature => (
          <span key={feature} className="inline-block bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full font-semibold">
            {feature}
          </span>
        ))}
      </section>
    </div>
  )
}
