import { useCallback, useMemo, useState } from "react";
import { Question } from "../../interfaces";
import { api } from "../../lib/http";
import { RichText } from "../RichText";
import { QuestionBranchActivity } from "./QuestionBranchActivity";
import { QuestionComment } from "./QuestionComment";
import styles from "./styles.module.css";

export interface QuestionActivityProps {
  question: Question;
  user: any;
}

export const QuestionActivity = ({
  question,
  user,
}: QuestionActivityProps): JSX.Element => {
  const [replyToId, setReplyToId] = useState<string>();
  const replyToActivity = useMemo(() => {
    if (replyToId) {
      return question.activity.find((activity) => activity.id === replyToId);
    }
  }, [replyToId]);
  const [isCommentPending, setIsCommentPending] = useState(false);
  const submitComment = useCallback(
    ({ body, replyTo }: { body: string; replyTo?: string }) => {
      return api.url(`/question/${question.slug}/comment`).post({
        content: { body },
        replyTo,
      });
    },
    []
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
              X
            </button>
          </div>
        ) : null}
        {user ? (
          <div className={styles.commentControlInner}>
            <div>
              <img src={user.avatarUrl} />
            </div>
            <RichText
              variant="comment"
              readOnly={isCommentPending}
              onConfirm={async (commentText) => {
                try {
                  setIsCommentPending(true);
                  await submitComment({
                    body: commentText,
                    replyTo: replyToId,
                  });
                  setReplyToId(undefined);
                } finally {
                  setIsCommentPending(false);
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
