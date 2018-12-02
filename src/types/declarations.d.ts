declare module '@storybook/react'
declare module '@storybook/addon-actions'
declare module '@storybook/addon-knobs'
declare module '@storybook/addon-info'
declare module '@storybook/addon-knobs/react'
declare module 'jsx-control-statements' {
  export const If: ComponentType<{ condition: boolean }>
  export const For: ComponentType<{ each: string; index: string; of: Array<any> }>
  export const Choose: ComponentType<{}>
  export const When: ComponentType<{ condition: boolean }>
  export const Otherwise: ComponentType<{}>
}
