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
    repositories(first:100,privacy: PUBLIC) {
      totalCount
      nodes{
        primaryLanguage {
          name
          color
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount
                nodes {
                  additions
                  deletions
                }
              }
            }
          }
        }
      }
    }
  }
}
`;