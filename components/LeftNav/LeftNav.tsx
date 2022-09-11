import { Question } from "../../interfaces";
import styles from "./styles.module.css";

interface LeftNavProps {
  user: any;
}

export const LeftNav = ({ user }: LeftNavProps): JSX.Element => {
  return (
    <nav className={styles.nav}>
      <section>
        <div className={styles.navTitle}>
          <span className={styles.tmpLogo}></span> <span>Doubtful.</span>
        </div>
        <div>
          <a href="/question/new" className={styles.newQuestionButton}>
            + New Question
          </a>
        </div>
        <div className={styles.links}>
          <a href="/">Questions</a>
        </div>
        <div>
          <h4 className={styles.navHeader}>Participating</h4>
          <ul>
            {user.participating?.map((question: Question) => {
              return (
                <li>
                  <a href={`/question/${question.slug}`}>{question.title}</a>
                </li>
              );
            })}
          </ul>
        </div>
        {/* <div>
          <h4>Published</h4>
          <ul>
            {user.published.map((question: Question) => {
              return (
                <li>
                  <a href={`/question/${question.slug}`}>{question.title}</a>
                </li>
              );
            })}
          </ul>
        </div> */}
      </section>
      <section className={styles.whatsApp}>
        Make this platform better
        <br />
        <a
          href="https://chat.whatsapp.com/JeEluh0Czpf3JPu6GPhINx"
          target="_blank"
        >
          Join our WhatsApp group
        </a>
      </section>
    </nav>
  );
};
