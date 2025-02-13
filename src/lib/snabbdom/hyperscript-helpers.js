import { h } from './package/h.js'
function isValidString(param) {
	return typeof param === 'string' && param.length > 0
}
function isSelector(param) {
	return isValidString(param) && (param[0] === '.' || param[0] === '#')
}
function createTagFunction(tagName) {
	return function hyperscript(a, b, c) {
		const hasA = typeof a !== 'undefined'
		const hasB = typeof b !== 'undefined'
		const hasC = typeof c !== 'undefined'
		if (isSelector(a)) {
			if (hasB && hasC) {
				return h(tagName + a, b, c)
			}
			else if (hasB) {
				return h(tagName + a, b)
			}
			else {
				return h(tagName + a, {})
			}
		}
		else if (hasC) {
			return h(tagName + a, b, c)
		}
		else if (hasB) {
			return h(tagName, a, b)
		}
		else if (hasA) {
			return h(tagName, a)
		}
		else {
			return h(tagName, {})
		}
	}
}
const SVG_TAG_NAMES = [
	'a',
	'altGlyph',
	'altGlyphDef',
	'altGlyphItem',
	'animate',
	'animateColor',
	'animateMotion',
	'animateTransform',
	'circle',
	'clipPath',
	'colorProfile',
	'cursor',
	'defs',
	'desc',
	'ellipse',
	'feBlend',
	'feColorMatrix',
	'feComponentTransfer',
	'feComposite',
	'feConvolveMatrix',
	'feDiffuseLighting',
	'feDisplacementMap',
	'feDistantLight',
	'feFlood',
	'feFuncA',
	'feFuncB',
	'feFuncG',
	'feFuncR',
	'feGaussianBlur',
	'feImage',
	'feMerge',
	'feMergeNode',
	'feMorphology',
	'feOffset',
	'fePointLight',
	'feSpecularLighting',
	'feSpotlight',
	'feTile',
	'feTurbulence',
	'filter',
	'font',
	'fontFace',
	'fontFaceFormat',
	'fontFaceName',
	'fontFaceSrc',
	'fontFaceUri',
	'foreignObject',
	'g',
	'glyph',
	'glyphRef',
	'hkern',
	'image',
	'line',
	'linearGradient',
	'marker',
	'mask',
	'metadata',
	'missingGlyph',
	'mpath',
	'path',
	'pattern',
	'polygon',
	'polyline',
	'radialGradient',
	'rect',
	'script',
	'set',
	'stop',
	'style',
	'switch',
	'symbol',
	'text',
	'textPath',
	'title',
	'tref',
	'tspan',
	'use',
	'view',
	'vkern',
]
const svg = createTagFunction('svg')
SVG_TAG_NAMES.forEach(tag => {
	svg[tag] = createTagFunction(tag)
})
const TAG_NAMES = [
	'a',
	'abbr',
	'address',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'bdi',
	'bdo',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'dd',
	'del',
	'details',
	'dfn',
	'dialog',
	'dir',
	'div',
	'dl',
	'dt',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'footer',
	'form',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'head',
	'header',
	'hgroup',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'kbd',
	'keygen',
	'label',
	'legend',
	'li',
	'link',
	'main',
	'map',
	'mark',
	'menu',
	'meta',
	'nav',
	'noscript',
	'object',
	'ol',
	'optgroup',
	'option',
	'p',
	'param',
	'pre',
	'progress',
	'q',
	'rp',
	'rt',
	'ruby',
	's',
	'samp',
	'script',
	'section',
	'select',
	'small',
	'source',
	'span',
	'strong',
	'style',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	'title',
	'tr',
	'u',
	'ul',
	'video',
]
const exported = {
	SVG_TAG_NAMES,
	TAG_NAMES,
	svg,
	isSelector,
	createTagFunction,
}
TAG_NAMES.forEach(n => {
	exported[n] = createTagFunction(n)
	globalThis[n] = createTagFunction(n)
})
export default exported
