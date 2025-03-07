import { Plugin } from "vite";
import { PluginContext } from "rollup";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { IProject } from "../../src/types/IProject";
import convertYarnToJS, { YarnNode } from "./convert-yarn-to-js";

export type VitePluginYarnOptions = {
  projectFile?: string;
  outputName?: string;
};

const defaultOptions = {
  projectFile: "project.json",
  outputName: "YarnNodes.json",
};

export const vitePluginYarn = (
  pluginOptions?: VitePluginYarnOptions
): Plugin => {
  const options = Object.assign(defaultOptions, pluginOptions || {});

  let projectData: IProject;
  let parse: (projectData: IProject) => Promise<YarnNode[]>;

  return {
    name: "vite-plugin-yarn",

    async buildStart() {
      const projectPath = path.resolve(
        this.environment.config.publicDir,
        options.projectFile
      );

      projectData = JSON.parse(
        (await fs.readFile(projectPath, { encoding: "utf-8" })).toString()
      );

      parse = parseYarnFiles.bind(this);
    },

    async buildEnd() {
      const outPath = path.resolve(
        this.environment.config.build.outDir,
        this.environment.config.build.assetsDir,
        options.outputName
      );

      const nodes = await parse(projectData);

      const content = JSON.stringify(nodes);

      await fs.writeFile(outPath, content);

      this.info(nodes.length + " nodes parsed.");
    },

    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.endsWith(options.outputName)) {
          const nodes = await parse(projectData);
          response.setHeader("Content-Type", "application/json");
          return response.end(JSON.stringify(nodes), "utf-8");
        }

        next();
      });
    },
  };
};

async function parseYarnFiles(this: PluginContext, projectData: IProject) {
  let nodes: YarnNode[] = [];

  for (const file of projectData.sourceScripts) {
    const filepath = path.resolve(
      (this as PluginContext).environment.config.publicDir,
      file
    );
    const content = await fs.readFile(filepath);

    const newNodes = convertYarnToJS(content.toString());
    nodes = nodes.concat(newNodes);
  }

  return nodes;
}
