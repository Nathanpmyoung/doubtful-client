import Link from "next/link";
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
          <Link href="/">Questions</Link>
        </div>
        <div>
          <h4 className={styles.navHeader}>Participating</h4>
          <div className={styles.links}>
            <Link href="/">2022 Hottest Year on Record</Link>
            <Link href="/">Second US Civil War Before 2030</Link>
            <Link href="/">
              Apple or Google to launch AR hardware product in 2023
            </Link>
            {user.participating?.map((question: Question) => {
              return (
                <Link href={`/question/${question.slug}`}>
                  {question.title}
                </Link>
              );
            })}
          </div>
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
        <Link
          href="https://chat.whatsapp.com/JeEluh0Czpf3JPu6GPhINx"
          target="_blank"
        >
          Join our WhatsApp group
        </Link>
      </section>
    </nav>
  );
};
