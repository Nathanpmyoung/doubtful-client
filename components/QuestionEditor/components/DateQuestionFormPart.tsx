import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { DateInput } from "../../Form/DateInput";
import { FormGroup } from "../../Form/FormGroup";
import { Label } from "../../Form/Label";
import { getValueFromYDoc } from "./lib";
import { QuestionFormPartProps } from "./QuestionFormPart";

export const DateQuestionFormPart = ({
  config,
  doc,
}: QuestionFormPartProps): JSX.Element => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    // TODO: Uncouple from metadata
    doc.getMap("metadata").observe(() => {
      const metadataKey = config.yKey.replace("metadata.", "");
      const valueFromDoc = doc.getMap("metadata").get(metadataKey);
      setValue(valueFromDoc as string);
    });
    const metadataKey = config.yKey.replace("metadata.", "");
    const valueFromDoc = doc.getMap("metadata").get(metadataKey);
    setValue(valueFromDoc as string);
  }, [config.yKey, doc]);

  const onChange = useCallback(
    (value: string) => {
      const metadataKey = config.yKey.replace("metadata.", "");
      const metadataType = doc.getMap("metadata");
      metadataType.set(metadataKey, value);
    },
    [config.yKey, doc]
  );

  return (
    <FormGroup>
      <Label label={config.label} name={config.label} />
      <DateInput
        value={value || ""}
        onChange={onChange}
        name={config.label}
        placeholder="Pick Date"
      />
    </FormGroup>
  );
};
