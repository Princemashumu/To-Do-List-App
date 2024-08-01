"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuthStatus = void 0;

var getAuthStatus = function getAuthStatus() {
  var token;
  return regeneratorRuntime.async(function getAuthStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Implement your logic to check if the user is authenticated
          token = localStorage.getItem('authToken'); // Example token check

          return _context.abrupt("return", !!token);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getAuthStatus = getAuthStatus;