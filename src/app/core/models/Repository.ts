export enum RepoType {
  OTHER,
  GITHUB,
  GITLAB,
}

export class Repository {
  name: String;
  path: String;
  type: RepoType;
}
