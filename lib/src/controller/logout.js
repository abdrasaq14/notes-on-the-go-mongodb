"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookieOnLogout = void 0;
function clearCookieOnLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
}
exports.clearCookieOnLogout = clearCookieOnLogout;
