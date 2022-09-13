import styles from "./styles.module.css";
import { api } from "../../lib/http";
import { formatDistance } from "date-fns";
import { Question } from "../../interfaces";
import Link from "next/link";

export const QuestionPreview = ({ question }: { question: Question }) => {
  return (
    <Link href={`/question/${question.slug}`}>
      <a className={styles.question}>
        <div className={styles.rankBox}>
          <button
            onClick={async (ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              await api
                .url(`/question/${question.slug}/rank/up`)
                .post({})
                .json();
              setTimeout(() => {
                location.reload();
              }, 100);
            }}
          >
            ⬆️
          </button>
          <span>{question.score}</span>
          <button
            onClick={async (ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              await api
                .url(`/question/${question.slug}/rank/down`)
                .post({})
                .json();
              setTimeout(() => {
                location.reload();
              }, 100);
            }}
          >
            ⬇️
          </button>
        </div>
        <div>
          <h2 className={styles.questionTitle}>{question.title}</h2>
          <small className={styles.questionSubTitle}>
            <img
              src={question.owner.avatarUrl}
              className={styles.questionOwnerImg}
            />
            <span>{question.owner.name}</span>
            <span>{question.activity.length} Comments</span>
            <span>
              {formatDistance(new Date(question.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </small>
        </div>
      </a>
    </Link>
  );
};
