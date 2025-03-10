export type ParserNode = {
  [key: string]: string;
} & {
  title: string;
  body: string;
  filetags: string[];
};

declare function convertYarnToJS(content: string): ParserNode[];

export default convertYarnToJS;
