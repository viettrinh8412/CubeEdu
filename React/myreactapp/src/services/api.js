'use strict';
import { message } from "antd";
import System from   '../common/SystemVar'
var $ = window.jQuery;
export default APIHelper;

function APIHelper(opt) {
  if (!(this instanceof APIHelper)) {
    return new APIHelper(opt);
  }

  opt = opt || {};

  if (!(opt.url)) {
    throw new Error('url is required');
  }

  this._setDefaultsOptions(opt);
}

APIHelper.prototype._setDefaultsOptions = function (opt) {
  this.url = opt.url;
  this.encoding = opt.encoding || 'utf8';
  this.port = opt.port || '';
};

//Common function
APIHelper.prototype.handleResponse = function (response) {

  return new Promise((resolve, reject) => {
    if (response.ok) {
      // return json if it was returned in the response
      var contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        response.json().then(json => resolve(json));
      } else {
        resolve();
      }
    } else {
      // return error message from response body
      response.text().then(text => reject(text));
    }
  });
}
APIHelper.prototype.handleError = function (error) {
  //$('#loadingOverlay').css('display', 'none');
  //toast.error(error && error.message && typeof error.message === 'string' ? error.message : 'Fail to load data from server!')
  return Promise.reject(error && error.message);
}


APIHelper.prototype._getUrl = function (endpoint) {
  var url = this.url + '/' + endpoint;

  // Include port.
  if ('' !== this.port) {
    var hostname = url.parse(url, true).hostname;
    url = url.replace(hostname, hostname + ':' + this.port);
  }

  return url;
};
APIHelper.prototype.getHeader = function () {
  //let user = JSON.parse(localStorage.getItem('User'));
   let user = JSON.parse(System.getItem("User"));
  if (!user) {
    user = {}
  }
  var header = {};

  header = { 'Token': user.Token ? user.Token : "", 'ShopName': user.Shop ? user.Shop : "", Accept: 'application/json' }

  // if (user) {
  //   header = { 'Token': user.Token, 'CenterName': user.CenterName, Accept: 'application/json' }
  // }
  return header;
}


APIHelper.prototype._request = function (method, endpoint, data, isFullUrl) {
  var url = this._getUrl(endpoint);
  if(isFullUrl){
    url=endpoint;
  }

  //debugger;
  var params = {
    method: method,
    headers: this.getHeader(),
  };
  if (data) {
    if (data instanceof FormData) {
      params.body = data;
    } else {
      params.headers['Content-Type'] = 'application/json;charset=utf-8';

      params.body = JSON.stringify(data);
    }
  }
  return fetch(url, params).then(this.handleResponse, this.handleError);
};
APIHelper.prototype.params = function (data) {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
}
/**
 * GET requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
APIHelper.prototype.get = function (endpoint) {
  return this._request('GET', endpoint, null);
};
APIHelper.prototype.getUrl = function (endpoint, data) {
  return this._request('GET', endpoint + "?" + this.params(data));
};
/**
 * POST requests
 *
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 *
 * @return {Object}
 */
APIHelper.prototype.post = function (endpoint, data,  isFullUrl) {

  if(typeof(isFullUrl) =="undefined" ){
    isFullUrl =false;
  }

  return this._request('POST', endpoint, data, isFullUrl);
};

APIHelper.prototype.postUrl = function (endpoint, data) {
  return this._request('POST', endpoint + "?" + this.params(data));
};
/**
 * PUT requests
 *
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 *
 * @return {Object}
 */
APIHelper.prototype.put = function (endpoint, data) {
  return this._request('PUT', endpoint, data);
};

/**
 * DELETE requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
APIHelper.prototype.delete = function (endpoint) {
  return this._request('DELETE', endpoint, null);
};

/**
 * OPTIONS requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
APIHelper.prototype.options = function (endpoint) {
  return this._request('OPTIONS', endpoint, null);
};

/**
 * Promifying all requests exposing new methods
 * named [method]Async like in getAsync()
 */
//promise.promisifyAll(WooCommerceAPI.prototype);
