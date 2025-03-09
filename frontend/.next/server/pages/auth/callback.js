"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/auth/callback";
exports.ids = ["pages/auth/callback"];
exports.modules = {

/***/ "./pages/auth/callback.js":
/*!********************************!*\
  !*** ./pages/auth/callback.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthCallback = ()=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const { token  } = router.query;\n        if (token) {\n            // Store the JWT in localStorage and extract username\n            try {\n                const payload = JSON.parse(atob(token.split(\".\")[1]));\n                if (payload.username) {\n                    localStorage.setItem(\"username\", payload.username);\n                }\n            } catch  {\n            // ignore decode errors\n            }\n            localStorage.setItem(\"token\", token);\n            router.replace(\"/dashboard\");\n        }\n    }, [\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n        className: \"p-4\",\n        children: \"Logging in via GitHub...\"\n    }, void 0, false, {\n        fileName: \"C:\\\\source\\\\repos\\\\git-paid\\\\frontend\\\\pages\\\\auth\\\\callback.js\",\n        lineNumber: 24,\n        columnNumber: 10\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthCallback);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9hdXRoL2NhbGxiYWNrLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQXlDO0FBQ0Q7QUFFeEMsTUFBTUcsZUFBZSxJQUFNO0lBQ3pCLE1BQU1DLFNBQVNGLHNEQUFTQTtJQUV4QkQsZ0RBQVNBLENBQUMsSUFBTTtRQUNkLE1BQU0sRUFBRUksTUFBSyxFQUFFLEdBQUdELE9BQU9FLEtBQUs7UUFDOUIsSUFBSUQsT0FBTztZQUNULHFEQUFxRDtZQUNyRCxJQUFJO2dCQUNGLE1BQU1FLFVBQVVDLEtBQUtDLEtBQUssQ0FBQ0MsS0FBS0wsTUFBTU0sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuRCxJQUFJSixRQUFRSyxRQUFRLEVBQUU7b0JBQ3BCQyxhQUFhQyxPQUFPLENBQUMsWUFBWVAsUUFBUUssUUFBUTtnQkFDbkQsQ0FBQztZQUNILEVBQUUsT0FBTTtZQUNOLHVCQUF1QjtZQUN6QjtZQUNBQyxhQUFhQyxPQUFPLENBQUMsU0FBU1Q7WUFDOUJELE9BQU9XLE9BQU8sQ0FBQztRQUNqQixDQUFDO0lBQ0gsR0FBRztRQUFDWDtLQUFPO0lBRVgscUJBQU8sOERBQUNZO1FBQUVDLFdBQVU7a0JBQU07Ozs7OztBQUM1QjtBQUVBLGlFQUFlZCxZQUFZQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ2l0aHViLWJvdW50eS1mcm9udGVuZC8uL3BhZ2VzL2F1dGgvY2FsbGJhY2suanM/OGRhOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuXG5jb25zdCBBdXRoQ2FsbGJhY2sgPSAoKSA9PiB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgeyB0b2tlbiB9ID0gcm91dGVyLnF1ZXJ5O1xuICAgIGlmICh0b2tlbikge1xuICAgICAgLy8gU3RvcmUgdGhlIEpXVCBpbiBsb2NhbFN0b3JhZ2UgYW5kIGV4dHJhY3QgdXNlcm5hbWVcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGF0b2IodG9rZW4uc3BsaXQoJy4nKVsxXSkpO1xuICAgICAgICBpZiAocGF5bG9hZC51c2VybmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VybmFtZScsIHBheWxvYWQudXNlcm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gaWdub3JlIGRlY29kZSBlcnJvcnNcbiAgICAgIH1cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHRva2VuKTtcbiAgICAgIHJvdXRlci5yZXBsYWNlKCcvZGFzaGJvYXJkJyk7XG4gICAgfVxuICB9LCBbcm91dGVyXSk7XG5cbiAgcmV0dXJuIDxwIGNsYXNzTmFtZT1cInAtNFwiPkxvZ2dpbmcgaW4gdmlhIEdpdEh1Yi4uLjwvcD47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoQ2FsbGJhY2s7XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJBdXRoQ2FsbGJhY2siLCJyb3V0ZXIiLCJ0b2tlbiIsInF1ZXJ5IiwicGF5bG9hZCIsIkpTT04iLCJwYXJzZSIsImF0b2IiLCJzcGxpdCIsInVzZXJuYW1lIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInJlcGxhY2UiLCJwIiwiY2xhc3NOYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/auth/callback.js\n");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/auth/callback.js"));
module.exports = __webpack_exports__;

})();