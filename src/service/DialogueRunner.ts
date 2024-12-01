/* eslint-disable @typescript-eslint/ban-ts-comment */
import YarnBound, {
  CommandResult,
  OptionsResult,
  TextResult,
  YarnBoundOptions,
  YarnNode,
} from "yarn-bound";

export type SerializedRunner = {
  options: {
    combineTextAndOptionsResults: boolean | undefined;
    locale: string | undefined;
  };
  nodes: YarnNode[];
  history: (TextResult | OptionsResult | CommandResult)[];
  currentResult: TextResult | CommandResult | OptionsResult | null;
};

export function isDialogueRunner(obj: unknown): obj is SerializedRunner {
  return (
    obj instanceof Object &&
    "options" in obj &&
    "nodes" in obj &&
    obj.nodes instanceof Array &&
    "history" in obj &&
    obj.history instanceof Array
  );
}

export class DialogueRunner extends YarnBound {
  static fromJSON(
    serialized: SerializedRunner,
    options: Partial<YarnBoundOptions>
  ) {
    const startAt = serialized.currentResult?.metadata.title;

    const runner = new DialogueRunner({
      ...serialized.options,
      ...options,
      startAt,
      dialogue: serialized.nodes,
    });

    runner.history = serialized.history;

    if (runner.currentResult && "options" in runner.currentResult)
      runner.currentResult.select = (index = -1) => {
        // @ts-ignore
        runner.currentResult.selected = index;
      };

    return runner;
  }

  toJSON(): SerializedRunner {
    const lastNodeTitle = this.currentResult?.metadata.title;
    const lastScript = this.currentResult?.metadata.filetags.find((tag) =>
      tag.endsWith(".yarn")
    );
    const lastIndex =
      lastScript &&
      this.history.findIndex(
        (result) =>
          result.metadata.title === lastNodeTitle &&
          result.metadata.filetags.includes(lastScript)
      );

    return {
      options: {
        combineTextAndOptionsResults: this.combineTextAndOptionsResults,
        locale: this.locale,
      },
      nodes: Array.from(
        // @ts-ignore
        Object.getOwnPropertyNames(this.runner.yarnNodes),
        // @ts-ignore
        (key) => this.runner.yarnNodes[key]
      ),
      history: this.history.slice(
        0,
        typeof lastIndex === "number" && lastIndex >= 0 ? lastIndex : undefined
      ),
      currentResult:
        typeof lastIndex === "number" &&
        lastIndex >= 0 &&
        lastIndex < this.history.length
          ? this.history[lastIndex]
          : this.currentResult,
    };
  }
}
