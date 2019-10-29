"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathJoin = pathJoin;
exports.addLeadingSlash = addLeadingSlash;
exports.stripLeadingSlash = stripLeadingSlash;
exports.hasBasename = hasBasename;
exports.stripBasename = stripBasename;

function pathJoin() {
  var separator = '/';
  var replace = new RegExp("".concat(separator, "{1,}"), 'g');

  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

  var result = parts.join(separator).replace(replace, separator);
  var tester = new RegExp('^https?:/');
  result = result.replace(tester, '$&/');
  return result;
}

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}

function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}

function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}

function stripBasename(path, prefix) {
  if (!prefix) return path;
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}