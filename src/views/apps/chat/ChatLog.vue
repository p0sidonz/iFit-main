<template>
  <div class="chats">
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.sender_id + String(index)"
      class="chat"
      :class="{
        'chat-left': msgGrp.sender_id === formattedChatData.contact.id,
      }"
    >
      <div class="chat-avatar">
        <b-avatar
          size="36"
          class="avatar-border-2 box-shadow-1"
          variant="transparent"
          :src="
            msgGrp.sender_id === formattedChatData.contact.id
              ? formattedChatData.contact.avatar
              : profileUserAvatar
          "
        />
      </div>
      <div class="chat-body">
        <div
          v-for="msgData in msgGrp.messages"
          :key="msgData.time"
          class="chat-content"
        >
          <p>{{ msgData.msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import { BAvatar } from "bootstrap-vue";

export default {
  components: {
    BAvatar,
  },
  props: {
    chatData: {
      type: Array,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    {
      {
        props.profileUserAvatar;
      }
    }
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.id,
        avatar: props.chatData.contact.avatar,
      };
      let chatLog = [];

      if (props.chatData.chat) {
        chatLog = props.chatData.chat.chat_messages;
      }

      const formattedChatLog = [];

      let chatMessageSenderId = chatLog[0] ? chatLog[0].sender_id : undefined;
      let msgGroup = {
        sender_id: chatMessageSenderId,
        messages: [],
      };
      console.log(msgGroup);
      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === undefined) {
          return;
        }
        if (chatMessageSenderId === msg.sender_id) {
          msgGroup.messages.push({
            msg: msg.content,
            time: msg.created_at,
          });
        } else {
          chatMessageSenderId = msg.sender_id;
          formattedChatLog.push(msgGroup);
          msgGroup = {
            sender_id: msg.sender_id,
            messages: [
              {
                msg: msg.content,
                time: msg.created_at,
              },
            ],
          };
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
      });

      return {
        formattedChatLog,
        contact,
        profileUserAvatar: props.profileUserAvatar,
      };
    });

    return {
      formattedChatData,
    };
  },
};
</script>

<style>
</style>
