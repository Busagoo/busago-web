-- CreateTable
CREATE TABLE "leads_voz" (
    "id" TEXT NOT NULL,
    "job_id" TEXT,
    "room_id" TEXT,
    "room" TEXT,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "summary" TEXT,
    "resultados" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_voz_pkey" PRIMARY KEY ("id")
);
