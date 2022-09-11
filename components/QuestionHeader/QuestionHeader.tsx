import { Question } from "../../interfaces";
import styles from "./styles.module.css";

interface QuestionHeaderProps {
  question?: Question;
  user?: any;
  // subtitle: string;
}
export const QuestionHeader = ({
  question,
  // subtitle,
  user,
}: QuestionHeaderProps) => {
  if (!question) {
    return <NewQuestionHeader user={user} />;
  } else {
    const isOwner = question.owner.email === user?.email;
    return (
      <section className={styles.questionHeader}>
        <div>
          <h1 className={styles.questionTitle}>{question.title}</h1>
          <small className={styles.questionSubtitle}>
            {question.owner.name}
            {isOwner ? " (you)" : ""} ·{" "}
            {question.branchName
              ? `Editing on branch ${question.branchName}`
              : "Open to suggestions (create a branch)"}
          </small>
        </div>
        <div></div>
      </section>
    );
  }
};

export const NewQuestionHeader = ({ user }: { user: any }) => {
  return (
    <section className={styles.questionHeader}>
      <div>
        <h1 className={styles.questionTitle}>Untitled Question</h1>
        <small className={styles.questionSubtitle}>
          {user.name} (you) · Private draft (share with others to get feedback)
        </small>
      </div>
      <div></div>
    </section>
  );
};
