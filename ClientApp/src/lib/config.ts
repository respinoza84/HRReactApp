export const config = {
  deploymentEnvironment: process.env.REACT_APP_DEPLOYMENT_ENV,
  hrMangoUrl: process.env.REACT_APP_HRMANGO_URL,
  authServiceUrl: process.env.REACT_APP_AUTH_SERVICE_URL,
  requisitionServiceUrl: process.env.REACT_APP_REQ_SERVICE_URL,
  gatewayServiceUrl: process.env.REACT_APP_GATEWAY_SERVICE_URL,
  gatewayGraphUrl: process.env.REACT_APP_GATEWAY_GRAPH_URL,
  localDateLang: process.env.REACT_APP_LOCAL_DATE_LANG,
  disableServerCache: process.env.REACT_APP_DISABLE_SERVER_CACHE === 'true',
  disableAppCache: process.env.REACT_APP_DISABLE_APP_CACHE === 'true'
}

if (process.env.NODE_ENV === 'development') {
  console.warn(config)
}
