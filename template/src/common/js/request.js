import axios from 'axios';
import { networkStatus } from 'shareit-hybird-js-sdk';
import Toast from '@/components/common/Toast/index.js';
import i18n from '@/i18n';
import store from '@/store/index';
// 创建axios实例
const service = axios.create({});

/**
 * @name clientConfig
 * @description 请求自定义配置项
 * @param {Boolean} hideNetCheck - 是否关闭请求前网络状态检查
 * @param {String} noNetworkTip - 网络状态检查无网络时提示文案
 */
// request拦截器
service.interceptors.request.use(
  (config) => {
    // console.log("request config :>> ", config);
    const { clientConfig = {}, updateCommonParams } = config; // updateCommonParams 是否更新公共参数
    // 网络状态检查
    if (!clientConfig.hideNetCheck) {
      const netRes = networkStatus({ portal: 'web' });
      if (netRes && netRes.networkStatus === 'OFFLINE') {
        Toast(clientConfig.noNetworkTip || i18n.t('networkError') || 'No network, Please check network settings!');
        return Promise.reject(new Error(`Network Offline! Request url: ${config.url}`));
      }
    }

    // 公共参数
    let commonParams = {};
    if (!clientConfig.noCommonParams) {
      commonParams = store.state.commonParams;
      if (updateCommonParams || !commonParams) {
        store.commit('updateCommonParam');
        commonParams = store.state.commonParams;
      }
    }

    // eslint-disable-next-line no-prototype-builtins
    if (config.hasOwnProperty('params')) {
      config.params = {
        ...commonParams,
        ...config.params,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (config.hasOwnProperty('data')) {
      config.data = {
        ...commonParams,
        ...config.data,
      };
    }
    return config;
  },
  (error) => {
    Toast('Network error, Please try later!');
    return Promise.reject(error);
  }
);

// response 拦截器
const getOriginDataPathMap = ['/multi_word/getByAppLangAndScene'];
service.interceptors.response.use(
  (response) => {
    // console.log("response :>> ", response);
    const result_code = response?.data?.result_code;
    const {
      config: { url, clientConfig: { getOriginResponse } = {} },
    } = response;
    if (result_code === 200 || getOriginDataPathMap.includes(url) || getOriginResponse) {
      return response.data;
    }
    // else if (result_code === 20007) {
    //   // 设备一对一
    // }
    else {
      const apiErrorToast = i18n.t(`apiError_${url}_${result_code}`);
      if (apiErrorToast) {
        Toast(apiErrorToast);
        return Promise.reject(result_code);
      } else {
        if (i18n.t(`apiErrorDefault_${result_code}`)) {
          Toast(i18n.t(`apiErrorDefault_${result_code}`));
          return Promise.reject(result_code);
        } else {
          const defaultErrorToast = i18n.t('apiErrorDefault') || 'The system is busy, please try later.';
          Toast(`[${result_code}] ${defaultErrorToast}`);
          return Promise.reject(result_code);
        }
      }
    }
  },
  (error) => {
    if (typeof error === 'string' && error.indexOf('Network Offline! Request url') === -1) {
      Toast(`${i18n.t('apiErrorDefault')}`);
    }
    return Promise.reject(error);
  }
);

export default service;
