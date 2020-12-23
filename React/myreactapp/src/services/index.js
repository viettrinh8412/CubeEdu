'use strict';
import { api_url } from "../config";
import _api from './api';
var APIHelper = new _api({
  url: api_url,
  port: ''
});
export { APIHelper };