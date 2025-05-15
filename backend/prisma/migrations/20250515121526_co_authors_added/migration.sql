-- CreateTable
CREATE TABLE "_ArticleCoAuthors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArticleCoAuthors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArticleCoAuthors_B_index" ON "_ArticleCoAuthors"("B");

-- AddForeignKey
ALTER TABLE "_ArticleCoAuthors" ADD CONSTRAINT "_ArticleCoAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleCoAuthors" ADD CONSTRAINT "_ArticleCoAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
