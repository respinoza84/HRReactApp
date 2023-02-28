/*
  @author Oliver Zamora
  @description Updated hrmango theme
*/

// CONSTANTS
const white = '#FFF'
const yellow = '#FFCC33'
const systemGrey = '#616161'
const secondaryVariant = '#A7A8FF'
const grayDark = '#637791'
const grayLight = '#B9C3D0'
const lightVariant = '#32405F'
const darkGray = '#2E2C2E'
const lightGray = '#DADADA'
const paleBlueGray = '#AFB8C5'
const lightestBlueGray = '#E2E5E9'
const darkBlueGray = '#F9FAFC'
const blueGrayBackground = '#F5F6F8'
const error = '#B00020'
const grey = '#4D4D4D'
const green = '#009474'
const lightHomeGray = '#E6E6E6'
const info = '#0091D0'

const primary = {
  900: '#061A35',
  800: '#092A4D',
  700: '#0F3359',
  600: '#173B64',
  500: '#1E426B',
  400: '#425B7D',
  300: grayDark,
  200: '#8D9CB0',
  100: grayLight,
  50: '#E3E7EB'
}

const hrmangoBlue = {
  900: '#2600BE',
  800: '#2C20D7',
  700: '#3530E2',
  600: '#3F3DEF',
  500: '#4346FB',
  400: '#6166FF',
  300: '#7F85FF',
  200: secondaryVariant,
  100: '#CBCAFF',
  50: '#EAEAFF'
}

const secondary = {
  900: '#005C2C',
  800: '#007A49',
  700: '#008A57',
  600: '#009B67',
  500: '#00A974',
  400: '#00B987',
  300: '#00C99B',
  200: '#2ADBB8',
  100: '#95E9D4',
  50: '#D5F7EF'
}

const onSurfaceLight = {
  highEmphasis: 'rgba(0, 0, 0, 0.87)',
  mediumEmphasis: 'rgba(0, 0, 0, 0.54)',
  disabled: 'rgba(0, 0, 0, 0.38)'
}

const onSurfaceDark = {
  highEmphasis: 'rgba(255, 255, 255, 0.87)',
  mediumEmphasis: 'rgba(255, 255, 255, 0.6)',
  disabled: 'rgba(255, 255, 255, 0.38)'
}

export const spacing = {
  0: 0,
  4: 4,
  8: 8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  40: 40,
  44: 44,
  48: 48,
  240: 240
} as const

export const defaultErrorMsg =
  'Oops! Something went wrong. If the problem persists, please contact your customer success manager.'

const MUIzIndexes = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
}

export const zIndex = {
  minus: '-1',
  zero: 0,
  one: 1,
  abovePageLevel: 10,
  ...MUIzIndexes,
  pageSpinner: 1350
}

export const palette = {
  common: {
    black: '#000',
    white: white
  },
  primary: {
    light: lightVariant,
    main: primary[900],
    dark: '#000010',
    contrastText: white // OLD THEME
  },
  secondary: {
    light: secondaryVariant,
    main: '#009474', // secondary[400],
    dark: '#0B3BCB',
    contrastText: white // OLD THEME
  },
  tertiary: {
    light: '#71FFEA',
    main: hrmangoBlue[200],
    dark: '#00A888',
    contrastText: white // OLD THEME
  },
  error: {
    light: '#E94948',
    main: error,
    dark: '#790000',
    contrastText: white // OLD THEME
  },
  warning: {
    light: '#FFC947',
    main: '#FF9800',
    dark: '#C66900',
    contrastText: onSurfaceLight.highEmphasis // OLD THEME
  },
  info: {
    light: '#6EC6FF',
    main: '#2196F3',
    dark: '#0069C0',
    contrastText: white // OLD THEME
  },
  success: {
    light: '#80E27E',
    main: '#4CAF50',
    dark: '#087F23',
    contrastText: onSurfaceLight.highEmphasis // OLD THEME
  },
  grey: {
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#eeeeee',
    '300': '#e0e0e0',
    '400': '#bdbdbd',
    '500': '#9e9e9e',
    '600': '#757575',
    '700': systemGrey,
    '800': '#424242',
    '900': '#212121'
  },
  outline: {
    outline: 'rgba(0, 0, 0, 0.12)',
    outlineDark: 'rgba(255, 255, 255, 0.12)'
  },
  contrastThreshold: 3, // OLD THEME
  tonalOffset: 0.2, // OLD THEME
  text: {
    primary: darkGray, // OLD THEME
    secondary: 'rgba(46, 44, 46, 0.54)', // OLD THEME
    disabled: 'rgba(46, 44, 46, 0.38)', // OLD THEME
    hint: onSurfaceLight.disabled, // OLD THEME
    onLight: {
      high: onSurfaceLight.highEmphasis,
      medium: onSurfaceLight.mediumEmphasis,
      disabled: onSurfaceLight.disabled
    },
    onDark: {
      high: onSurfaceDark.highEmphasis,
      medium: onSurfaceDark.mediumEmphasis,
      disabled: onSurfaceDark.disabled
    }
  },
  divider: lightGray, // OLD THEME
  background: {
    surface: white,
    background: blueGrayBackground,
    backgroundAlt: darkBlueGray
  },
  action: {
    hover: 'rgba(46, 44, 46, 0.04)', // OLD THEME
    hoverOpacity: 0.04, // OLD THEME
    selected: 'rgba(46, 44, 46, 0.08)', // OLD THEME
    selectedOpacity: 0.08, // OLD THEME
    disabled: 'rgba(46, 44, 46, 0.26)', // OLD THEME
    disabledBackground: 'rgba(46, 44, 46, 0.12)', // OLD THEME
    disabledOpacity: 0.26, // OLD THEME
    focusOpacity: 0.12, // OLD THEME
    activatedOpacity: 0.12, // OLD THEME
    onLight: {
      hover: 'rgba(0, 0, 0, 0.04)',
      focused: 'rgba(0, 0, 0, 0.12)',
      pressed: 'rgba(0, 0, 0, 0.1)',
      dragged: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(0, 0, 0, 0.08)'
    },
    onDark: {
      hover: 'rgba(255, 255, 255, 0.04)',
      focused: 'rgba(255, 255, 255, 0.12)',
      pressed: 'rgba(255, 255, 255, 0.1)',
      dragged: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.08)'
    },
    branded: {
      hover: 'rgba(97, 102, 255, 0.04)',
      focused: 'rgba(97, 102, 255, 0.12)',
      pressed: 'rgba(97, 102, 255, 0.1)',
      dragged: 'rgba(97, 102, 255, 0.08)',
      selected: 'rgba(97, 102, 255, 0.08)'
    }
  }
}
export const fontWeight300 = 300
export const fontWeight400 = 400
export const fontWeight600 = 600
export const fontWeight800 = 800
export const fontFamily = 'Roboto'

const rgba02 = 'rgba(146, 146, 146, 0.2)'
const rgba014 = 'rgba(146, 146, 146, 0.14)'
const rgba012 = 'rgba(146, 146, 146, 0.12)'

export const shadows = [
  `none`,
  `0px 2px 1px -1px ${rgba02}, 0px 1px 1px 0px ${rgba014}, 0px 1px 3px 0px ${rgba012}`,
  `0px 3px 1px -2px ${rgba02}, 0px 2px 2px 0px ${rgba014}, 0px 1px 5px 0px ${rgba012}`,
  `0px 3px 3px -2px ${rgba02}, 0px 3px 4px 0px ${rgba014}, 0px 1px 8px 0px ${rgba012}`,
  `0px 2px 4px -1px ${rgba02}, 0px 4px 5px 0px ${rgba014}, 0px 1px 10px 0px ${rgba012}`,
  `0px 3px 5px -1px ${rgba02}, 0px 5px 8px 0px ${rgba014}, 0px 1px 14px 0px ${rgba012}`,
  `0px 3px 5px -1px ${rgba02}, 0px 6px 10px 0px ${rgba014}, 0px 1px 18px 0px ${rgba012}`,
  `0px 4px 5px -2px ${rgba02}, 0px 7px 10px 1px ${rgba014}, 0px 2px 16px 1px ${rgba012}`,
  `0px 5px 5px -3px ${rgba02}, 0px 8px 10px 1px ${rgba014}, 0px 3px 14px 2px ${rgba012}`,
  `0px 5px 6px -3px ${rgba02}, 0px 9px 12px 1px ${rgba014}, 0px 3px 16px 2px ${rgba012}`,
  `0px 6px 6px -3px ${rgba02}, 0px 10px 14px 1px ${rgba014}, 0px 4px 18px 3px ${rgba012}`,
  `0px 6px 7px -4px ${rgba02}, 0px 11px 15px 1px ${rgba014}, 0px 4px 20px 3px ${rgba012}`,
  `0px 7px 8px -4px ${rgba02}, 0px 12px 17px 2px ${rgba014}, 0px 5px 22px 4px ${rgba012}`,
  `0px 7px 8px -4px ${rgba02}, 0px 13px 19px 2px ${rgba014}, 0px 5px 24px 4px ${rgba012}`,
  `0px 7px 9px -4px ${rgba02}, 0px 14px 21px 2px ${rgba014}, 0px 5px 26px 4px ${rgba012}`,
  `0px 8px 9px -5px ${rgba02}, 0px 15px 22px 2px ${rgba014}, 0px 6px 28px 5px ${rgba012}`,
  `0px 8px 10px -5px ${rgba02}, 0px 16px 24px 2px ${rgba014}, 0px 6px 30px 5px ${rgba012}`,
  `0px 8px 11px -5px ${rgba02}, 0px 17px 26px 2px ${rgba014}, 0px 6px 32px 5px ${rgba012}`,
  `0px 9px 11px -5px ${rgba02}, 0px 18px 28px 2px ${rgba014}, 0px 7px 34px 6px ${rgba012}`,
  `0px 9px 12px -6px ${rgba02}, 0px 19px 29px 2px ${rgba014}, 0px 7px 36px 6px ${rgba012}`,
  `0px 10px 13px -6px ${rgba02}, 0px 20px 31px 3px ${rgba014}, 0px 8px 38px 7px ${rgba012}`,
  `0px 10px 13px -6px ${rgba02}, 0px 21px 33px 3px ${rgba014}, 0px 8px 40px 7px ${rgba012}`,
  `0px 10px 14px -6px ${rgba02}, 0px 22px 35px 3px ${rgba014}, 0px 8px 42px 7px ${rgba012}`,
  `0px 11px 14px -7px ${rgba02}, 0px 23px 36px 3px ${rgba014}, 0px 9px 44px 8px ${rgba012}`,
  `0px 11px 15px -7px ${rgba02}, 0px 24px 38px 3px ${rgba014}, 0px 9px 46px 8px ${rgba012}`
]

export const typography = {
  fontWeightRegular: fontWeight400,
  fontWeightMedium: fontWeight600,
  fontWeightBold: fontWeight800,
  fontSize: 16,
  fontFamily: fontFamily,
  h1: {
    fontFamily: fontFamily,
    fontWeight: fontWeight300,
    fontSize: 95,
    lineHeight: 1.18,
    letterSpacing: '-1.5px'
  },
  h2: {
    fontFamily: fontFamily,
    fontWeight: fontWeight300,
    fontSize: 59,
    lineHeight: 1.22,
    letterSpacing: '-.5px'
  },
  h3: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 48,
    lineHeight: 1.17
  },
  h4: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 34,
    lineHeight: 1.06
  },
  h5: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 28,
    lineHeight: 1.2,
    letterSpacing: 0.18
  },
  h6: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 24,
    lineHeight: 1.2,
    letterSpacing: 0.15
  },
  h7: {
    fontFamily: fontFamily,
    fontWeight: fontWeight300,
    fontSize: 14,
    lineHeight: 1.2,
    letterSpacing: 0.15
  },
  subtitle1: {
    fontFamily: fontFamily,
    fontWeight: fontWeight600,
    fontSize: 14,
    lineHeight: 1.428,
    letterSpacing: '0.25px'
  },
  subtitle2: {
    fontFamily: fontFamily,
    fontWeight: fontWeight600,
    fontSize: 12,
    lineHeight: 1.333,
    letterSpacing: '0.15px'
  },
  subtitle3: {
    fontFamily: fontFamily,
    fontWeight: fontWeight300,
    fontSize: 12,
    lineHeight: 1.333,
    letterSpacing: '0.15px'
  },
  body1: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 14,
    lineHeight: 1.428,
    letterSpacing: '0.15px'
  },
  body2: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 12,
    lineHeight: 1.5,
    letterSpacing: '0.10px'
  },
  button: {
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: '0.50px'
  },
  Infobutton: {
    backgroundColor: info,
    color: white,
    padding: '8px',
    borderRadius: '8px',
    boxShadow: shadows[7],
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: 1.25
  },
  buttonGreen: {
    backgroundColor: green,
    color: white,
    padding: '8px',
    borderRadius: '8px',
    boxShadow: shadows[7],
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: 1.25
  },
  editProfileButton: {
    backgroundColor: lightHomeGray,
    color: white,
    padding: '8px',
    borderRadius: '8px',
    boxShadow: shadows[7],
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: 1.25
  },
  buttonDense: {
    backgroundColor: '#1A1A1A',
    color: white,
    padding: '8px',
    boxShadow: shadows[7],
    fontFamily: fontFamily,
    fontWeight: fontWeight400,
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: 1.25,
    borderRadius: '8px'
  },
  caption: {
    fontFamily: fontFamily,
    fontWeight: fontWeight800,
    fontSize: 14,
    lineHeight: 1.4,
    letterSpacing: '0.15px'
  },
  overline: {
    fontFamily: fontFamily,
    fontWeight: fontWeight800,
    fontSize: 8,
    lineHeight: 1.5,
    letterSpacing: '0.25px'
  }
}

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1375,
    xl: 1600
  }
}

const overrides = {
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        borderColor: '#E6E8F0'
      }
    }
  }
}

export const tooltips = {
  tooltip: {
    transform: 'translateY(-50%)',
    backgroundColor: white,
    color: palette.text.primary,
    padding: spacing[8],
    borderRadius: '4px',
    boxShadow: shadows[6],
    zIndex: zIndex.one
  },
  arrowLeft: {
    display: 'block',
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '6px',
    height: '6px',
    background: white
  },
  arrowBottom: {
    display: 'block',
    content: '""',
    position: 'absolute',
    left: '50px',
    top: '100%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '12px',
    height: '12px',
    background: white
  },
  arrowTop: {
    display: 'block',
    content: '""',
    position: 'absolute',
    left: '50px',
    top: 0,
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '12px',
    height: '12px',
    background: white
  }
}

export const hrmangoColors = {
  white: white,
  dataRed: '#EB004E',
  grey: grey,
  menuBar: lightHomeGray,
  green: green,
  lightGrey: '#F2F2F2',
  dataGreen: '#16A78A',
  chartLime: '#B0FD89',
  yellow: '#FFCC33',
  outline: 'rgba(0, 0, 0, 0.12)',
  lightPurple: '#9B93FF',
  lightVariant: lightVariant,
  secondaryVariant: secondaryVariant,
  systemGrey: systemGrey,
  grayDark: grayDark,
  whiteBorderStyle: '1px solid' + white,
  tableBorderStyle: '1px solid' + paleBlueGray,
  primary: primary,
  secondary: secondary,
  hrmangoGreen: hrmangoBlue,
  onSurfaceLight: onSurfaceLight,
  onSurfaceDark: onSurfaceDark,
  blueGrayBackground: blueGrayBackground,
  serviceLine: {
    magenta: '#FF1A98',
    lilac: secondaryVariant,
    yellow: yellow,
    blue: '#469EFF',
    grayDark: grayDark,
    grayLight: grayLight,
    pink: '#FFAFDB',
    orange: '#FF9852',
    purple: '#A455FF'
  },
  loading: '#E6E8EC',
  darkGray: darkGray, // OLD THEME
  mediumGray: '#929292', // OLD THEME
  lightGray: lightGray, // OLD THEME
  lightestGray: '#EFEFEF', // OLD THEME
  blueGray: '#384E77', // OLD THEME
  coolBlueGray: '#7987A0', // OLD THEME
  paleBlueGray: paleBlueGray, // OLD THEME
  lightestBlueGray: lightestBlueGray, // OLD THEME
  darkBlueGray: darkBlueGray, // OLD THEME
  matrixLoading: '#38485D', // OLD THEME
  matrixAlt: '#1F3149', // OLD THEME
  dark: '#1A1A1A',
  info: '#0091D0'
}

export const hrmangoTheme = {
  typography: typography,
  palette: palette,
  hrmangoColors: hrmangoColors,
  breakpoints: breakpoints,
  overrides: overrides,
  zIndex: MUIzIndexes,
  tooltips: tooltips,
  shape: {
    borderRadius: spacing[0]
  },
  shadows
}

export interface ITheme {
  // TYPOGRAPHY
  fontFamily?: string

  // FONT SIZES
  t1: string
  t2: string
  t3: string
  t4: string

  // FONT WEIGHTS
  light: number
  regular: number
  semibold: number
  bold: number

  // BUBBLE
  bubbleBlue?: string
  bubbleHover?: string
  bubblePurple?: string

  // COLORS
  black?: string
  blue: string
  blueGray: string
  borderColor?: string
  darkestBlue?: string
  grayDark?: string
  grayLight?: string
  grayLightest: string
  grayMedium?: string
  darkPurple: string
  iconGray: string
  lavender: string
  lightTeal?: string
  lime: string
  magenta: string
  hrmangoBlue: string
  hrmangoPurple: string
  orange: string
  primary: string
  primaryLighter: string
  primaryLightest?: string
  rose: string
  smoke: string
  teal?: string
  textColor: string
  warmPurple: string
  warning: string
  white: string

  stackedBarChart: {
    dataColors: string[]
  }

  kebabChart: {
    dataColors: string[]
  }

  chart: {
    dataColors: string[]
    guideColor: string
  }

  inlineChart: {
    dataColors: string[]
    borderColor: string
    hoverBorderColor: string
    backgroundColor: string
    hoverBackgroundColor: string
  }

  // NAV SIDEBAR
  navSidebar: {
    purpleNavColor: string
  }
}
