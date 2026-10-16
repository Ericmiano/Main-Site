import { eventEndTime, events } from "@/data/site";

/**
 * Runs in <head> before anything is drawn. Anything marked
 * data-ends="<epoch ms>" (homepage event rows) disappears the moment that
 * time passes: hidden from the first paint once it's over, and on the spot if
 * the page is open when it ends. The prebuilt site is static, so this is what
 * takes an event off the homepage between uploads.
 */
export const TIMED_HIDE_SCRIPT = (() => {
  const ends = [...new Set(events.map(eventEndTime))].sort((a, b) => a - b);
  return `(function(){try{var e=${JSON.stringify(ends)},s=document.createElement("style");document.head.appendChild(s);function h(t){s.appendChild(document.createTextNode('[data-ends="'+t+'"]{display:none!important}'))}var n=Date.now();e.forEach(function(t){if(t<=n){h(t)}else if(t-n<2147483647){setTimeout(function(){h(t)},t-n)}})}catch(x){}})()`;
})();
