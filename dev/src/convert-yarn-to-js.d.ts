declare namespace convertYarnToJS {
  export type YarnNode = {
    [key: string]: string;
  } & {
    title: string;
    body: string;
    fileTags: string[];
  };
}

declare function convertYarnToJS(content: string): YarnNode[];

export = convertYarnToJS;
