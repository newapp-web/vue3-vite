import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "path";
import pxtorem from "postcss-pxtorem";
import esbuild from "rollup-plugin-esbuild";
import { defineConfig, loadEnv } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { createHtmlPlugin } from "vite-plugin-html";
import viteSentry from "vite-plugin-sentry";
import pkg from "./package.json";
const pkgVersion = pkg.packageVersion || pkg.version; // 版本号（package.json中packageVersion或version）

const uploadSentrySourceMap = process.env.USE_SENTRY === "true"; //【Sentry】是否生成sourcemap

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()); // 加载 .env[.*] 配置文件
  /*
	sentry 配置
  */
  const sentryConfig = {
    url: "https://sentry.ushareit.org/",
    org: "shareit",
    project: "", // TODO: 项目名称
    authToken: "", // TODO: 项目token
    release: "version_" + pkgVersion, //每次发布修改的，设置sentry的release版本
    deploy: {
      env: env.VITE_ENVIRONMENT, // 环境变量
    },
    dryRun: !uploadSentrySourceMap, // 在测试、开发环境为true，空运行。 当发布时候为false。
    setCommits: {
      auto: true, // 自动获取commit信息
    },
    sourceMaps: {
      include: ["./dist/"],
      ignore: ["node_modules", "vite.config.js", "babel.config.js", "src"],
      urlPrefix: "~/",
    },
  };

  /**
   * 基础vite 配置
   */
  const commonConfig = {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@views": path.resolve(__dirname, "src/views"),
        "@components": path.resolve(__dirname, "src/components"),
        "@images": path.resolve(__dirname, "src/assets/images"),
        "@js": path.resolve(__dirname, "src/common/js"),
        "@scss": path.resolve(__dirname, "src/common/scss"),
        "@i18n": path.resolve(__dirname, "src/i18n"),
        "@apis": path.resolve(__dirname, "src/apis"),
        "@stores": path.resolve(__dirname, "src/stores"),
        "@routers": path.resolve(__dirname, "src/routers"),
        "@plugins": path.resolve(__dirname, "src/plugins"),
      },
    },
    server: {
      host: true,
      port: 8080,
      // open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      minify: true,
      sourcemap: uploadSentrySourceMap,
      manifest: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/common/scss/mixin.scss";',
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 36,
            unitPrecision: 5,
            propList: ["*"],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i,
          }),
        ],
      },
    },
    define: {
      // 定义全局变量
      APP_ENV: JSON.stringify(env),
      APP_VERSION: JSON.stringify(pkgVersion),
    },
    plugins: [
      vue(),
      {
        ...esbuild({
          target: "chrome70",
          // 如有需要可以在这里加 js ts 之类的其他后缀
          include: /\.(vue|js)$/,
          loaders: {
            ".vue": "js",
          },
        }),
        enforce: "post",
      },
      legacy(),
      createHtmlPlugin({
        minify: true,
        entry: "src/main.js",
        inject: {
          data: {
            title: env.VITE_TITLE,
          },
        },
      }),
      viteExternalsPlugin({
        // "lottie-web": "lottie",
      }),
    ],
  };
  if (uploadSentrySourceMap) {
    commonConfig.plugins.push(viteSentry(sentryConfig));
  }
  if (command === "serve") {
    return {
      ...commonConfig,
      // dev 独有配置
    };
  } else {
    // command === 'build'
    return {
      ...commonConfig,
      // build 独有配置
    };
  }
});
