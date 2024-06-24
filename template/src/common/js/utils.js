/**
 * 获取url参数
 */
const getUrlParam = (name) => {
  const match = location.hash.match(/#[^?]+(\?.+)/);
  const u = window.location.search || (match && match[1]) || '',
    reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    r = u.substr(u.indexOf('?') + 1).match(reg);
  return r != null ? r[2] : '';
};

// 13位时间戳格式转化为 yyyy/m/dd h:m Am
const getDateTime = (timeStamp) => {
  const date = new Date(timeStamp),
    y = date.getFullYear();
  let minute = date.getMinutes(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours();
  m = m < 10 ? '0' + m : m;
  d = d < 10 ? '0' + d : d;
  minute = minute < 10 ? '0' + minute : minute;
  let unit = h < 12 ? 'AM' : 'PM';
  h = h < 12 ? h : h - 12;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ' ' + unit;
};
// id（hh.mm  dd/mm/yy）   eg:15.03  30/11/2021
// my (hh.mm  dd/mm/yy)    eg:15.03  30/11/2021
// ph（mm/dd/yy h:mm unit）  eg:11/30/2021  3:03pm
// za (hh:mm dd/mm/yyyy)   eg:15:03  30/11/2021
const getDateTime1 = (timeStamp, country) => {
  const date = new Date(timeStamp),
    y = date.getFullYear();
  let minute = date.getMinutes(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours();
  (m = m < 10 ? '0' + m : m), (d = d < 10 ? '0' + d : d);
  const h2 = h < 12 ? h : h - 12;
  minute = minute < 10 ? '0' + minute : minute;
  let unit = h < 12 ? 'am' : 'pm';
  h = h < 10 ? '0' + h : h;
  if (country === 'ph') {
    return `${m}/${d}/${y} ${h2}:${minute}${unit}`;
  } else if (country === 'za') {
    return `${h}:${minute} ${d}/${m}/${y}`;
  } else if (country == 'eg') {
    return `${d}/${m}/${y} ${h}:${minute}`;
  } else {
    return `${h}.${minute} ${d}/${m}/${y}`;
  }
};
const dynamicLoadJs = (url, attrObj, insertEl) => {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    for (let key in attrObj) {
      script[key] = attrObj[key];
    }
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    script.src = url;
    if (insertEl) {
      insertEl.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });
};

const getUUID = () => {
  return +new Date() + Math.random().toString(16).replace('.', '');
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

// 节流函数 每隔time执行一次函数
const throttle = function (fun, time = 100) {
  let base = 0;
  return function (...args) {
    let now = +new Date();
    if (now - base > time) {
      base = now;
      fun.apply(this, args);
    }
  };
};

/**
 * 动态添加css文件
 */
function loadStyles(url) {
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 毫秒值转换为hms
 * seconds:毫秒值 必填
 * type:modify 根据毫秒值自行匹配hms/dhm
 */
const formatTimeMap = (seconds, type = 'modify') => {
  if (seconds < 0) return;
  if (seconds > 3600 * 24 && type !== 'hms') {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return { d, h, m };
  } else {
    //超过24小时也要展示时分秒
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds / 60) % 60);
    const s = Math.floor(seconds % 60);
    return { h, m, s };
  }
};
function stInterval(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}

// 替换字符串或数组中的内容
function replaceString(strs, target, value) {
  if (!strs || !target || !value) return;
  if (Array.isArray(strs)) {
    return strs.map((item) => item.replace(new RegExp(target, 'g'), value));
  } else if (typeof strs === 'string') {
    return strs.replace(new RegExp(target, 'g'), value);
  }
}

// 通过图片上报归因
function logTrackImg(url) {
  if (!url) {
    console.log('logTrackImg - url is error!!!');
    return;
  }

  if (typeof url === 'string') {
    const imgReq = new Image();
    imgReq.src = url;
  } else if (Array.isArray(url)) {
    url.forEach((item) => {
      const imgReq = new Image();
      imgReq.src = item;
    });
  }
}

// 根据链接动态设置页面背景
function setDomBgColorByUrl({ el = '', defaultBgColor = '', defaultBgStart = '', defaultBgEnd = '' }) {
  const urlParams = new URLSearchParams(window.location.search);
  const bgColor = urlParams.get('bgColor');
  const bgStart = urlParams.get('bgStart');
  const bgEnd = urlParams.get('bgEnd');

  // console.log("bgColor", bgColor);
  // console.log("bgStart", bgStart);
  // console.log("bgEnd", bgEnd);

  let domEl = null;
  if (el) {
    if (typeof el === 'string') {
      domEl = document.querySelector(el);
    } else {
      domEl = el;
    }
  } else {
    domEl = document.querySelector('body');
  }

  // console.log("domEl", domEl);

  if (!domEl) return;

  if (bgColor) {
    // console.log("111");
    domEl.style.backgroundColor = decodeURIComponent(bgColor);
  } else if (bgStart && bgEnd) {
    // console.log("222");
    domEl.style.background = `linear-gradient(${decodeURIComponent(bgStart)}, ${decodeURIComponent(bgEnd)})`;
  }

  const isSetFromUrlParams = bgColor || (bgStart && bgEnd);
  // console.log("isSetFromUrlParams", isSetFromUrlParams);
  if (!isSetFromUrlParams) {
    // console.log(defaultBgColor);
    defaultBgColor && (domEl.style.backgroundColor = defaultBgColor);
    defaultBgStart && defaultBgEnd && (domEl.style.background = `linear-gradient(${defaultBgStart}, ${defaultBgEnd})`);
  }
}

/**
 *
 * @param {目标元素} el type: string or dom
 * @param {偏移} offset
 * @param {是否滚动到titlebar以下} reduceTitlebar
 * @returns
 */
const targetElScrollToTop = ({ el, offset = 0, reduceTitlebar = true, scrollEndCb = null }) => {
  try {
    console.log('id :>> ', el);
    const targetEl = typeof el === 'string' ? document.querySelector(el) : el;
    if (!targetEl) {
      console.log('dom not find !!!');
      return;
    }
    const targetElTop = targetEl.getBoundingClientRect().top;
    const nowScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    let titlebarHeight = 0;
    if (reduceTitlebar) {
      const titlebarEl = document.querySelector('.taskh5-titlebar');
      titlebarHeight = (titlebarEl && titlebarEl.offsetHeight) || 90;
    }
    // console.log("targetElTop :>> ", targetElTop);
    // console.log("nowScrollTop :>> ", nowScrollTop);
    // console.log("titlebarHeight :>> ", titlebarHeight);
    if (scrollEndCb && typeof scrollEndCb === 'function') {
      const cbName = `_scroll_callback_${new Date().getTime()}`;
      console.log('cbName :>> ', cbName);
      let timeout = null;
      window[cbName] = () => {
        console.log('滚动结束啦！');
        // 清除定时器
        clearTimeout(timeout);
        // 启动定时器
        timeout = setTimeout(function () {
          // 滚动结束后执行的逻辑
          scrollEndCb();
          // 清除监听器
          window.removeEventListener('scroll', window[cbName]);
        }, 200); // 设置定时器时间，单位为毫秒
      };
      window.addEventListener('scroll', window[cbName]);
    }
    const yPos = targetElTop + nowScrollTop - titlebarHeight + offset;
    // window.scroll({
    //   top: targetElTop + nowScrollTop - titlebarHeight + offset,
    //   left: 0,
    //   behavior: "smooth",
    // });
    console.log('执行了滚动 -- ', yPos);
    window.scroll(0, yPos);
  } catch (e) {
    console.log('e :>> ', e);
  }
};

// 滚动到目标组件
const scrollToTargetComp = (el) => {
  const targetEl = document.querySelector(el);
  if (!targetEl) return;
  let offset = 0;
  const targetElHeight = targetEl.offsetHeight;
  const screenHeight = window.screen.height;
  if (targetElHeight > 0 && screenHeight > targetElHeight) {
    offset = (screenHeight - targetElHeight) / 2;
    if (offset > 200) {
      offset = offset - 100;
    }
  }
  console.log('offset :>> ', offset);
  targetElScrollToTop({
    el,
    offset: -offset,
  });
};

const createElement = (tagName, attrs = {}) => {
  const el = document.createElement(tagName);
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
};

export {
  getUrlParam,
  getDateTime,
  getDateTime1,
  dynamicLoadJs,
  getUUID,
  debounce,
  throttle,
  loadStyles,
  getRandom,
  sleep,
  formatTimeMap,
  stInterval,
  logTrackImg,
  replaceString,
  setDomBgColorByUrl,
  targetElScrollToTop,
  scrollToTargetComp,
  createElement,
};
