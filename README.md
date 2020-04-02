# Storybook Theme Knob

A decorator that, when applied, includes a theme knob as the first knob in the panel for all stories if used globally or for the stories outlined in each story config the decorator is used in.

## Usage
The following can be applied globally or in a story config:
```
addDecorator(withTheme([
    {
        id: 'Theme one',
        code:`<style>${require('!css-loader!../theme1.css')}</style>`,
        default: true
    },
    {
        id: 'Theme two',
        code:`<style>${require('!css-loader!../theme2.css')}</style>`,
        default: false
    },
    {
        id: 'Theme three',
        code:`<style>${require('!css-loader!../theme3.css')}</style>`,
        default: false
    },
]))
```
