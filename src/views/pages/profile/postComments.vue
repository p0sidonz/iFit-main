<template>
  <div>
    <!-- comments -->
    <div
      v-for="(comment, ind) in data.postComments"
      :key="ind"
      class="d-flex align-items-start mb-1"
    >
      <b-avatar size="34" class="mt-25 mr-75" />
      <div class="profile-user-info w-100">
        <div class="d-flex align-items-center justify-content-between">
          <h6 class="mb-0">
            {{ comment.User.username.toUpperCase() }}
          </h6>
          <b-link class="text-body">
            <!-- <feather-icon
                icon="HeartIcon"
                size="18"
                class="mr-25"
                :class="comment.youLiked ? 'profile-likes' :'profile-icon'"
              /> -->
            <!-- <span class="text-muted align-middle">{{
                comment.likes_aggregate.aggregate.count
              }}</span> -->
          </b-link>
        </div>
        <small>{{ comment.text }}</small>
      </div>
    </div>
    <!--/ comments -->
    <!-- comment box -->
    <b-form-group>
      <b-form-textarea
        v-model="AddNewCommentData.text"
        rows="3"
        placeholder="Post a comment..."
      />
    </b-form-group>
    <!--/ comment box -->
  </div>
</template>