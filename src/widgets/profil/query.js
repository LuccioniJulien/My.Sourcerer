import gql from "graphql-tag";

export default  gql`
query {
  user(login: ${process.env.REACT_APP_USER}) {
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