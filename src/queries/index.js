import gql from "graphql-tag";

export const GET_SUBSCRIPTION_BY_ID = gql`
query getUpgradeDetail($id: Int!) {
  Fitness_upgrade_current_package(where: {user_id: {_eq: $id}}, order_by: {created_at: desc}) {
    id
    end_date
    start_date
    package_detail {
      id
      title
      subtitle
      monthlyPrice
      yearlyPrice
      subscription_days
    }
    created_at
  }
}

`;


export const DELETE_USERRELATION_BY_ID = gql`
  mutation MyMuxtation($id: Int!) {
    delete_Fitness_UserRelation_by_pk(id: $id) {
      id
    }
  }
`;

export const GET_FEED = gql`
  query notifyNewPosts($userId: Int!, $offset: Int) {
    Fitness_Posts(
      order_by: { created_at: desc }
      limit: 10
      offset: $offset
      where: {
        _or: [{ userId: { _neq: $userId } }]
        author: { Following: { myfollowingObj: { id: { _eq: $userId } } } }
      }
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
      comments(limit: 3, order_by: { created_at: desc }) {
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

export const GET_MEDICAL_INFO = gql`
  query MyQuery($id: Int!) {
    Fitness_UserRelation_by_pk(id: $id) {
      additional_profile_detail {
        profile_completed
        heart_condition
        instagram_id
        is_injured
        is_pregnant
        on_medication
        tell_us_more
        youtube_channel_id
        allergies
        current_goal
        facebook_id
        giveup_alchol
        have_asthma
        have_diabetes
        have_epilepsy
        have_joint_issue
        have_vertigo
      }
    }
  }
`;

export const IS_COMPLETED = gql`
  mutation MyMutation($profile_completed: Boolean!) {
    insert_Fitness_additional_profile_detail_one(
      object: { profile_completed: $profile_completed }
    ) {
      profile_completed
    }
  }
`;

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

export const CREATE_ADDITIONAL_DETAILS = gql`
  mutation MyMutation(
    $heart_condition: Boolean!
    $have_vertigo: Boolean!
    $have_asthma: Boolean!
    $have_diabetes: Boolean!
    $have_joint_issue: Boolean!
    $is_injured: Boolean!
    $on_medication: Boolean!
    $giveup_alchol: Boolean!
    $is_pregnant: Boolean
    $allergies: jsonb
    $tell_us_more: String!
    $instagram_id: String!
    $facebook_id: String!
    $current_goal: String!
    $relationship_id: Int!
    $have_epilepsy: Boolean!
    $profile_completed: Boolean
  ) {
    insert_Fitness_additional_profile_detail_one(
      object: {
        heart_condition: $heart_condition
        have_vertigo: $have_vertigo
        have_asthma: $have_asthma
        have_diabetes: $have_diabetes
        have_joint_issue: $have_joint_issue
        is_injured: $is_injured
        on_medication: $on_medication
        giveup_alchol: $giveup_alchol
        is_pregnant: $is_pregnant
        allergies: $allergies
        tell_us_more: $tell_us_more
        instagram_id: $instagram_id
        facebook_id: $facebook_id
        current_goal: $current_goal
        relationship_id: $relationship_id
        have_epilepsy: $have_epilepsy
        profile_completed: $profile_completed
      }
    ) {
      id
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
        is_follow
      }
    }
  }
`;

export const GET_NEW_USERS = gql`
  query NewMembers($not: Int) {
    Fitness_User(
      limit: 5
      order_by: { created_at: desc }
      where: { id: { _neq: $not } }
    ) {
      id
      fullname
      avatar
      username
      is_follow
    }
  }
`;

export const GET_PACKAGES = gql`
  query getPackages($user_id: Int!) {
    Fitness_trainer_package(
      where: { _and: { user_id: { _eq: $user_id }, status: { _eq: "Active" } } }
    ) {
      id
      title
      description
      amount
      currency
      subscription_days
      is_free
      status
      created_at
      User {
        id
        username
        fullname
        avatar
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
        is_follow
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
      avatar
      id
      created_at
      Follow_aggregate {
        aggregate {
          count
        }
      }
      Following_aggregate {
        aggregate {
          count
        }
      }
      Posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followingId: Int) {
    insert_Fitness_Follow_one(object: { following_id: $followingId }) {
      follower_id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation ($following_id: Int!) {
    delete_Fitness_Follow(where: { following_id: { _eq: $following_id } }) {
      affected_rows
    }
  }
`;
