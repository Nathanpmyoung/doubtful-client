import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import { Question } from "../../interfaces";
import { QuestionEditor } from "../QuestionEditor";
import styles from "./styles.module.css";
import { api } from "../../lib/http";
import { QuestionRightPane } from "../QuestionRightPane/QuestionRightPane";
import { QuestionHeader } from "../QuestionHeader/QuestionHeader";
import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";

export interface QuestionProps {
  user?: any;
  question: Question;
}

export const QuestionPage: NextPage<QuestionProps> = ({
  user,
  question: _question,
}: QuestionProps) => {
  const [question, setQuestion] = useState(_question);
  const [yDoc] = useState(new Y.Doc({ gc: false }));
  const router = useRouter();

  useEffect(() => {
    setQuestion(_question);
  }, [_question.id]);

  const refetchQuestion = useCallback(async () => {
    const q: Question = await api
      .url(`/question/${question.slug}`)
      .get()
      .json();
    setQuestion(q);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Question | Doubtful.</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QuestionHeader question={question} user={user} />
      <div className={styles.container}>
        <main className={styles.questionContainer}>
          <section className={styles.questionBody}>
            {!question.base ? (
              <div className={styles.makeSuggestionWrapper}>
                <div className={styles.makeSuggestion}>
                  <span>Got an idea?</span>
                  <button
                    className={styles.makeSuggestionButton}
                    onClick={async () => {
                      const branchName = prompt("Branch Name");
                      if (branchName) {
                        const branchSlug = branchName.trim().replace(/ /g, "-");
                        const createdBranch: Question = await api
                          .url(`/question/${question.slug}/branch/create`)
                          .post({ branchSlug })
                          .json();
                        router.push(
                          `/question/${question.slug}/${createdBranch.branchName}`
                        );
                      }
                    }}
                  >
                    Create Branch
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.makeSuggestionWrapper}>
                <div className={styles.makeSuggestion}>
                  <span>Editing</span>
                  <button
                    className={styles.makeSuggestionButton}
                    onClick={async () => {
                      await api
                        .url(
                          `/question/${question.base?.slug}/branch/${question.branchName}/propose`
                        )
                        .post({
                          summary: prompt("Briefly describe your changes..."),
                        })
                        .json();
                      router.push(`/question/${question.base?.slug}`);
                    }}
                  >
                    Propose Change
                  </button>
                </div>
              </div>
            )}

            <section>
              <QuestionEditor
                yDoc={yDoc}
                question={question}
                canEdit={true}
                user={user}
                onChange={() => {}}
              />
            </section>
          </section>
        </main>
        <QuestionRightPane
          question={question}
          user={user}
          refetch={refetchQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionPage;
