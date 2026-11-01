import { Controller, Get, Param } from "@nestjs/common";
import { ContentService } from "./content.service";

@Controller("content")
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get("site") site() { return this.content.getSite(); }
  @Get("fields") fields() { return this.content.getFields(); }
  @Get("projects") projects() { return this.content.getProjects(); }
  @Get("projects/:slug") project(@Param("slug") slug: string) { return this.content.getProject(slug); }
  @Get("services") services() { return this.content.getServices(); }
}
