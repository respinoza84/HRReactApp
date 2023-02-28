"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.contextReducer = void 0;
var type_1 = require("type");
var initialState = {
    user: {
        entitlements: [],
        roles: []
    },
    organization: {
        settings: {},
        features: [],
        // betaFeatures only used for page header at the moment
        betaFeatures: []
    },
    sideNavigation: {
        items: []
    },
    isIe11: false,
    pageHeader: {
        pageModule: '',
        isBeta: false
    }
};
var contextReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case '@@context/USER_LOAD':
            return __assign(__assign({}, state), { user: action.payload });
        case '@@context/SIDE_NAVIGATION_LOAD':
            return __assign(__assign({}, state), { sideNavigation: __assign(__assign({}, state.sideNavigation), { items: action.payload }) });
        case '@@context/ORG_SETTINGS_LOAD':
            return __assign(__assign({}, state), { organization: __assign(__assign({}, state.organization), { settings: action.payload }) });
        case '@@context/ORG_SETTING_UPDATE':
            var settings = __assign({}, state.organization.settings);
            settings[action.payload.key] = action.payload.value;
            return __assign(__assign({}, state), { organization: __assign(__assign({}, state.organization), { settings: settings }) });
        case '@@context/ORG_FEATURES_LOAD':
            return __assign(__assign({}, state), { organization: __assign(__assign({}, state.organization), { features: action.payload.features, betaFeatures: action.payload.betaFeatures }) });
        case '@@context/SET_IE11':
            return __assign(__assign({}, state), { isIe11: action.payload });
        case '@@context/SET_PAGE_HEADER': {
            var feature = type_1.pageModuleFeatureMap.get(action.payload);
            var isBeta = !!(feature && state.organization.betaFeatures.includes(feature));
            return __assign(__assign({}, state), { pageHeader: {
                    pageModule: action.payload,
                    isBeta: isBeta
                } });
        }
        // eslint-disable-next-line no-fallthrough
        default:
            return state;
    }
};
exports.contextReducer = contextReducer;
