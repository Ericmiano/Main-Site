// Starts the snake game on the cPanel build's /404.html. That page is plain
// HTML without the app's scripts (see scripts/cpanel-postbuild.mjs), so the
// game's markup is there but nothing runs it; this does, as /snake-404.js.
import { createSnake404 } from "@/components/ui/snake-404";
import { NOT_FOUND_SNAKE } from "@/components/site/not-found-snake";

const wrap = document.querySelector<HTMLElement>('[data-slot="snake-404"]');
const canvas = wrap?.querySelector("canvas");
if (wrap && canvas) createSnake404(wrap, canvas, NOT_FOUND_SNAKE);
