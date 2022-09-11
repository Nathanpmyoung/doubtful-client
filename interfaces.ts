export interface Profile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface QuestionActivity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  question: Question;
  type: "comment" | "branch";
  actor: Profile;
  relatedActivity: QuestionActivity;
  content: any; // TODO
}

export interface Question {
  base?: Question;
  branchName?: string;

  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  collaborationMode: string; // TODO: Enum
  title: string;
  content?: { id: string; content: { data: Buffer } };
  score: number;
  owner: Profile;
  editors: Profile[];
  contributors: Profile[];
  activity: QuestionActivity[];
}
