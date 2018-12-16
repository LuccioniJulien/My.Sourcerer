import gql from "graphql-tag";

export default gql`
query {
  user(login: ${process.env.REACT_APP_USER}){
    repositories(first: 100) {
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