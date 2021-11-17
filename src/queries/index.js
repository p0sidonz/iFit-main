import gql from "graphql-tag";

export const GET_TRAINEE = `
query MyQuery($where: Fitness_User_bool_exp = {}) {
  Fitness_User(where: $where) {
    id
    firstName
    username
    role
  }
}
`;

export const UPGRADE_USER = gql`
  mutation upgrade($value: String!) {
    upgrade(value: $value) {
      error
      ok
    }
  }
`;

export const DELETE_POST_BY_ID = gql`
  mutation deletePosts($postId: Int!) {
    delete_Fitness_Posts_by_pk(id: $postId) {
      id
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query iFitness($postId: Int!) {
    Fitness_Posts_by_pk(id: $postId) {
      id
      content
      photo
      created_at
      youLiked
      author {
        username
        id
        avatar
      }
      likedby_aggregate {
        aggregate {
          count
        }
      }
      likedby {
        authorOBJ {
          id
          username
          avatar
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments {
        id
        text
        owner {
          username
          avatar
          id
        }
      }
    }
  }
`;

export const GET_POST = gql`
  query iFitness($username: String!, $offset: Int, $limit: Int) {
    Fitness_Posts(
      where: { author: { username: { _eq: $username } } }
      offset: $offset
      limit: $limit
      order_by: { created_at: desc }
    ) {
      id
      content
      photo
      created_at
      youLiked
      author {
        username
        id
        avatar
      }
      likedby_aggregate {
        aggregate {
          count
        }
      }
      likedby {
        authorOBJ {
          id
          username
          avatar
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments {
        id
        text
        owner {
          username
          avatar
          id
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query MyQuery2 {
    Fitness_User {
      id
    }
  }
`;

export const GET_FOLLOWINGS = gql`
  query MyQuery($userId: Int!) {
    Fitness_Follow(where: { following_id: { _eq: $userId } }) {
      myfollowingObj {
        id
        username
        avatar
        fullname
      }
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query MyQuery($userId: Int!) {
    Fitness_Follow(where: { follower_id: { _eq: $userId } }) {
      myfollowersObj {
        id
        username
        avatar
        fullname
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query Fitness_User($username: String!) {
    Fitness_User(where: { username: { _eq: $username } }) {
      username
      firstName
      fullname
      id
      created_at
    }
  }
`;
