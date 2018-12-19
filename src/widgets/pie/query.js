import gql from "graphql-tag";

export default gql`
query($user: String!,$nb :Int!) {
  user(login: $user){
    repositories(first: $nb) {
      nodes {
        name
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
      totalCount
    }
  }
}
`;