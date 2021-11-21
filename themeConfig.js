// Theme Colors
// Initially this will be blank. Later on when app is initialized we will assign bootstrap colors to this from CSS variables.
export const $themeColors = {}

// App Breakpoints
// Initially this will be blank. Later on when app is initialized we will assign bootstrap breakpoints to this object from CSS variables.
export const $themeBreakpoints = {}

// APP CONFIG
export const $themeConfig = {
  app: {
    appName: 'NingFitness', // Will update name in navigation menu (Branding)
    // eslint-disable-next-line global-require
    appLogoImage: require('@/assets/images/logo/logo.svg'), // Will update logo in navigation menu (Branding)
  },
  layout: {
    isRTL: false,
    skin: 'semi-dark', // light, dark, bordered, semi-dark
    routerTransition: 'fade-bottom', // zoom-fade, slide-fade, fade-bottom, fade, zoom-out, none
    type: 'horizontal', // vertical, horizontal
    contentWidth: 'boxed', // full, boxed
    menu: {
      hidden: true,
      isCollapsed: true,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'floating', // static , sticky , floating, hidden
      backgroundColor: '', // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static', // static, sticky, hidden
    },
    customizer: false,
    enableScrollToTop: false,
  },
}
