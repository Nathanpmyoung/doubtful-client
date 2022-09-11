import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { FormGroup } from "../../Form/FormGroup";
import { Label } from "../../Form/Label";
import { PillButton } from "../../Form/PillButton";
import { getValueFromYDoc } from "./lib";
import { MultiChoiceConfig, QuestionFormPartProps } from "./QuestionFormPart";

export const MultiChoiceQuestionFormPart = ({
  config,
  doc,
}: QuestionFormPartProps & {
  config: MultiChoiceConfig;
}): JSX.Element => {
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

      {config.options.map((option) => {
        return (
          <PillButton
            key={option.label}
            onClick={() => {
              onChange(option.value);
            }}
            label={option.label}
            disabled={option.disabled}
            isActive={option.value === value}
          />
        );
      })}
    </FormGroup>
  );
};
