declare module "yarn-bound" {
  type Tag = {
    name: string;
    properties: {
      [key: string]: string;
    };
    position: number;
    length: number;
  };

  type CharacterTag = {
    name: string;
    properties: Tag["properties"] & {
      name: string;
    };
    position: number;
    length: number;
  };

  export type NodeMetadata = {
    [key: string]: string | string[];
    title: string;
    filetags: string[];
  };

  export type BaseResult = {
    metadata: NodeMetadata;
    markup?: (Tag | CharacterTag)[];
    isDialogueEnd?: boolean;
  };

  export type TextResult = BaseResult & {
    text: string;
    hashtags: string[];
  };

  export type CommandResult = BaseResult & {
    command: string;
    hashtags: string[];
  };

  export type OptionResult = BaseResult & {
    text: string;
    isAvailable: boolean;
    hashtags: string[];
  };

  export type OptionsResult = BaseResult & {
    text?: string;
    options: OptionResult[];
    select: (index: number) => OptionResult;
  };

  export type YarnNode = {
    metdata: NodeMetadata;
    body: string;
  };

  export type YarnVariableType = string | number | boolean;

  export interface IVariablesStorage {
    get: (variable: string) => YarnVariableType | undefined;
    set: (key: string, value: YarnVariableType) => void;
  }

  export type HandleCommandFn = (command: CommandResult) => void;

  export type YarnBoundOptions = {
    dialogue: string | YarnNode[];
    startAt?: string;
    combineTextAndOptionsResults?: boolean;
    functions?: {
      [key: string]: (...args: YarnVariableType[]) => YarnVariableType;
    };
    handleCommand?: HandleCommandFn;
    variableStorage?: IVariablesStorage;
    locale?: string;
  };

  type GeneratedResult = (TextResult | OptionsResult | CommandResult) & {
    getGeneratorHere: () => Generator<GeneratedResult>;
  };

  class YarnBound {
    handleCommand?: HandleCommandFn;
    pauseCommand: string = "pause";
    combineTextAndOptionsResults?: boolean;
    currentResult: TextResult | OptionsResult | CommandResult | null;
    history: (TextResult | OptionsResult | CommandResult)[];
    locale?: string;
    variableStorage: IVariablesStorage;
    generator: Generator<GeneratedResult>;

    constructor(options: YarnBoundOptions);
    jump(startAt: string): void;
    advance(optionIndex?: number): void;
    currentResult: OptionsResult | TextResult | CommandResult | undefined;
    lookahead(): IteratorResult<GeneratedResult>;
  }

  export default YarnBound;
}
