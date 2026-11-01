import { Injectable, NotFoundException } from "@nestjs/common";
import { fields, projects, services, site } from "./content.data";
import type { Field, Project, Service, SiteInfo } from "./content.types";

@Injectable()
export class ContentService {
  getSite(): SiteInfo { return site; }
  getFields(): Field[] { return fields; }
  getProjects(): Project[] { return projects; }
  getServices(): Service[] { return services; }

  getProject(slug: string): Project {
    const project = projects.find((p) => p.slug === slug);
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);
    return project;
  }
}
