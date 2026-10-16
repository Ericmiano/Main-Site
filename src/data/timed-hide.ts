import { eventEndTime, events } from "@/data/site";

/**
 * Runs in <head> before anything is drawn. Anything marked
 * data-ends="<epoch ms>" disappears the moment that time passes, and anything
 * marked data-from="<epoch ms>" stays hidden until then: on the first paint
 * when the time has already passed, and on the spot if the page is open when
 * it does. The prebuilt site is static, so this is what takes an event off
 * the homepage (and swaps the hero card back) between uploads. The times are
 * the events' end times.
 */
export const TIMED_HIDE_SCRIPT = (() => {
  const times = [...new Set(events.map(eventEndTime))].sort((a, b) => a - b);
  return `(function(){try{var e=${JSON.stringify(times)},d=document,n=Date.now();function css(r){var s=d.createElement("style");s.appendChild(d.createTextNode(r));d.head.appendChild(s);return s}e.forEach(function(t){var a='[data-ends="'+t+'"]{display:none!important}',b='[data-from="'+t+'"]{display:none!important}';if(t<=n){css(a)}else if(t-n<2147483647){var f=css(b);setTimeout(function(){css(a);f.remove()},t-n)}})}catch(x){}})()`;
})();
