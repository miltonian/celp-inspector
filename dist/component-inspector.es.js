import pt, { forwardRef as Et, createElement as st, useState as p, useRef as at, useEffect as ee } from "react";
import Nt from "react-dom";
var Xe = { exports: {} }, Se = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ot;
function Ct() {
  if (ot)
    return Se;
  ot = 1;
  var j = pt, N = Symbol.for("react.element"), S = Symbol.for("react.fragment"), I = Object.prototype.hasOwnProperty, R = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, F = { key: !0, ref: !0, __self: !0, __source: !0 };
  function H(O, y, L) {
    var w, C = {}, z = null, fe = null;
    L !== void 0 && (z = "" + L), y.key !== void 0 && (z = "" + y.key), y.ref !== void 0 && (fe = y.ref);
    for (w in y)
      I.call(y, w) && !F.hasOwnProperty(w) && (C[w] = y[w]);
    if (O && O.defaultProps)
      for (w in y = O.defaultProps, y)
        C[w] === void 0 && (C[w] = y[w]);
    return { $$typeof: N, type: O, key: z, ref: fe, props: C, _owner: R.current };
  }
  return Se.Fragment = S, Se.jsx = H, Se.jsxs = H, Se;
}
var Re = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var it;
function St() {
  return it || (it = 1, {}.NODE_ENV !== "production" && function() {
    var j = pt, N = Symbol.for("react.element"), S = Symbol.for("react.portal"), I = Symbol.for("react.fragment"), R = Symbol.for("react.strict_mode"), F = Symbol.for("react.profiler"), H = Symbol.for("react.provider"), O = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), w = Symbol.for("react.suspense_list"), C = Symbol.for("react.memo"), z = Symbol.for("react.lazy"), fe = Symbol.for("react.offscreen"), Te = Symbol.iterator, Me = "@@iterator";
    function pe(e) {
      if (e === null || typeof e != "object")
        return null;
      var s = Te && e[Te] || e[Me];
      return typeof s == "function" ? s : null;
    }
    var G = j.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function h(e) {
      {
        for (var s = arguments.length, o = new Array(s > 1 ? s - 1 : 0), l = 1; l < s; l++)
          o[l - 1] = arguments[l];
        te("error", e, o);
      }
    }
    function te(e, s, o) {
      {
        var l = G.ReactDebugCurrentFrame, f = l.getStackAddendum();
        f !== "" && (s += "%s", o = o.concat([f]));
        var m = o.map(function(u) {
          return String(u);
        });
        m.unshift("Warning: " + s), Function.prototype.apply.call(console[e], console, m);
      }
    }
    var W = !1, Oe = !1, re = !1, V = !1, Ue = !1, me;
    me = Symbol.for("react.module.reference");
    function Ve(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === I || e === F || Ue || e === R || e === L || e === w || V || e === fe || W || Oe || re || typeof e == "object" && e !== null && (e.$$typeof === z || e.$$typeof === C || e.$$typeof === H || e.$$typeof === O || e.$$typeof === y || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === me || e.getModuleId !== void 0));
    }
    function Be(e, s, o) {
      var l = e.displayName;
      if (l)
        return l;
      var f = s.displayName || s.name || "";
      return f !== "" ? o + "(" + f + ")" : o;
    }
    function X(e) {
      return e.displayName || "Context";
    }
    function $(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && h("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case I:
          return "Fragment";
        case S:
          return "Portal";
        case F:
          return "Profiler";
        case R:
          return "StrictMode";
        case L:
          return "Suspense";
        case w:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case O:
            var s = e;
            return X(s) + ".Consumer";
          case H:
            var o = e;
            return X(o._context) + ".Provider";
          case y:
            return Be(e, e.render, "ForwardRef");
          case C:
            var l = e.displayName || null;
            return l !== null ? l : $(e.type) || "Memo";
          case z: {
            var f = e, m = f._payload, u = f._init;
            try {
              return $(u(m));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var k = Object.assign, ne = 0, se, $e, B, he, A, we, ge;
    function Z() {
    }
    Z.__reactDisabledLog = !0;
    function ke() {
      {
        if (ne === 0) {
          se = console.log, $e = console.info, B = console.warn, he = console.error, A = console.group, we = console.groupCollapsed, ge = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Z,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        ne++;
      }
    }
    function ae() {
      {
        if (ne--, ne === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: k({}, e, {
              value: se
            }),
            info: k({}, e, {
              value: $e
            }),
            warn: k({}, e, {
              value: B
            }),
            error: k({}, e, {
              value: he
            }),
            group: k({}, e, {
              value: A
            }),
            groupCollapsed: k({}, e, {
              value: we
            }),
            groupEnd: k({}, e, {
              value: ge
            })
          });
        }
        ne < 0 && h("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var oe = G.ReactCurrentDispatcher, K;
    function ie(e, s, o) {
      {
        if (K === void 0)
          try {
            throw Error();
          } catch (f) {
            var l = f.stack.trim().match(/\n( *(at )?)/);
            K = l && l[1] || "";
          }
        return `
` + K + e;
      }
    }
    var E = !1, c;
    {
      var Ae = typeof WeakMap == "function" ? WeakMap : Map;
      c = new Ae();
    }
    function P(e, s) {
      if (!e || E)
        return "";
      {
        var o = c.get(e);
        if (o !== void 0)
          return o;
      }
      var l;
      E = !0;
      var f = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var m;
      m = oe.current, oe.current = null, ke();
      try {
        if (s) {
          var u = function() {
            throw Error();
          };
          if (Object.defineProperty(u.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(u, []);
            } catch (T) {
              l = T;
            }
            Reflect.construct(e, [], u);
          } else {
            try {
              u.call();
            } catch (T) {
              l = T;
            }
            e.call(u.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (T) {
            l = T;
          }
          e();
        }
      } catch (T) {
        if (T && l && typeof T.stack == "string") {
          for (var d = T.stack.split(`
`), _ = l.stack.split(`
`), v = d.length - 1, b = _.length - 1; v >= 1 && b >= 0 && d[v] !== _[b]; )
            b--;
          for (; v >= 1 && b >= 0; v--, b--)
            if (d[v] !== _[b]) {
              if (v !== 1 || b !== 1)
                do
                  if (v--, b--, b < 0 || d[v] !== _[b]) {
                    var D = `
` + d[v].replace(" at new ", " at ");
                    return e.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", e.displayName)), typeof e == "function" && c.set(e, D), D;
                  }
                while (v >= 1 && b >= 0);
              break;
            }
        }
      } finally {
        E = !1, oe.current = m, ae(), Error.prepareStackTrace = f;
      }
      var je = e ? e.displayName || e.name : "", ue = je ? ie(je) : "";
      return typeof e == "function" && c.set(e, ue), ue;
    }
    function le(e, s, o) {
      return P(e, !1);
    }
    function Y(e) {
      var s = e.prototype;
      return !!(s && s.isReactComponent);
    }
    function U(e, s, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return P(e, Y(e));
      if (typeof e == "string")
        return ie(e);
      switch (e) {
        case L:
          return ie("Suspense");
        case w:
          return ie("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case y:
            return le(e.render);
          case C:
            return U(e.type, s, o);
          case z: {
            var l = e, f = l._payload, m = l._init;
            try {
              return U(m(f), s, o);
            } catch {
            }
          }
        }
      return "";
    }
    var ce = Object.prototype.hasOwnProperty, xe = {}, ve = G.ReactDebugCurrentFrame;
    function q(e) {
      if (e) {
        var s = e._owner, o = U(e.type, e._source, s ? s.type : null);
        ve.setExtraStackFrame(o);
      } else
        ve.setExtraStackFrame(null);
    }
    function De(e, s, o, l, f) {
      {
        var m = Function.call.bind(ce);
        for (var u in e)
          if (m(e, u)) {
            var d = void 0;
            try {
              if (typeof e[u] != "function") {
                var _ = Error((l || "React class") + ": " + o + " type `" + u + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[u] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw _.name = "Invariant Violation", _;
              }
              d = e[u](s, u, l, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (v) {
              d = v;
            }
            d && !(d instanceof Error) && (q(f), h("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", o, u, typeof d), q(null)), d instanceof Error && !(d.message in xe) && (xe[d.message] = !0, q(f), h("Failed %s type: %s", o, d.message), q(null));
          }
      }
    }
    var Ie = Array.isArray;
    function ye(e) {
      return Ie(e);
    }
    function Fe(e) {
      {
        var s = typeof Symbol == "function" && Symbol.toStringTag, o = s && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o;
      }
    }
    function Ke(e) {
      try {
        return Le(e), !1;
      } catch {
        return !0;
      }
    }
    function Le(e) {
      return "" + e;
    }
    function ze(e) {
      if (Ke(e))
        return h("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Fe(e)), Le(e);
    }
    var J = G.ReactCurrentOwner, We = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ee, de, be;
    be = {};
    function qe(e) {
      if (ce.call(e, "ref")) {
        var s = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Ne(e) {
      if (ce.call(e, "key")) {
        var s = Object.getOwnPropertyDescriptor(e, "key").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Je(e, s) {
      if (typeof e.ref == "string" && J.current && s && J.current.stateNode !== s) {
        var o = $(J.current.type);
        be[o] || (h('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', $(J.current.type), e.ref), be[o] = !0);
      }
    }
    function He(e, s) {
      {
        var o = function() {
          Ee || (Ee = !0, h("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: o,
          configurable: !0
        });
      }
    }
    function r(e, s) {
      {
        var o = function() {
          de || (de = !0, h("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var n = function(e, s, o, l, f, m, u) {
      var d = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: N,
        // Built-in properties that belong on the element
        type: e,
        key: s,
        ref: o,
        props: u,
        // Record the component responsible for creating this element.
        _owner: m
      };
      return d._store = {}, Object.defineProperty(d._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(d, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(d, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: f
      }), Object.freeze && (Object.freeze(d.props), Object.freeze(d)), d;
    };
    function a(e, s, o, l, f) {
      {
        var m, u = {}, d = null, _ = null;
        o !== void 0 && (ze(o), d = "" + o), Ne(s) && (ze(s.key), d = "" + s.key), qe(s) && (_ = s.ref, Je(s, f));
        for (m in s)
          ce.call(s, m) && !We.hasOwnProperty(m) && (u[m] = s[m]);
        if (e && e.defaultProps) {
          var v = e.defaultProps;
          for (m in v)
            u[m] === void 0 && (u[m] = v[m]);
        }
        if (d || _) {
          var b = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          d && He(u, b), _ && r(u, b);
        }
        return n(e, d, _, f, l, J.current, u);
      }
    }
    var i = G.ReactCurrentOwner, x = G.ReactDebugCurrentFrame;
    function g(e) {
      if (e) {
        var s = e._owner, o = U(e.type, e._source, s ? s.type : null);
        x.setExtraStackFrame(o);
      } else
        x.setExtraStackFrame(null);
    }
    var Q;
    Q = !1;
    function Ce(e) {
      return typeof e == "object" && e !== null && e.$$typeof === N;
    }
    function Ze() {
      {
        if (i.current) {
          var e = $(i.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function mt(e) {
      {
        if (e !== void 0) {
          var s = e.fileName.replace(/^.*[\\\/]/, ""), o = e.lineNumber;
          return `

Check your code at ` + s + ":" + o + ".";
        }
        return "";
      }
    }
    var Qe = {};
    function ht(e) {
      {
        var s = Ze();
        if (!s) {
          var o = typeof e == "string" ? e : e.displayName || e.name;
          o && (s = `

Check the top-level render call using <` + o + ">.");
        }
        return s;
      }
    }
    function et(e, s) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var o = ht(s);
        if (Qe[o])
          return;
        Qe[o] = !0;
        var l = "";
        e && e._owner && e._owner !== i.current && (l = " It was passed a child from " + $(e._owner.type) + "."), g(e), h('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, l), g(null);
      }
    }
    function tt(e, s) {
      {
        if (typeof e != "object")
          return;
        if (ye(e))
          for (var o = 0; o < e.length; o++) {
            var l = e[o];
            Ce(l) && et(l, s);
          }
        else if (Ce(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var f = pe(e);
          if (typeof f == "function" && f !== e.entries)
            for (var m = f.call(e), u; !(u = m.next()).done; )
              Ce(u.value) && et(u.value, s);
        }
      }
    }
    function gt(e) {
      {
        var s = e.type;
        if (s == null || typeof s == "string")
          return;
        var o;
        if (typeof s == "function")
          o = s.propTypes;
        else if (typeof s == "object" && (s.$$typeof === y || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        s.$$typeof === C))
          o = s.propTypes;
        else
          return;
        if (o) {
          var l = $(s);
          De(o, e.props, "prop", l, e);
        } else if (s.PropTypes !== void 0 && !Q) {
          Q = !0;
          var f = $(s);
          h("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", f || "Unknown");
        }
        typeof s.getDefaultProps == "function" && !s.getDefaultProps.isReactClassApproved && h("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function xt(e) {
      {
        for (var s = Object.keys(e.props), o = 0; o < s.length; o++) {
          var l = s[o];
          if (l !== "children" && l !== "key") {
            g(e), h("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), g(null);
            break;
          }
        }
        e.ref !== null && (g(e), h("Invalid attribute `ref` supplied to `React.Fragment`."), g(null));
      }
    }
    var rt = {};
    function nt(e, s, o, l, f, m) {
      {
        var u = Ve(e);
        if (!u) {
          var d = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (d += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var _ = mt(f);
          _ ? d += _ : d += Ze();
          var v;
          e === null ? v = "null" : ye(e) ? v = "array" : e !== void 0 && e.$$typeof === N ? (v = "<" + ($(e.type) || "Unknown") + " />", d = " Did you accidentally export a JSX literal instead of a component?") : v = typeof e, h("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", v, d);
        }
        var b = a(e, s, o, f, m);
        if (b == null)
          return b;
        if (u) {
          var D = s.children;
          if (D !== void 0)
            if (l)
              if (ye(D)) {
                for (var je = 0; je < D.length; je++)
                  tt(D[je], e);
                Object.freeze && Object.freeze(D);
              } else
                h("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              tt(D, e);
        }
        if (ce.call(s, "key")) {
          var ue = $(e), T = Object.keys(s).filter(function(kt) {
            return kt !== "key";
          }), Ge = T.length > 0 ? "{key: someKey, " + T.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!rt[ue + Ge]) {
            var wt = T.length > 0 ? "{" + T.join(": ..., ") + ": ...}" : "{}";
            h(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ge, ue, wt, ue), rt[ue + Ge] = !0;
          }
        }
        return e === I ? xt(b) : gt(b), b;
      }
    }
    function vt(e, s, o) {
      return nt(e, s, o, !0);
    }
    function yt(e, s, o) {
      return nt(e, s, o, !1);
    }
    var bt = yt, jt = vt;
    Re.Fragment = I, Re.jsx = bt, Re.jsxs = jt;
  }()), Re;
}
({}).NODE_ENV === "production" ? Xe.exports = Ct() : Xe.exports = St();
var t = Xe.exports, Pe = {}, _e = Nt;
if ({}.NODE_ENV === "production")
  Pe.createRoot = _e.createRoot, Pe.hydrateRoot = _e.hydrateRoot;
else {
  var Ye = _e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Pe.createRoot = function(j, N) {
    Ye.usingClientEntryPoint = !0;
    try {
      return _e.createRoot(j, N);
    } finally {
      Ye.usingClientEntryPoint = !1;
    }
  }, Pe.hydrateRoot = function(j, N, S) {
    Ye.usingClientEntryPoint = !0;
    try {
      return _e.hydrateRoot(j, N, S);
    } finally {
      Ye.usingClientEntryPoint = !1;
    }
  };
}
var Rt = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const _t = (j) => j.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), M = (j, N) => {
  const S = Et(
    ({ color: I = "currentColor", size: R = 24, strokeWidth: F = 2, absoluteStrokeWidth: H, children: O, ...y }, L) => st(
      "svg",
      {
        ref: L,
        ...Rt,
        width: R,
        height: R,
        stroke: I,
        strokeWidth: H ? Number(F) * 24 / Number(R) : F,
        className: `lucide lucide-${_t(j)}`,
        ...y
      },
      [
        ...N.map(([w, C]) => st(w, C)),
        ...(Array.isArray(O) ? O : [O]) || []
      ]
    )
  );
  return S.displayName = `${j}`, S;
}, lt = M("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]), ct = M("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]), Pt = M("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
]), Tt = M("EyeOff", [
  ["path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24", key: "1jxqfv" }],
  [
    "path",
    {
      d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",
      key: "9wicm4"
    }
  ],
  [
    "path",
    {
      d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",
      key: "1jreej"
    }
  ],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }]
]), Mt = M("Eye", [
  [
    "path",
    { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", key: "rwhkz3" }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]), Ot = M("Hand", [
  ["path", { d: "M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0", key: "aigmz7" }],
  ["path", { d: "M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2", key: "1n6bmn" }],
  ["path", { d: "M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8", key: "a9iiix" }],
  [
    "path",
    {
      d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
      key: "1s1gnw"
    }
  ]
]), dt = M("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]), $t = M("Layers", [
  ["polygon", { points: "12 2 2 7 12 12 22 7 12 2", key: "1b0ttc" }],
  ["polyline", { points: "2 17 12 22 22 17", key: "imjtdl" }],
  ["polyline", { points: "2 12 12 17 22 12", key: "5dexcv" }]
]), ut = M("Maximize", [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
]), At = M("MousePointer", [
  ["path", { d: "m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z", key: "y2ucgo" }],
  ["path", { d: "m13 13 6 6", key: "1nhxnf" }]
]), Dt = M("PanelRight", [
  [
    "rect",
    {
      width: "18",
      height: "18",
      x: "3",
      y: "3",
      rx: "2",
      ry: "2",
      key: "1m3agn"
    }
  ],
  ["line", { x1: "15", x2: "15", y1: "3", y2: "21", key: "1hpv9i" }]
]), It = M("Send", [
  ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
  ["path", { d: "M22 2 11 13", key: "nzbqef" }]
]), Ft = M("Server", [
  [
    "rect",
    {
      width: "20",
      height: "8",
      x: "2",
      y: "2",
      rx: "2",
      ry: "2",
      key: "ngkwjq"
    }
  ],
  [
    "rect",
    {
      width: "20",
      height: "8",
      x: "2",
      y: "14",
      rx: "2",
      ry: "2",
      key: "iecqi9"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
]), Lt = M("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function ft(...j) {
  return j.filter(Boolean).join(" ");
}
function zt({ children: j, enabled: N = !1 }) {
  const [S, I] = p(N), [R, F] = p(null), [H, O] = p(null), [y, L] = p({ x: 0, y: 0 }), [w, C] = p(!1), [z, fe] = p(null), [Te, Me] = p(/* @__PURE__ */ new Set()), [pe, G] = p(!0), [h, te] = p(!1), [W, Oe] = p(!1), re = at(null), V = at(null), [Ue, me] = p(!0), [Ve, Be] = p(!1), [X, $] = p(!1), [k, ne] = p("http://localhost:3001"), [se, $e] = p([]), [B, he] = p([]), [A, we] = p([]), [ge, Z] = p({}), [ke, ae] = p({}), [oe, K] = p({});
  p(""), p(null);
  const [ie, E] = p(!1);
  p(null);
  const [c, Ae] = p(null), [P, le] = p(null), [Y, U] = p(null), [ce, xe] = p(!1);
  ee(() => {
    const r = (n) => {
      n.altKey && n.shiftKey && n.key === "C" ? I((a) => !a) : n.altKey && n.shiftKey && n.key === "I" ? te((a) => !a) : n.altKey && n.shiftKey && n.key === "S" ? C((a) => !a) : n.altKey && n.shiftKey && n.key === "M" && (C(!0), xe(!0), $(!0));
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, []), ee(() => {
    const r = (n) => {
      if (n.data && typeof n.data == "object" && n.data.type === "TOGGLE_COMPONENT_SELECTION") {
        const { enabled: a } = n.data;
        a === !0 ? te(!0) : a === !1 && te(!1);
      }
    };
    return window.addEventListener("message", r), () => window.removeEventListener("message", r);
  }, []);
  const ve = (r) => {
    const n = Object.keys(r).find(
      (a) => a.startsWith("__reactFiber$") || a.startsWith("__reactInternalInstance$")
    );
    return n ? r[n] : null;
  }, q = (r) => {
    if (!r)
      return "Unknown";
    const { type: n } = r;
    return typeof n == "string" ? n : (n == null ? void 0 : n.displayName) || (n == null ? void 0 : n.name) || "Anonymous Component";
  }, De = (r) => {
    if (!r || !r.memoizedProps)
      return {};
    const { children: n, ...a } = r.memoizedProps;
    return a;
  }, Ie = (r, n = 0, a = 10) => {
    if (!r || n > a)
      return null;
    const x = {
      name: q(r),
      fiber: r,
      children: []
    };
    let g = r.child;
    for (; g; ) {
      const Q = Ie(g, n + 1, a);
      Q && x.children.push(Q), g = g.sibling;
    }
    return x;
  }, ye = (r) => {
    if (!r || !V.current)
      return;
    const n = r.getBoundingClientRect(), a = V.current;
    a.style.left = `${n.left}px`, a.style.top = `${n.top}px`, a.style.width = `${n.width}px`, a.style.height = `${n.height}px`, a.style.display = "block";
  }, Fe = (r) => {
    const n = ve(r);
    if (F({
      tagName: r.tagName.toLowerCase(),
      reactName: q(n),
      props: De(n),
      fiber: n,
      element: r
    }), Ae(null), le(null), U(null), me(!0), n) {
      const a = Ie(n);
      fe(a), a && Me(/* @__PURE__ */ new Set([`${a.name}-0`]));
    }
  }, Ke = () => {
    Oe(!0);
  };
  ee(() => {
    if (!S)
      return;
    const r = (a) => {
      var x;
      if (!S)
        return;
      const i = document.elementFromPoint(a.clientX, a.clientY);
      if (!i || i === re.current || i === V.current || (x = re.current) != null && x.contains(i) || i.hasAttribute("data-inspector-ui") || i.closest('[data-inspector-ui="true"]')) {
        V.current && (V.current.style.display = "none");
        return;
      }
      L({
        x: a.clientX,
        y: a.clientY
      }), (pe && h || W) && (O(i), ye(i));
    }, n = (a) => {
      var x;
      if (!S)
        return;
      const i = document.elementFromPoint(a.clientX, a.clientY);
      if (!(!i || i === re.current || i === V.current || (x = re.current) != null && x.contains(i) || i.hasAttribute("data-inspector-ui") || i.closest('[data-inspector-ui="true"]'))) {
        if (W) {
          a.preventDefault(), a.stopPropagation(), Fe(i), Oe(!1);
          try {
            const g = {
              type: "ELEMENT_SELECTED",
              element: {
                // ...element,
                tagName: i.tagName.toLowerCase(),
                reactName: q(ve(i)),
                id: i.id,
                className: i.className,
                dataset: JSON.stringify(i.dataset)
              }
            };
            window.parent.postMessage(g, "*"), console.log("Sent element selection message to parent:", g);
          } catch (g) {
            console.error("Error sending message to parent:", g);
          }
          return;
        }
        if (h) {
          a.preventDefault(), a.stopPropagation(), Fe(i);
          try {
            const g = {
              type: "ELEMENT_SELECTED",
              element: {
                // ...element,
                tagName: i.tagName.toLowerCase(),
                reactName: q(ve(i)),
                id: i.id,
                className: i.className,
                dataset: JSON.stringify(i.dataset)
              }
            };
            window.parent.postMessage(g, "*"), console.log("Sent element selection message to parent:", g);
          } catch (g) {
            console.error("Error sending message to parent:", g);
          }
        }
      }
    };
    return document.addEventListener("mousemove", r), document.addEventListener("click", n, { capture: !0 }), () => {
      document.removeEventListener("mousemove", r), document.removeEventListener("click", n, { capture: !0 });
    };
  }, [S, pe, w, h, W]);
  const Le = (r) => {
    Me((n) => {
      const a = new Set(n);
      return a.has(r) ? a.delete(r) : a.add(r), a;
    });
  }, ze = (r) => {
    let n = null;
    r.fiber.stateNode instanceof HTMLElement && (n = r.fiber.stateNode), n && (F({
      tagName: n.tagName.toLowerCase(),
      reactName: r.name,
      props: De(r.fiber),
      fiber: r.fiber,
      element: n
    }), ye(n), me(!0));
  }, J = ({
    title: r,
    icon: n,
    isExpanded: a,
    onToggle: i,
    children: x,
    className: g = ""
  }) => /* @__PURE__ */ t.jsxs("div", { className: `border-b ${g}`, children: [
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        className: "flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
        onClick: i,
        children: [
          /* @__PURE__ */ t.jsx("span", { className: "mr-2", children: a ? /* @__PURE__ */ t.jsx(lt, { size: 16 }) : /* @__PURE__ */ t.jsx(ct, { size: 16 }) }),
          /* @__PURE__ */ t.jsxs("span", { className: "flex items-center gap-2 font-medium", children: [
            n,
            r
          ] })
        ]
      }
    ),
    a && /* @__PURE__ */ t.jsx("div", { className: "p-3 pt-0 border-t border-gray-100 dark:border-gray-800", children: x })
  ] }), We = (r, n, a = "") => {
    const i = a ? `${a}-${n}` : String(n), x = `${r.name}-${i}`, g = Te.has(x);
    return /* @__PURE__ */ t.jsxs("div", { className: "select-none", children: [
      /* @__PURE__ */ t.jsxs(
        "div",
        {
          className: "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm",
          children: [
            /* @__PURE__ */ t.jsx(
              "span",
              {
                className: "mr-1",
                onClick: () => Le(x),
                children: r.children.length > 0 ? g ? /* @__PURE__ */ t.jsx(lt, { size: 14 }) : /* @__PURE__ */ t.jsx(ct, { size: 14 }) : /* @__PURE__ */ t.jsx("span", { className: "w-[14px] inline-block" })
              }
            ),
            /* @__PURE__ */ t.jsx(
              "span",
              {
                className: "font-medium flex-1",
                onClick: () => ze(r),
                children: r.name
              }
            )
          ]
        }
      ),
      g && r.children.length > 0 && /* @__PURE__ */ t.jsx("div", { className: "pl-4 border-l border-gray-200 dark:border-gray-700 ml-2", children: r.children.map((Q, Ce) => We(Q, Ce, i)) })
    ] }, x);
  }, Ee = () => /* @__PURE__ */ t.jsx("div", { className: "flex justify-center items-center py-4", children: /* @__PURE__ */ t.jsx("div", { className: "loader" }) }), de = async () => {
    try {
      E(!0);
      const n = await (await fetch(`${k}/api/servers`)).json();
      return $e(n.servers || []), he(n.activeConnections || []), E(!1), n;
    } catch (r) {
      return console.error("Error fetching MCP servers:", r), E(!1), { servers: [], activeConnections: [] };
    }
  }, be = async (r) => {
    try {
      E(!0);
      const a = await (await fetch(`${k}/api/servers/${r}/connect`, {
        method: "POST"
      })).json();
      return a.success && (B.includes(r) || he((i) => [...i, r]), A.includes(r) && Ne()), E(!1), a;
    } catch (n) {
      return console.error(`Error connecting to MCP server ${r}:`, n), E(!1), { success: !1, error: String(n) };
    }
  }, qe = async (r) => {
    try {
      E(!0);
      const a = await (await fetch(`${k}/api/servers/${r}/disconnect`, {
        method: "POST"
      })).json();
      return a.success && (he((i) => i.filter((x) => x !== r)), we((i) => i.filter((x) => x !== r)), Ne()), E(!1), a;
    } catch (n) {
      return console.error(`Error disconnecting from MCP server ${r}:`, n), E(!1), { success: !1, error: String(n) };
    }
  }, Ne = async () => {
    if (A.length === 0) {
      Z({});
      return;
    }
    try {
      E(!0);
      const r = {};
      for (const n of A)
        try {
          const i = await (await fetch(`${k}/api/servers/${n}/status`)).json();
          i.connected && i.tools && i.tools.length > 0 && (r[n] = i.tools);
        } catch (a) {
          console.error(`Error fetching tools for server ${n}:`, a);
        }
      Z(r), Je(), He(), E(!1);
    } catch (r) {
      console.error("Error fetching tools for selected MCP servers:", r), E(!1);
    }
  }, Je = async () => {
    if (A.length === 0) {
      ae({});
      return;
    }
    try {
      const r = {};
      for (const n of A)
        try {
          const i = await (await fetch(`${k}/api/servers/${n}/resources`)).json();
          i.resources && i.resources.length > 0 && (r[n] = i.resources);
        } catch (a) {
          console.log(`Server ${n} does not support resources:`, a);
        }
      ae(r);
    } catch (r) {
      console.error("Error fetching resources for selected MCP servers:", r);
    }
  }, He = async () => {
    if (A.length === 0) {
      K({});
      return;
    }
    try {
      const r = {};
      for (const n of A)
        try {
          const i = await (await fetch(`${k}/api/servers/${n}/prompts`)).json();
          i.prompts && i.prompts.length > 0 && (r[n] = i.prompts);
        } catch (a) {
          console.log(`Server ${n} does not support prompts:`, a);
        }
      K(r);
    } catch (r) {
      console.error("Error fetching prompts for selected MCP servers:", r);
    }
  };
  return ee(() => {
    X && de();
  }, [X]), ee(() => {
    (async () => {
      try {
        const n = await de();
        n != null && n.servers && n.servers.length > 0 && n.activeConnections.length === 0 && n.servers.length > 0 && await be(n.servers[0].id);
      } catch (n) {
        console.error("Error initializing MCP servers:", n);
      }
    })();
  }, []), ee(() => {
    X && A.length > 0 && Ne();
  }, [A, X]), ee(() => {
    (async () => {
      if (c) {
        E(!0);
        try {
          if (!A.includes(c))
            we((n) => [...n, c]);
          else {
            try {
              const a = await (await fetch(`${k}/api/servers/${c}/status`)).json();
              a.connected && a.tools && a.tools.length > 0 ? Z((i) => ({
                ...i,
                [c]: a.tools
              })) : a.connected && Z((i) => ({
                ...i,
                [c]: []
              }));
            } catch (n) {
              console.error(`Error fetching tools for server ${c}:`, n), Z((a) => ({
                ...a,
                [c]: []
              }));
            }
            try {
              const a = await (await fetch(`${k}/api/servers/${c}/resources`)).json();
              a.resources && a.resources.length > 0 ? ae((i) => ({
                ...i,
                [c]: a.resources
              })) : ae((i) => ({
                ...i,
                [c]: []
              }));
            } catch (n) {
              console.log(`Server ${c} does not support resources:`, n), ae((a) => ({
                ...a,
                [c]: []
              }));
            }
            try {
              const a = await (await fetch(`${k}/api/servers/${c}/prompts`)).json();
              a.prompts && a.prompts.length > 0 ? K((i) => ({
                ...i,
                [c]: a.prompts
              })) : K((i) => ({
                ...i,
                [c]: []
              }));
            } catch (n) {
              console.log(`Server ${c} does not support prompts:`, n), K((a) => ({
                ...a,
                [c]: []
              }));
            }
          }
        } catch (n) {
          console.error("Error loading data for component server:", n);
        } finally {
          E(!1);
        }
      }
    })();
  }, [c]), ee(() => {
    const r = document.createElement("style");
    return r.textContent = `
      .loader {
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #3498db;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, document.head.appendChild(r), () => {
      document.head.removeChild(r);
    };
  }, []), S ? /* @__PURE__ */ t.jsxs("div", { className: "relative w-full h-full", children: [
    j,
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        ref: re,
        className: "fixed inset-0 z-[9000] pointer-events-none",
        style: { cursor: h || W ? "crosshair" : "auto" },
        children: [
          /* @__PURE__ */ t.jsx(
            "div",
            {
              ref: V,
              className: "absolute border-2 border-blue-500 bg-blue-100 bg-opacity-10 pointer-events-none z-10",
              style: { display: "none" }
            }
          ),
          /* @__PURE__ */ t.jsxs(
            "div",
            {
              className: "absolute bg-blue-500 text-white px-2 py-1 text-xs rounded shadow-md pointer-events-none z-20",
              style: {
                left: y.x + 10,
                top: y.y + 10,
                display: (h || W) && !R ? "block" : "none"
              },
              children: [
                W ? "Click an element to inspect" : "Inspector Mode",
                " (Alt+Shift+C to toggle)"
              ]
            }
          ),
          /* @__PURE__ */ t.jsx(
            "div",
            {
              "data-inspector-ui": "true",
              className: "fixed bottom-4 left-4 z-[9999] pointer-events-auto",
              children: /* @__PURE__ */ t.jsx(
                "button",
                {
                  onClick: () => C((r) => !r),
                  className: "bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center",
                  title: "Toggle Inspector Sidebar",
                  children: /* @__PURE__ */ t.jsx(Dt, { size: 20 })
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        "data-inspector-ui": "true",
        className: ft(
          "fixed right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl z-[9999] overflow-auto transition-all duration-300 w-1/3 max-w-md min-w-64",
          w ? "translate-x-0" : "translate-x-full"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "p-4 border-b flex justify-between items-center", children: [
            /* @__PURE__ */ t.jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(dt, { size: 20 }),
              " Component Inspector"
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  onClick: () => te((r) => !r),
                  className: "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500",
                  title: h ? "Switch to interaction mode" : "Switch to inspect mode",
                  children: h ? /* @__PURE__ */ t.jsx(At, { size: 18 }) : /* @__PURE__ */ t.jsx(Ot, { size: 18 })
                }
              ),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  onClick: () => G((r) => !r),
                  className: "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500",
                  title: pe ? "Hide component boundaries" : "Show component boundaries",
                  children: pe ? /* @__PURE__ */ t.jsx(Mt, { size: 18 }) : /* @__PURE__ */ t.jsx(Tt, { size: 18 })
                }
              ),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  onClick: () => C(!1),
                  className: "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
                  children: /* @__PURE__ */ t.jsx(Lt, { size: 18 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "px-4 py-2 text-sm flex flex-col gap-2 border-b", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ t.jsx("span", { children: "Mode:" }),
                /* @__PURE__ */ t.jsx("span", { className: ft(
                  "font-medium px-2 py-0.5 rounded",
                  h ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                ), children: h ? "Inspect Elements" : "Normal Interaction" })
              ] }),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  onClick: () => te((r) => !r),
                  className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded",
                  children: "Switch Mode"
                }
              )
            ] }),
            /* @__PURE__ */ t.jsxs(
              "button",
              {
                onClick: Ke,
                className: "w-full mt-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center gap-2",
                disabled: W,
                children: [
                  /* @__PURE__ */ t.jsx(ut, { size: 16 }),
                  W ? "Picking Element..." : "Pick Element"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ t.jsx("div", { className: "overflow-auto", children: R ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              J,
              {
                title: "Component Details",
                icon: /* @__PURE__ */ t.jsx(dt, { size: 16 }),
                isExpanded: Ue,
                onToggle: () => me((r) => !r),
                children: /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Element Type" }),
                    /* @__PURE__ */ t.jsx("p", { className: "text-lg font-bold", children: R.tagName })
                  ] }),
                  /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "React Component" }),
                    /* @__PURE__ */ t.jsx("p", { className: "text-lg font-bold", children: R.reactName })
                  ] }),
                  /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsxs("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2", children: [
                      /* @__PURE__ */ t.jsx(Pt, { size: 16 }),
                      " Props"
                    ] }),
                    /* @__PURE__ */ t.jsx("pre", { className: "mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-sm", children: JSON.stringify(R.props, null, 2) })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ t.jsx(
              J,
              {
                title: "Component Tree",
                icon: /* @__PURE__ */ t.jsx($t, { size: 16 }),
                isExpanded: Ve,
                onToggle: () => Be((r) => !r),
                children: z ? /* @__PURE__ */ t.jsx("div", { className: "border rounded", children: We(z, 0) }) : /* @__PURE__ */ t.jsx("p", { className: "text-center py-4 text-gray-500 text-sm", children: "Component tree not available for this element" })
              }
            ),
            /* @__PURE__ */ t.jsx(
              J,
              {
                title: "MCP Integration",
                icon: /* @__PURE__ */ t.jsx(Ft, { size: 16 }),
                isExpanded: X,
                onToggle: () => $((r) => !r),
                children: /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
                  B.length === 0 ? /* @__PURE__ */ t.jsxs("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800/30", children: [
                    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-yellow-700 dark:text-yellow-400", children: "No MCP servers connected" }),
                    /* @__PURE__ */ t.jsx(
                      "button",
                      {
                        onClick: () => {
                          xe(!0), de();
                        },
                        className: "mt-2 text-xs px-3 py-1 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/30 text-yellow-800 dark:text-yellow-300 rounded",
                        children: "Configure MCP"
                      }
                    )
                  ] }) : null,
                  ce ? /* @__PURE__ */ t.jsxs("div", { className: "border-t pt-3 mt-3", children: [
                    /* @__PURE__ */ t.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                      /* @__PURE__ */ t.jsx("h3", { className: "text-sm font-medium", children: "MCP Settings" }),
                      /* @__PURE__ */ t.jsx(
                        "button",
                        {
                          onClick: () => xe(!1),
                          className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded",
                          children: "Hide Settings"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ t.jsx("div", { className: "mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400", children: [
                      /* @__PURE__ */ t.jsx("label", { htmlFor: "mcpApiUrl", children: "API URL:" }),
                      /* @__PURE__ */ t.jsx(
                        "input",
                        {
                          id: "mcpApiUrl",
                          type: "text",
                          value: k,
                          onChange: (r) => ne(r.target.value),
                          className: "flex-1 px-2 py-1 border rounded text-xs"
                        }
                      ),
                      /* @__PURE__ */ t.jsx(
                        "button",
                        {
                          onClick: de,
                          className: "px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs",
                          children: "Refresh"
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ t.jsxs("div", { className: "border rounded overflow-hidden mb-3", children: [
                      /* @__PURE__ */ t.jsx("h4", { className: "text-xs font-medium p-2 bg-gray-50 dark:bg-gray-800", children: "Available Servers" }),
                      ie && se.length === 0 ? Ee() : se.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-center py-4 text-gray-500 text-sm", children: "No servers configured" }) : /* @__PURE__ */ t.jsx("div", { className: "max-h-48 overflow-y-auto", children: se.map((r) => {
                        const n = B.includes(r.id);
                        return /* @__PURE__ */ t.jsxs(
                          "div",
                          {
                            className: "flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800",
                            children: [
                              /* @__PURE__ */ t.jsxs("div", { className: "flex-1", children: [
                                /* @__PURE__ */ t.jsx("div", { className: "font-medium text-sm", children: r.name || r.id }),
                                /* @__PURE__ */ t.jsx("div", { className: "text-xs text-gray-500", children: r.description || `Server for ${r.id}` })
                              ] }),
                              /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1", children: [
                                  /* @__PURE__ */ t.jsx("div", { className: `w-2 h-2 rounded-full ${n ? "bg-green-500" : "bg-red-500"}` }),
                                  /* @__PURE__ */ t.jsx("span", { className: "text-xs", children: n ? "Connected" : "Disconnected" })
                                ] }),
                                /* @__PURE__ */ t.jsx(
                                  "button",
                                  {
                                    className: `text-xs px-2 py-1 rounded ${n ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"}`,
                                    onClick: () => n ? qe(r.id) : be(r.id),
                                    children: n ? "Disconnect" : "Connect"
                                  }
                                )
                              ] })
                            ]
                          },
                          r.id
                        );
                      }) })
                    ] })
                  ] }) : null,
                  /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsx("label", { htmlFor: "mcp-server-select", className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Select MCP Server:" }),
                    /* @__PURE__ */ t.jsxs(
                      "select",
                      {
                        id: "mcp-server-select",
                        value: c || "",
                        onChange: (r) => {
                          Ae(r.target.value || null), le(null), U(null);
                        },
                        className: "w-full p-2 text-sm bg-white dark:bg-gray-800 border rounded",
                        disabled: B.length === 0,
                        children: [
                          /* @__PURE__ */ t.jsx("option", { value: "", children: "Choose a server..." }),
                          B.map((r) => {
                            const n = se.find((a) => a.id === r);
                            return /* @__PURE__ */ t.jsx("option", { value: r, children: (n == null ? void 0 : n.name) || r }, r);
                          })
                        ]
                      }
                    ),
                    B.length === 0 && /* @__PURE__ */ t.jsx("p", { className: "text-yellow-600 dark:text-yellow-400 text-xs mt-1", children: 'No servers connected. Use the "Configure MCP" button above to connect.' })
                  ] }),
                  c && /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsx("div", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Select Item Type:" }),
                    /* @__PURE__ */ t.jsxs("div", { className: "flex space-x-2", children: [
                      /* @__PURE__ */ t.jsx(
                        "button",
                        {
                          onClick: () => le("tool"),
                          className: `px-3 py-1.5 text-xs rounded ${P === "tool" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`,
                          children: "Tools"
                        }
                      ),
                      /* @__PURE__ */ t.jsx(
                        "button",
                        {
                          onClick: () => le("prompt"),
                          className: `px-3 py-1.5 text-xs rounded ${P === "prompt" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`,
                          children: "Prompts"
                        }
                      ),
                      /* @__PURE__ */ t.jsx(
                        "button",
                        {
                          onClick: () => le("resource"),
                          className: `px-3 py-1.5 text-xs rounded ${P === "resource" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`,
                          children: "Resources"
                        }
                      )
                    ] })
                  ] }),
                  c && P && /* @__PURE__ */ t.jsxs("div", { children: [
                    /* @__PURE__ */ t.jsxs("div", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
                      "Select ",
                      P === "tool" ? "Tool" : P === "prompt" ? "Prompt" : "Resource",
                      ":"
                    ] }),
                    /* @__PURE__ */ t.jsx("div", { className: "p-2 border rounded bg-gray-50 dark:bg-gray-800 max-h-40 overflow-y-auto", children: ie ? Ee() : P === "tool" ? ge[c] ? ge[c].length > 0 ? /* @__PURE__ */ t.jsx("div", { className: "flex flex-wrap gap-2", children: ge[c].map((r, n) => /* @__PURE__ */ t.jsx(
                      "div",
                      {
                        className: `px-2 py-1 text-xs rounded cursor-pointer ${Y === r ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"}`,
                        onClick: () => U(r),
                        title: r.description || "No description available",
                        children: r.name
                      },
                      n
                    )) }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "No tools available for this server" }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "Select a server with tools" }) : P === "prompt" ? oe[c] ? oe[c].length > 0 ? /* @__PURE__ */ t.jsx("div", { className: "flex flex-wrap gap-2", children: oe[c].map((r, n) => /* @__PURE__ */ t.jsx(
                      "div",
                      {
                        className: `px-2 py-1 text-xs rounded cursor-pointer ${Y === r ? "bg-blue-500 text-white" : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"}`,
                        onClick: () => U(r),
                        title: r.description || "No description available",
                        children: r.name
                      },
                      n
                    )) }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "No prompts available for this server" }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "Select a server with prompts" }) : P === "resource" ? ke[c] ? ke[c].length > 0 ? /* @__PURE__ */ t.jsx("div", { className: "flex flex-wrap gap-2", children: ke[c].map((r, n) => /* @__PURE__ */ t.jsx(
                      "div",
                      {
                        className: `px-2 py-1 text-xs rounded cursor-pointer ${Y === r ? "bg-blue-500 text-white" : "bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300"}`,
                        onClick: () => U(r),
                        title: r.description || "No description available",
                        children: r.name
                      },
                      n
                    )) }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "No resources available for this server" }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "Select a server with resources" }) : /* @__PURE__ */ t.jsx("p", { className: "text-gray-500 text-xs", children: "Select an item type first" }) })
                  ] }),
                  Y && /* @__PURE__ */ t.jsxs("div", { className: "p-3 border rounded bg-gray-50 dark:bg-gray-800", children: [
                    /* @__PURE__ */ t.jsxs("h4", { className: "text-sm font-medium mb-2", children: [
                      "Selected ",
                      P,
                      ":"
                    ] }),
                    /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
                      /* @__PURE__ */ t.jsx("span", { className: "text-xs font-medium", children: "Name:" }),
                      /* @__PURE__ */ t.jsx("span", { className: "text-xs ml-1", children: Y.name })
                    ] }),
                    Y.description && /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
                      /* @__PURE__ */ t.jsx("span", { className: "text-xs font-medium", children: "Description:" }),
                      /* @__PURE__ */ t.jsx("span", { className: "text-xs ml-1", children: Y.description })
                    ] }),
                    /* @__PURE__ */ t.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ t.jsxs(
                      "button",
                      {
                        className: "px-3 py-1.5 bg-blue-500 text-white rounded text-xs flex items-center gap-1 hover:bg-blue-600",
                        onClick: () => {
                          alert(`Would use ${P} "${Y.name}" with component "${R.reactName}"`);
                        },
                        children: [
                          /* @__PURE__ */ t.jsx(It, { size: 12 }),
                          "Use with Component"
                        ]
                      }
                    ) })
                  ] })
                ] })
              }
            )
          ] }) : /* @__PURE__ */ t.jsxs("div", { className: "p-8 text-center text-gray-500", children: [
            /* @__PURE__ */ t.jsx(ut, { className: "mx-auto mb-4", size: 32 }),
            /* @__PURE__ */ t.jsx("p", { children: "No element selected" }),
            /* @__PURE__ */ t.jsx("p", { className: "text-sm mt-2", children: 'Click the "Pick Element" button above to select an element' })
          ] }) }),
          /* @__PURE__ */ t.jsx("div", { className: "absolute bottom-4 left-4 text-sm text-gray-500", children: "Alt+Shift+C: toggle inspector | Alt+Shift+S: toggle sidebar | Alt+Shift+M: MCP" })
        ]
      }
    )
  ] }) : /* @__PURE__ */ t.jsx(t.Fragment, { children: j });
}
window.initComponentInspector = function() {
  const N = document.createElement("div");
  N.id = "component-inspector-container", document.body.appendChild(N), Pe.createRoot(N).render(
    /* @__PURE__ */ t.jsx(zt, { enabled: !0, children: /* @__PURE__ */ t.jsx("div", { style: { padding: "1rem", fontFamily: "sans-serif" }, children: "Your page now has the Component Inspector active." }) })
  );
};
export {
  zt as ComponentInspector
};
