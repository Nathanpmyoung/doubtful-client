import { useMemo } from "react";
import { Question, QuestionActivity } from "../../interfaces";
import styles from "./styles.module.css";

export interface QuestionCommentProps {
  question: Question;
  user: any;
  activity: QuestionActivity;
  setReplyTo(id: string): void;
}

export const QuestionComment = ({
  question,
  user,
  activity,
  setReplyTo,
}: QuestionCommentProps): JSX.Element => {
  return (
    <div className={styles.questionComment} id={`activity-${activity.id}`}>
      <div className={styles.avatarWrapper}>
        <img
          src={activity.actor.avatarUrl}
          alt={activity.actor.name}
          style={{ width: "32px", borderRadius: "50%" }}
        />
      </div>
      <div style={{ width: "100%" }}>
        {activity.relatedActivity ? (
          <a
            className={styles.relatedActivity}
            href={`#activity-${activity.relatedActivity.id}`}
          >
            <div className={styles.relatedActivityGlyph}></div>
            <span className={styles.relatedActivityContent}>
              {activity.relatedActivity.content.body
                ? activity.relatedActivity.content.body
                : 'an activity'}
            </span>
          </a>
        ) : null}
        <span className={styles.actorName}>{activity.actor.name}</span>
        <span className={styles.activityTime}>
          {new Date(activity.createdAt).toLocaleTimeString()}
        </span>
        <div className={styles.commentBody}>{activity.content.body}</div>
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
};
