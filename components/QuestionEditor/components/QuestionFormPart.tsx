import * as Y from "yjs";
import { DateQuestionFormPart } from "./DateQuestionFormPart";
import { MultiChoiceQuestionFormPart } from "./MultiChoiceQuestionFormPart";
import { RichTextQuestionFormPart } from "./RichTextQuestionFormPart";

interface GenericFormPartConfig {
  type: "date" | "rich-text";
  label: string;
  yKey: string;
  required: boolean;
}

interface MultiChoiceOption {
  label: string;
  value: string;
  disabled: boolean;
}
export interface MultiChoiceConfig {
  type: "multi-choice";
  label: string;
  yKey: string;
  required: boolean;
  options: MultiChoiceOption[];
}
export type QuestionFormPartConfig = GenericFormPartConfig | MultiChoiceConfig;

export interface QuestionFormPartProps {
  doc: Y.Doc;
  config: QuestionFormPartConfig;
}

export const QuestionFormPart = (props: QuestionFormPartProps): JSX.Element => {
  if (props.config.type === "multi-choice") {
    return (
      <MultiChoiceQuestionFormPart
        doc={props.doc}
        config={props.config as MultiChoiceConfig}
      />
    );
  } else if (props.config.type === "date") {
    return <DateQuestionFormPart {...props} />;
  }

  return <RichTextQuestionFormPart {...props} />;
};
