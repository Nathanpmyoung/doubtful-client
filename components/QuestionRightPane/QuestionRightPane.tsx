import { Question } from "../../interfaces";
import { QuestionActivity } from "../QuestionActivity/QuestionActivity";
import styles from "./styles.module.css";

interface QuestionRightPaneProps {
  user?: any;
  question?: Question;
}

export const QuestionRightPane = ({
  question,
  user,
}: QuestionRightPaneProps): JSX.Element => {
  return (
    <main className={styles.rightPane}>
      <div>
        <button className={`${styles.tabPicker} ${styles.activeTabPicker}`}>
          Conversation
        </button>
        <button className={`${styles.tabPicker}`}>Suggestions</button>
        <button className={`${styles.tabPicker}`}>Details</button>
      </div>
      <section className={styles.rightPaneDetail}>
        {/* TODO: show correct detail based on selected mode */}
        {question ? (
          <QuestionActivity question={question} user={user} />
        ) : (
          <QuestionActivityEmptyState />
        )}
      </section>
    </main>
  );
};

const QuestionActivityEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <h2>
        <span style={{ fontSize: "4em" }}>💬</span>
        <br />
        <br />
        Nothing here... yet...
      </h2>
    </div>
  );
};
