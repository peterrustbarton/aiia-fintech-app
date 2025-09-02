-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "condition" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reportType" VARCHAR(255) NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alerts_userId_idx" ON "public"."alerts"("userId");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "public"."reports"("userId");

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
