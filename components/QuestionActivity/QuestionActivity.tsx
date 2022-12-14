import { EditorView } from "prosemirror-view";
import { useCallback, useMemo, useState } from "react";
import { Question } from "../../interfaces";
import { api } from "../../lib/http";
import { RichText } from "../RichText";
import { QuestionBranchActivity } from "./QuestionBranchActivity";
import { QuestionComment } from "./QuestionComment";
import styles from "./styles.module.css";
import CancelIcon from "public/icons/cross.svg";

export interface QuestionActivityProps {
  question: Question;
  user: any;
  refetch?(): void;
}

export const QuestionActivity = ({
  question,
  user,
  refetch,
}: QuestionActivityProps): JSX.Element => {
  const [forceValue, setForceValue] = useState("");
  const [editorView, setEditorView] = useState<EditorView>();
  const [replyToId, _setReplyToId] = useState<string>();
  const setReplyToId = useCallback(
    (id: string | undefined) => {
      _setReplyToId(id);
      editorView?.focus();
    },
    [editorView]
  );
  const replyToActivity = useMemo(() => {
    if (replyToId) {
      return question.activity.find((activity) => activity.id === replyToId);
    }
  }, [replyToId, question.activity]);

  const [isCommentPending, setIsCommentPending] = useState(false);

  const submitComment = useCallback(
    async ({ body, replyTo }: { body: string; replyTo?: string }) => {
      await api.url(`/question/${question.slug}/comment`).post({
        content: { body },
        replyTo,
      });
      // TODO: not this
      setTimeout(() => {
        refetch?.();
      }, 100);
    },
    [question.slug]
  );

  return (
    <div className={styles.questionActivityContainer}>
      <div
        style={{ width: "100%", overflow: "auto", height: "100%" }}
        ref={(el) => el?.scrollTo({ top: el.scrollHeight })}
      >
        {question.activity.map((activity) => {
          if (activity.type === "comment") {
            return (
              <QuestionComment
                key={activity.id}
                setReplyTo={setReplyToId}
                activity={activity}
                question={question}
                user={user}
              />
            );
          } else if (activity.type === "branch") {
            return (
              <QuestionBranchActivity
                key={activity.id}
                activity={activity}
                question={question}
                user={user}
                setReplyTo={setReplyToId}
                refetch={refetch}
              />
            );
          }
        })}
      </div>

      <div className={styles.commentControl}>
        {replyToActivity ? (
          <div className={styles.replyTo}>
            <span>
              Replying to{" "}
              <span className={styles.replyToActorName}>
                {replyToActivity.actor.name}
              </span>
            </span>
            <button
              className={styles.cancelReplyTo}
              onClick={() => setReplyToId(undefined)}
            >
              <CancelIcon />
            </button>
          </div>
        ) : null}
        {user ? (
          <div className={styles.commentControlInner}>
            <div>
              <img src={user.avatarUrl} className={styles.avatar} />
            </div>
            <RichText
              variant="comment"
              placeholder="Write a message..."
              readOnly={isCommentPending}
              value={forceValue}
              onInit={setEditorView}
              onConfirm={async (commentText) => {
                if (commentText) {
                  try {
                    setIsCommentPending(true);
                    await submitComment({
                      body: commentText,
                      replyTo: replyToId,
                    });
                    setForceValue(" ");
                    setTimeout(() => {
                      setForceValue("");
                    });
                    setReplyToId(undefined);
                  } finally {
                    setIsCommentPending(false);
                  }
                }
              }}
            />
          </div>
        ) : (
          <>Log in to comment</>
        )}
      </div>
    </div>
  );
};
