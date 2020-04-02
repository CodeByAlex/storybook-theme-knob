const knobs = require('@storybook/addon-knobs');

const STYLE_TAG_NAME = 'style'; 
const DIV_TAG_NAME = 'div'; 
const ID_PREFIX = 'storybook-theme-decorator'; 
const ID_NONE = 'none';
const THEME_KNOB_NAME = 'Theme';

/**
 * Function used to modify a style tags meda attribute
 * @param element 
 * @param enabled
 */
const changeMediaAttribute = (element: Element, enabled: boolean) => {
    const MAX_WIDTH_1PX = 'max-width: 1px';
    const MEDIA_ATTRIBUTE = 'media';
    const current = element.getAttribute(MEDIA_ATTRIBUTE); 
    if ((enabled && !current) || (!enabled && current === MAX_WIDTH_1PX)) { // don't do anything
        return;
    } else if (enabled && current === MAX_WIDTH_1PX) { // remove the attribute
        element.removeAttribute(MEDIA_ATTRIBUTE);
    } else if (enabled) { // add the disable attribute
        const value = current.replace(` and ${MAX_WIDTH_1PX}`, ''); element.setAttribute(MEDIA_ATTRIBUTE, value);
    } else { // modify the existing attribute so it disables
        const value = current ? `${current} and ${MAX_WIDTH_1PX}` : MAX_WIDTH_1PX; element.setAttribute(MEDIA_ATTRIBUTE, value);
    }
};

/**
 * Creates an element that contains a specified set of code
 * @param id 
 * @param code 
 */
const createElement = (id: string, code: string): HTMLElement => { 
    const element: HTMLElement = document.createElement(DIV_TAG_NAME); 
    element.setAttribute('id', `${ID_PREFIX}_${id}`); 
    element.innerHTML = code; return element; 
};

/**
 * Gets an element and creates it if it doesnt exist
 * @param id 
 * @param code 
 */
const getElement = (id: string, code: string) => { 
    const found: Element = document.querySelector(`[id="${ID_PREFIX}_${id}"]`); 
    return { element: found || createElement(id, code), created: !found }; 
};

/**
 * Updates style tags
 * @param id 
 * @param code 
 * @param value 
 */
const updateElement = (id: string, code: string, value: boolean) => { 
    const { element, created } = getElement(id, code); 
    element.querySelectorAll(STYLE_TAG_NAME).forEach(child => changeMediaAttribute(child, value)); 
    if (created) { 
        document.body.appendChild(element); 
    } 
};

/**
 * Gets a theme based on its id
 * @param themeId 
 * @param themes 
 */
const getThemeById = (themeId, themes: any[]) => { 
    return themes && themeId ? themes.filter(obj => obj.id === themeId)[0] : null; 
}

/** 
 * Adds the proper theme to the dom 
 * @param theme 
 */
const setTheme = (chosenTheme: any) => { 
    if (chosenTheme && chosenTheme.id) { 
        updateElement(chosenTheme.id, chosenTheme.code, true); 
    } 
}

/** 
 * Removes all themes from the dom 
 */
const resetTheme = (themeIds) => { 
    themeIds.forEach((themeId) => { 
        const elem = document.querySelector(`[id="${ID_PREFIX}_${themeId}"]`); 
        if (elem) { 
            elem.parentNode.removeChild(elem); 
        } 
    }); 
}

/**
 * decorator used to apply a theme knob to a story panel
 * @param themes 
 */
export const withTheme = (themes: any[]) => (storyFn, context) => { 
    const themeIds = [ID_NONE, ...themes.map(obj => obj.id)]; 
    const defaultTheme = themes ? themes.filter(obj => obj.default === true)[0] : ID_NONE; 
    const chosenTheme = getThemeById(knobs.select(THEME_KNOB_NAME, themeIds, defaultTheme.id), themes); 
    resetTheme(themeIds); 
    setTheme(chosenTheme); 
    return storyFn(context); 
};