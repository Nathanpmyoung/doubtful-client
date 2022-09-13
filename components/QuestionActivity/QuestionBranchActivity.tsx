import Link from "next/link";
import { Question, QuestionActivity } from "../../interfaces";
import { api } from "../../lib/http";
import styles from "./styles.module.css";

export interface QuestionBranchActivityProps {
  question: Question;
  user: any;
  activity: QuestionActivity;
  setReplyTo(id: string): void;
  refetch?(): void;
}

export const QuestionBranchActivity = ({
  activity,
  question,
  refetch,
  setReplyTo,
}: QuestionBranchActivityProps): JSX.Element => {
  const { suggestion, accept } = activity.content.branch;
  if (suggestion) {
    const { summary, branchSlug } = suggestion;
    return (
      <div className={styles.questionComment} id={`activity-${activity.id}`}>
        <div className={styles.avatarWrapper}>
          <img
            className={styles.avatar}
            src={activity.actor.avatarUrl}
            alt={activity.actor.name}
          />
        </div>
        <div style={{ width: "100%" }}>
          <span className={styles.actorName}>
            {activity.actor.name} made a suggestion
          </span>
          <span className={styles.activityTime}>
            {new Date(activity.createdAt).toLocaleTimeString()}
          </span>
          <div className={styles.commentBody}>
            <strong>{summary}</strong>
            <br />
            <br />
            <Link href={`/question/${question.slug}/${branchSlug}`}>
              View Changes
            </Link>{" "}
            <button
              onClick={async () => {
                await api
                  .url(`/question/${question.slug}/branch/${branchSlug}/accept`)
                  .post({})
                  .json();
                setTimeout(() => {
                  refetch?.();
                }, 100);
              }}
            >
              Accept Changes
            </button>
          </div>
          <a
            href="#"
            onClick={(ev) => {
              ev.preventDefault();
              setReplyTo(activity.id);
            }}
            className={styles.replyButton}
          >
            Reply
          </a>
        </div>
      </div>
    );
  } else if (accept) {
    const { summary, branchSlug } = accept;
    return (
      <div className={styles.questionComment}>
        <div className={styles.avatarWrapper}>
          <img
            className={styles.avatar}
            src={activity.actor.avatarUrl}
            alt={activity.actor.name}
          />
        </div>
        <div style={{ width: "100%" }}>
          <span className={styles.actorName}>
            {activity.actor.name} accepted a suggestion
          </span>
          <span className={styles.activityTime}>
            {new Date(activity.createdAt).toLocaleTimeString()}
          </span>
          <div className={styles.commentBody}>{summary}</div>
          <a
            href="#"
            onClick={(ev) => {
              ev.preventDefault();
              setReplyTo(activity.id);
            }}
            className={styles.replyButton}
          >
            Reply
          </a>
        </div>
      </div>
    );
  }
  return <></>;
};
