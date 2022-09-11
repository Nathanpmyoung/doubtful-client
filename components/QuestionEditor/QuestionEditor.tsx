import { useEffect, useMemo, useRef, useState } from "react";
import { Question } from "../../interfaces";
import * as Y from "yjs";
import {
  QuestionFormPart,
  QuestionFormPartConfig,
} from "./components/QuestionFormPart";
import tinycolor from "tinycolor2";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { WavingClient } from "@gived/waving";
import { io } from "socket.io-client";
import { config } from "../../config";
import { Label } from "../Form/Label";
import { TitleInput } from "../Form/TitleInput";
import { FormGroup } from "../Form/FormGroup";

const questionFormPartConfig: QuestionFormPartConfig[] = [
  {
    required: true,
    yKey: "metadata.type",
    label: "Question type (required)",
    type: "multi-choice",
    options: [
      { label: "Binary yes/no", value: "binary", disabled: false },
      { label: "Range (coming soon)", value: "range", disabled: true },
      { label: "Other (coming soon)", value: "other", disabled: true },
    ],
  },
  {
    required: true,
    yKey: "metadata.closeDate",
    label: "Resolves (required)",
    type: "date",
  },

  {
    required: true,
    yKey: "resolutionText",
    label: "Resolution Criteria",
    type: "rich-text",
  },
  {
    required: false,
    yKey: "backgroundText",
    label: "Background Text",
    type: "rich-text",
  },
  {
    required: false,
    yKey: "finePrintText",
    label: "Fine Print Text",
    type: "rich-text",
  },
];

export interface QuestionEditorProps {
  question?: Question;
  canEdit: boolean;
  yDoc: Y.Doc;
  user?: any;
  onChange(question: Partial<Question>): void;
}

const isBrowser = typeof window !== "undefined";

export const QuestionEditor = ({
  question,
  user,
  yDoc,
  onChange,
}: QuestionEditorProps): JSX.Element => {
  const subscribedDocIdRef = useRef<string>();
  const [pendingQuestion, setPendingQuestion] = useState<Partial<Question>>(
    question || {}
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [, setIsConnected] = useState(false);
  const awarenessRef = useRef(new awarenessProtocol.Awareness(yDoc));

  const socket = useMemo(() => {
    if (isBrowser) {
      const socket = io(
        `${config.apiUrl.replace("http", "ws").split("://")[1]}`,
        {
          transports: ["websocket"],
          query: { version: 0 },
        }
      );

      return socket;
    }
  }, []);

  const wave = useMemo(() => {
    if (socket) {
      const wave = ((window as any).wave = new WavingClient({
        socket,
        async onConnect() {
          wave.auth("");
          setIsConnected(true);
          console.log("connected");
        },
        onSubscribe() {
          console.log("subscribed");
        },
        onDisconnect() {
          console.log("disconnected");
          setIsConnected(false);
        },
      }));
      const name = user?.name;
      wave.user = {
        name,
        // avatar: profile.picture,
        // isGuest: !profile.id,
        // color: Math.random() > 0.5 ? 'red' : 'blue',
        color: tinycolor.random().toHexString(),
      };

      return wave;
    }
  }, [socket]);

  useEffect(() => {
    const doEffect = async () => {
      if (isSubscribed && subscribedDocIdRef.current) {
        await wave!.unsubscribeFromDoc(subscribedDocIdRef.current);
        subscribedDocIdRef.current = undefined;
        yDoc.destroy();
      }
      console.log("subscribe");
      await wave!.subscribeToDoc(
        question!.content!.id,
        yDoc,
        awarenessRef.current
      );
      subscribedDocIdRef.current = question!.content!.id;
      setIsSubscribed(true);
    };

    if (wave && yDoc && awarenessRef.current && question?.slug) {
      doEffect();
    }
  }, [wave, question?.slug]);

  useEffect(() => {
    if (question?.content) {
      Y.applyUpdate(yDoc, Uint8Array.from(question.content.content.data));
    }
  }, [question?.content]);

  useEffect(() => {
    onChange(pendingQuestion);
  }, [pendingQuestion]);

  const isOwner = !question || question.owner.email === user?.email;

  return (
    <>
      <FormGroup>
        <Label name="title" label="Question (required)" />
        <TitleInput
          name="title"
          placeholder="Type a question..."
          defaultValue={question?.title || ""}
          onChange={(title) => {
            setPendingQuestion({ ...pendingQuestion, title });
          }}
          disabled={!isOwner}
        />
      </FormGroup>

      {yDoc &&
        (!question || isSubscribed) &&
        questionFormPartConfig.map((partConfig) => {
          return (
            <QuestionFormPart
              canEdit={isOwner}
              doc={yDoc}
              config={partConfig}
              key={partConfig.yKey}
            />
          );
        })}
    </>
  );
};
