import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { QuestionFormPartProps } from "./QuestionFormPart";
import * as Y from "yjs";
import { RichText } from "../../RichText";
import { Awareness } from "y-protocols/awareness";
import styles from "./styles.module.css";
import { Label } from "../../Form/Label";
import { FormGroup } from "../../Form/FormGroup";

export const RichTextQuestionFormPart = ({
  config,
  doc,
}: QuestionFormPartProps): JSX.Element => {
  const [yType, setYType] = useState<Y.XmlFragment>();

  useEffect(() => {
    const type = doc.getXmlFragment(config.yKey);
    setYType(type);
  }, [config.yKey, doc]);

  const awareness = useMemo(() => {
    return new Awareness(doc);
  }, [doc]);

  return (
    <FormGroup>
      <Label label={config.label} name={config.label} />
      <div className={styles.richTextQuestionFormPartWrapper}>
        {awareness && yType ? (
          <RichText
            yType={yType}
            awareness={awareness}
          />
        ) : null}
      </div>
    </FormGroup>
  );
};