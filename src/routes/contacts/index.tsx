import { createFileRoute } from "@tanstack/react-router";

type Contact = {
  id: string;
  name: string;
  role: number;
};

export const Route = createFileRoute("/contacts/")({
  loader: ({ context }) =>
    new Promise<Contact[]>((resolve, reject) => {
      if (!context.project)
        return reject("The project has not been correctly initialized.");

      const contacts = context.project.sourceScripts.reduce((names, path) => {
        const matches = path.match(/\/contact-(.*)\.yarn$/);

        if (!matches) return names;

        if (context.variables.get(`${matches[1]}_contact`))
          names.push({
            id: matches[1],
            name:
              context.variables.get(`${matches[1]}_name`)?.toString() || "???",
            role: Number(context.variables.get(`${matches[1]}_role`)),
          });

        return names;
      }, [] as Contact[]);

      return resolve(contacts);
    }),
});
