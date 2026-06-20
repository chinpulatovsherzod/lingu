"use client";

import { MentorChat } from "@/components/mentor/mentor-chat";
import { useI18n } from "@/components/i18n/locale-provider";

export default function MentorPage() {
  const { locale, t } = useI18n();
  const m = t.mentor;

  return (
    <div className="-m-4 flex h-[calc(100dvh-4.5rem)] flex-col overflow-hidden lg:-m-8">
      <MentorChat
        locale={locale}
        labels={{
          title: m.title,
          subtitle: m.subtitle,
          welcome: m.welcome,
          placeholder: m.placeholder,
          send: m.send,
          thinking: m.thinking,
          error: m.error,
        limitError: m.limitError,
        newChat: m.newChat,
        history: m.history,
        noChats: m.noChats,
        deleteChat: m.deleteChat,
        topics: m.topics,
          topicPrompts: m.topicPrompts,
        }}
      />
    </div>
  );
}
