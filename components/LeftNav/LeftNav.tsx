import Link from "next/link";
import styles from "./styles.module.css";
import PlusIcon from "public/icons/plus.svg";
import HomeIcon from "public/icons/home.svg";
import ChatIcon from "public/icons/chat.svg";
import { useRouter } from "next/router";
interface LeftNavProps {
  user: any;
}

const participatingSampleData = [
  { id: 1, slug: "", title: "2022 Hottest Year on Record" },
  { id: 2, slug: "", title: "Second US Civil War Before 2030" },
  {
    id: 3,
    slug: "",
    title: "Apple or Google to launch AR hardware product in 2023",
  },
];

export const LeftNav = ({ user }: LeftNavProps): JSX.Element => {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <section>
        <div className={styles.navTitle}>
          <div className={styles.navHomeLinks}>
            <Link href={"/"}>
              <a className={styles.tmpLogo} />
            </Link>
            <Link href={"/"}>Doubtful.</Link>
          </div>
          <Link href={"/profile"}>
            <img src={user.avatarUrl} className={styles.userAvatar} />
          </Link>
        </div>
        <div>
          <Link href="/question/new">
            <a className={styles.newQuestionButton}>
              <PlusIcon /> New Question
            </a>
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/">
            <a className={router.pathname === "/" ? styles.activeLink : ""}>
              <HomeIcon />
              <span className={styles.linkText}>Questions</span>
            </a>
          </Link>
        </div>
        <div>
          <h4 className={styles.navHeader}>Participating</h4>
          <div className={styles.links}>
            {/*TODO: replace sample data with user?.participating */}
            {participatingSampleData?.map((question) => {
              return (
                <Link
                  key={question.id}
                  href={question.slug ? `/question/${question.slug}` : "/"}
                >
                  <a
                    className={
                      router.pathname === `/question/${question.slug}`
                        ? styles.activeLink
                        : ""
                    }
                  >
                    <ChatIcon />
                    <span className={styles.linkText}>{question.title}</span>
                  </a>
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
