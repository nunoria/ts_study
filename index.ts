/**********************entry*****************************/
import chapter3 from "./chapter3/index.js";
import chapter6 from "./chapter6/index.js";

interface Funcs {
    [key: string]: () => void;
}

interface Chapters {
    [key: string]: Funcs;
}

const chapters: Chapters = {
    3: chapter3,
    6: chapter6,
};

const args = process.argv.slice(2);
const chapterNum = args[0];
const subChapterNum = args[1];

if ((chapterNum in chapters) && (subChapterNum in chapters[chapterNum])) {
    console.clear();
    console.log(`====[${chapterNum}-${subChapterNum}]====`);
    chapters[chapterNum][subChapterNum]();
    // chapterFuncs[chapterNum]();
} else {
    console.log("챕터 함수 없음");
}