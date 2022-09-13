import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { api } from "../../lib/http";
import { useRouter } from "next/router";
import { subscribe } from "lib0/broadcastchannel";

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
    placeholder: "Add resolution criteria...",
  },
  {
    required: false,
    yKey: "backgroundText",
    label: "Background Text",
    type: "rich-text",
    placeholder: "Add background info...",
  },
  {
    required: false,
    yKey: "finePrintText",
    label: "Fine Print Text",
    type: "rich-text",
    placeholder: "Add fine print info...",
  },
];

export interface QuestionEditorProps {
  question?: Question;
  canEdit: boolean;
  yDocRef: MutableRefObject<Y.Doc>;
  user?: any;
  onChange(question: Partial<Question>): void;
}

const isBrowser = typeof window !== "undefined";

export const QuestionEditor = ({
  question,
  user,
  yDocRef,
  onChange,
}: QuestionEditorProps): JSX.Element => {
  const router = useRouter();
  const subscribedDocIdRef = useRef<string>();
  const isTransitioningDocRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [pendingQuestion, setPendingQuestion] = useState<Partial<Question>>(
    question || {}
  );
  const [, setIsConnected] = useState(false);

  const isOwner = !question || question.owner.email === user?.email;

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
    setShouldRender(true);
  }, [socket]);

  const unsubscribe = useCallback(async () => {
    if (subscribedDocIdRef.current) {
      await wave!.unsubscribeFromDoc(subscribedDocIdRef.current);
      subscribedDocIdRef.current = undefined;
    }
  }, [wave, question?.slug]);

  const subscribe = useCallback(async () => {
    if (wave) {
      const awareness = new awarenessProtocol.Awareness(yDocRef.current);
      console.log("subscribe", question?.slug);
      subscribedDocIdRef.current = question!.content!.id;
      try {
        await wave.subscribeToDoc(
          question!.content!.id,
          yDocRef.current,
          awareness
        );
      } catch (err) {
        console.log(err);
        subscribedDocIdRef.current = undefined;
      }

      isTransitioningDocRef.current = false;
    }
  }, [wave, question]);

  useEffect(() => {
    if (question && wave) {
      const onDocUpdate = async (_: void, source: any) => {
        if (
          source !== "remote" &&
          !isTransitioningDocRef.current &&
          !question.base
        ) {
          isTransitioningDocRef.current = true;

          const createdBranch: Question = await api
            .url(`/question/${question.slug}/branch/create`)
            .post({})
            .json();

          router.push(`/question/${question.slug}/${createdBranch.branchName}`);

          setPendingQuestion(createdBranch);
        }
      };

      (async () => {
        await unsubscribe();

        // When auto-branching, we want to keep the same doc - no updates or doc changes desired
        if (!isTransitioningDocRef.current) {
          yDocRef.current = new Y.Doc({ gc: false });

          if (question?.content) {
            Y.applyUpdate(
              yDocRef.current,
              Uint8Array.from(question.content.content.data)
            );
          }

          yDocRef.current.on("update", onDocUpdate);

          setTimeout(() => {
            setShouldRender(false);
            setTimeout(() => {
              setShouldRender(true);
            }, 0);
          }, 100);
        } else {
          if (question?.content) {
            Y.applyUpdate(
              yDocRef.current,
              Uint8Array.from(question.content.content.data)
            );
          }
        }

        if (question.owner.email === user.email) {
          await subscribe();
        }
      })();

      return () => {
        yDocRef.current.off("update", onDocUpdate);
      };
    }
  }, [question?.content, wave]);

  useEffect(() => {
    onChange(pendingQuestion);
  }, [pendingQuestion]);

  const canEdit = !!user && (isOwner ? true : !question.base);

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

      {yDocRef.current &&
        shouldRender &&
        questionFormPartConfig.map((partConfig) => {
          return (
            <QuestionFormPart
              canEdit={canEdit}
              doc={yDocRef.current}
              config={partConfig}
              key={partConfig.yKey}
            />
          );
        })}
    </>
  );
};
