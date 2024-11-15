/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Timeout } from "@tanstack/router";
import YarnBound, {
  CommandResult,
  OptionResult,
  OptionsResult,
  TextResult,
  YarnBoundOptions,
  YarnNode,
} from "yarn-bound";

export type SerializedRunner = {
  options: {
    autoRun: number | false;
    combineTextAndOptionsResults: boolean | undefined;
    locale: string | undefined;
  };
  nodes: YarnNode[];
  history: (TextResult | OptionResult | CommandResult)[];
  currentResult: TextResult | CommandResult | OptionsResult | null;
};

interface DialogueRunnerOptions extends YarnBoundOptions {
  autoRun: number | false;
}

export class DialogueRunner extends YarnBound {
  _autoRun: number | false = false;
  _autoRunInterval?: Timeout;

  constructor({ autoRun, ...options }: DialogueRunnerOptions) {
    super(options);
    this.autoRun = autoRun || false;
  }

  set autoRun(newValue: number | false) {
    this._autoRun = newValue;

    if (this._autoRun)
      this._autoRunInterval = setInterval(() => {
        if (
          this.currentResult &&
          !("options" in this.currentResult) &&
          !("command" in this.currentResult) &&
          !this.currentResult.isDialogueEnd
        ) {
          this.advance();
        }
      }, this._autoRun);
  }

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

    runner.currentResult = serialized.currentResult;

    return runner;
  }

  toJSON(): SerializedRunner {
    return {
      options: {
        autoRun: this._autoRun,
        combineTextAndOptionsResults: this.combineTextAndOptionsResults,
        locale: this.locale,
      },
      nodes: Array.from(
        // @ts-ignore
        Object.getOwnPropertyNames(this.runner.yarnNodes),
        // @ts-ignore
        (key) => this.runner.yarnNodes[key]
      ),
      history: this.history,
      currentResult: this.currentResult,
    };
  }
}
