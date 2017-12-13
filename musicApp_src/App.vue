<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from "./components/m-header/m-header"
import Tab from "./components/tab/tab"

export default {
  name: "app",
  components: {
    MHeader,Tab
  }
};

window.mobileUtil = (function(win, doc) {
  var UA = navigator.userAgent,
    isAndroid = /android|adr/gi.test(UA),
    isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
    isMobile = isAndroid || isIos; // 粗略的判断

  return {
    isAndroid: isAndroid,
    isIos: isIos,
    isMobile: isMobile,

    isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
    isWeixin: /MicroMessenger/gi.test(UA),
    isQQ: /QQ\/\d/gi.test(UA),
    isYixin: /YiXin/gi.test(UA),
    isWeibo: /Weibo/gi.test(UA),
    isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),

    tapEvent: isMobile ? "tap" : "click",

    /**
			 * 缩放页面
			 */
    fixScreen: function() {
      var metaEl = doc.querySelector('meta[name="viewport"]'),
        metaCtt = metaEl ? metaEl.content : "",
        matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/),
        matchWidth = metaCtt.match(/width=([^,\s]+)/);

      if (!metaEl) {
        // REM
        var docEl = doc.documentElement,
          maxwidth = docEl.dataset.mw || 750, // 每 dpr 最大页面宽度
          dpr = isIos ? Math.min(win.devicePixelRatio, 3) : 1,
          scale = 1 / dpr,
          tid;

        docEl.removeAttribute("data-mw");
        docEl.dataset.dpr = dpr;
        metaEl = doc.createElement("meta");
        metaEl.name = "viewport";
        metaEl.content = fillScale(scale);
        docEl.firstElementChild.appendChild(metaEl);

        var refreshRem = function() {
          var width = docEl.getBoundingClientRect().width;
          if (width / dpr > maxwidth) {
            width = maxwidth * dpr;
          }
          var rem = width / 16;
          docEl.style.fontSize = rem + "px";
        };

        win.addEventListener(
          "resize",
          function() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
          },
          false
        );
        win.addEventListener(
          "pageshow",
          function(e) {
            if (e.persisted) {
              clearTimeout(tid);
              tid = setTimeout(refreshRem, 300);
            }
          },
          false
        );

        refreshRem();
      } else if (
        isMobile &&
        !matchScale &&
        (matchWidth && matchWidth[1] != "device-width")
      ) {
        // 定宽
        var width = parseInt(matchWidth[1]),
          iw = win.innerWidth || width,
          ow = win.outerWidth || iw,
          sw = win.screen.width || iw,
          saw = win.screen.availWidth || iw,
          ih = win.innerHeight || width,
          oh = win.outerHeight || ih,
          ish = win.screen.height || ih,
          sah = win.screen.availHeight || ih,
          w = Math.min(iw, ow, sw, saw, ih, oh, ish, sah),
          scale = w / width;

        if (scale < 1) {
          metaEl.content = metaCtt + "," + fillScale(scale);
        }
      }

      function fillScale(scale) {
        return (
          "initial-scale=" +
          scale +
          ",maximum-scale=" +
          scale +
          ",minimum-scale=" +
          scale +
          ",user-scalable=no"
        );
      }
    },

    /**
			 * 转href参数成键值对
			 * @param href {string} 指定的href，默认为当前页href
			 * @returns {object} 键值对
			 */
    getSearch: function(href) {
      href = href || win.location.search;
      var data = {},
        reg = new RegExp("([^?=&]+)(=([^&]*))?", "g");
      href &&
        href.replace(reg, function($0, $1, $2, $3) {
          data[$1] = $3;
        });
      return data;
    }
  };
})(window, document);
// 默认直接适配页面
mobileUtil.fixScreen();
</script>

<style>
html {
  font-size: 46.875px;
}

* {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
}

body {
  width: 16rem;
  margin: 0 auto;
  font-family: Arial, "微软雅黑", sans-serif;
  font-size: 0.59733rem;
  background-color: #f5f5f5;
}

body,
div,
ul,
ol,
li,
h1,
h2,
h3,
h4,
p {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: 'music-icon';
  src: url("./common/fonts/music-icon.eot?2qevqt");
  src: url("./common/fonts/music-icon.eot?2qevqt#iefix") format("embedded-opentype"), 
  url("./common/fonts/music-icon.ttf?2qevqt") format("truetype"), 
  url("./common/fonts/music-icon.woff?2qevqt") format("woff"), 
  url("./common/fonts/music-icon.svg?2qevqt#music-icon") format("svg");
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"],
[class*=" icon-"] {
  font-family: "music-icon" !important;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  color: #d8d8d8;
  cursor: pointer;
}

.icon-ok:before {
  content: "\e900";
}

.icon-close:before {
  content: "\e901";
}

.icon-add:before {
  content: "\e902";
}

.icon-play-mini:before {
  content: "\e903";
}

.icon-playlist:before {
  content: "\e904";
}

.icon-music:before {
  content: "\e905";
}

.icon-search:before {
  content: "\e906";
}

.icon-clear:before {
  content: "\e907";
}

.icon-delete:before {
  content: "\e908";
}

.icon-favorite:before {
  content: "\e909";
}

.icon-not-favorite:before {
  content: "\e90a";
}

.icon-pause:before {
  content: "\e90b";
}

.icon-play:before {
  content: "\e90c";
}

.icon-prev:before {
  content: "\e90d";
}

.icon-loop:before {
  content: "\e90e";
}

.icon-sequence:before {
  content: "\e90f";
}

.icon-random:before {
  content: "\e910";
}

.icon-back:before {
  content: "\e911";
}

.icon-mine:before {
  content: "\e912";
}

.icon-next:before {
  content: "\e913";
}

.icon-dismiss:before {
  content: "\e914";
}

.icon-pause-mini:before {
  content: "\e915";
}
</style>
