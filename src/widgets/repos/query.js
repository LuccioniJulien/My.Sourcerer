import gql from "graphql-tag";

export default gql`
  query($endCursor: String, $startCursor: String, $first: Int, $last: Int) {
    user(login: ${process.env.REACT_APP_USER}) {
      avatarUrl
      login
      repositories(first: $first,last: $last, after: $endCursor,before: $startCursor) {
        nodes {
          name
          resourcePath
          description
          primaryLanguage {
            name
            color
          }
          collaborators(first: 5) {
            totalCount
            nodes {
              avatarUrl
              name
              login
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          primaryLanguage {
            name
            color
          }
          languages(first: 100) {
            totalCount
            nodes {
              name
              color
            }
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;