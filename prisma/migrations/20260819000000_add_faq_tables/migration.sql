-- CreateTable faq_chat_messages
CREATE TABLE "faq_chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable faq_session_summaries
CREATE TABLE "faq_session_summaries" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_session_summaries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "faq_session_summaries_session_id_key" UNIQUE ("session_id")
);
