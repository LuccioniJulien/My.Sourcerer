import gql from "graphql-tag";

export default  gql`
query($user: String!) {
  user(login: $user) {
    avatarUrl
    name
    bio
    login
    followers {
      totalCount
    }
    following {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
    }
    repositories(privacy: PUBLIC) {
      totalCount
    }
  }
}
`;