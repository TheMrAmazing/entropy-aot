import { VNode } from './vnode';
declare const _default: HyperScriptHelpers;
export default _default;
export declare type Children = Array<VNode | string | null>;
export declare type Properties = any;
export interface HyperScriptHelperFn {
	(): VNode;
	(textOrSelector: string): VNode;
	(children: Children): VNode;
	(properties: Properties): VNode;
	(selector: string, children: Children): VNode;
	(selector: string, text: string): VNode;
	(selector: string, properties: Properties): VNode;
	(properties: Properties, children: Children): VNode;
	(properties: Properties, text: string): VNode;
	(selector: string, properties: Properties, text: string): VNode;
	(selector: string, properties: Properties, children: Children): VNode;
}
export interface SVGHelperFn extends HyperScriptHelperFn {
	a: HyperScriptHelperFn;
	altGlyph: HyperScriptHelperFn;
	altGlyphDef: HyperScriptHelperFn;
	altGlyphItem: HyperScriptHelperFn;
	animate: HyperScriptHelperFn;
	animateColor: HyperScriptHelperFn;
	animateMotion: HyperScriptHelperFn;
	animateTransform: HyperScriptHelperFn;
	circle: HyperScriptHelperFn;
	clipPath: HyperScriptHelperFn;
	colorProfile: HyperScriptHelperFn;
	cursor: HyperScriptHelperFn;
	defs: HyperScriptHelperFn;
	desc: HyperScriptHelperFn;
	ellipse: HyperScriptHelperFn;
	feBlend: HyperScriptHelperFn;
	feColorMatrix: HyperScriptHelperFn;
	feComponentTransfer: HyperScriptHelperFn;
	feComposite: HyperScriptHelperFn;
	feConvolveMatrix: HyperScriptHelperFn;
	feDiffuseLighting: HyperScriptHelperFn;
	feDisplacementMap: HyperScriptHelperFn;
	feDistantLight: HyperScriptHelperFn;
	feFlood: HyperScriptHelperFn;
	feFuncA: HyperScriptHelperFn;
	feFuncB: HyperScriptHelperFn;
	feFuncG: HyperScriptHelperFn;
	feFuncR: HyperScriptHelperFn;
	feGaussianBlur: HyperScriptHelperFn;
	feImage: HyperScriptHelperFn;
	feMerge: HyperScriptHelperFn;
	feMergeNode: HyperScriptHelperFn;
	feMorphology: HyperScriptHelperFn;
	feOffset: HyperScriptHelperFn;
	fePointLight: HyperScriptHelperFn;
	feSpecularLighting: HyperScriptHelperFn;
	feSpotlight: HyperScriptHelperFn;
	feTile: HyperScriptHelperFn;
	feTurbulence: HyperScriptHelperFn;
	filter: HyperScriptHelperFn;
	font: HyperScriptHelperFn;
	fontFace: HyperScriptHelperFn;
	fontFaceFormat: HyperScriptHelperFn;
	fontFaceName: HyperScriptHelperFn;
	fontFaceSrc: HyperScriptHelperFn;
	fontFaceUri: HyperScriptHelperFn;
	foreignObject: HyperScriptHelperFn;
	g: HyperScriptHelperFn;
	glyph: HyperScriptHelperFn;
	glyphRef: HyperScriptHelperFn;
	hkern: HyperScriptHelperFn;
	image: HyperScriptHelperFn;
	line: HyperScriptHelperFn;
	linearGradient: HyperScriptHelperFn;
	marker: HyperScriptHelperFn;
	mask: HyperScriptHelperFn;
	metadata: HyperScriptHelperFn;
	missingGlyph: HyperScriptHelperFn;
	mpath: HyperScriptHelperFn;
	path: HyperScriptHelperFn;
	pattern: HyperScriptHelperFn;
	polygon: HyperScriptHelperFn;
	polyline: HyperScriptHelperFn;
	radialGradient: HyperScriptHelperFn;
	rect: HyperScriptHelperFn;
	script: HyperScriptHelperFn;
	set: HyperScriptHelperFn;
	stop: HyperScriptHelperFn;
	style: HyperScriptHelperFn;
	switch: HyperScriptHelperFn;
	symbol: HyperScriptHelperFn;
	text: HyperScriptHelperFn;
	textPath: HyperScriptHelperFn;
	title: HyperScriptHelperFn;
	tref: HyperScriptHelperFn;
	tspan: HyperScriptHelperFn;
	use: HyperScriptHelperFn;
	view: HyperScriptHelperFn;
	vkern: HyperScriptHelperFn;
}
export interface HyperScriptHelpers {
	svg: SVGHelperFn;
	a: HyperScriptHelperFn;
	abbr: HyperScriptHelperFn;
	address: HyperScriptHelperFn;
	area: HyperScriptHelperFn;
	article: HyperScriptHelperFn;
	aside: HyperScriptHelperFn;
	audio: HyperScriptHelperFn;
	b: HyperScriptHelperFn;
	base: HyperScriptHelperFn;
	bdi: HyperScriptHelperFn;
	bdo: HyperScriptHelperFn;
	blockquote: HyperScriptHelperFn;
	body: HyperScriptHelperFn;
	br: HyperScriptHelperFn;
	button: HyperScriptHelperFn;
	canvas: HyperScriptHelperFn;
	caption: HyperScriptHelperFn;
	cite: HyperScriptHelperFn;
	code: HyperScriptHelperFn;
	col: HyperScriptHelperFn;
	colgroup: HyperScriptHelperFn;
	dd: HyperScriptHelperFn;
	del: HyperScriptHelperFn;
	details: HyperScriptHelperFn;
	dfn: HyperScriptHelperFn;
	dialog: HyperScriptHelperFn;
	dir: HyperScriptHelperFn;
	div: HyperScriptHelperFn;
	dl: HyperScriptHelperFn;
	dt: HyperScriptHelperFn;
	em: HyperScriptHelperFn;
	embed: HyperScriptHelperFn;
	fieldset: HyperScriptHelperFn;
	figcaption: HyperScriptHelperFn;
	figure: HyperScriptHelperFn;
	footer: HyperScriptHelperFn;
	form: HyperScriptHelperFn;
	h1: HyperScriptHelperFn;
	h2: HyperScriptHelperFn;
	h3: HyperScriptHelperFn;
	h4: HyperScriptHelperFn;
	h5: HyperScriptHelperFn;
	h6: HyperScriptHelperFn;
	head: HyperScriptHelperFn;
	header: HyperScriptHelperFn;
	hgroup: HyperScriptHelperFn;
	hr: HyperScriptHelperFn;
	html: HyperScriptHelperFn;
	i: HyperScriptHelperFn;
	iframe: HyperScriptHelperFn;
	img: HyperScriptHelperFn;
	input: HyperScriptHelperFn;
	ins: HyperScriptHelperFn;
	kbd: HyperScriptHelperFn;
	keygen: HyperScriptHelperFn;
	label: HyperScriptHelperFn;
	legend: HyperScriptHelperFn;
	li: HyperScriptHelperFn;
	link: HyperScriptHelperFn;
	main: HyperScriptHelperFn;
	map: HyperScriptHelperFn;
	mark: HyperScriptHelperFn;
	menu: HyperScriptHelperFn;
	meta: HyperScriptHelperFn;
	nav: HyperScriptHelperFn;
	noscript: HyperScriptHelperFn;
	object: HyperScriptHelperFn;
	ol: HyperScriptHelperFn;
	optgroup: HyperScriptHelperFn;
	option: HyperScriptHelperFn;
	p: HyperScriptHelperFn;
	param: HyperScriptHelperFn;
	pre: HyperScriptHelperFn;
	progress: HyperScriptHelperFn;
	q: HyperScriptHelperFn;
	rp: HyperScriptHelperFn;
	rt: HyperScriptHelperFn;
	ruby: HyperScriptHelperFn;
	s: HyperScriptHelperFn;
	samp: HyperScriptHelperFn;
	script: HyperScriptHelperFn;
	section: HyperScriptHelperFn;
	select: HyperScriptHelperFn;
	small: HyperScriptHelperFn;
	source: HyperScriptHelperFn;
	span: HyperScriptHelperFn;
	strong: HyperScriptHelperFn;
	style: HyperScriptHelperFn;
	sub: HyperScriptHelperFn;
	summary: HyperScriptHelperFn;
	sup: HyperScriptHelperFn;
	table: HyperScriptHelperFn;
	tbody: HyperScriptHelperFn;
	td: HyperScriptHelperFn;
	textarea: HyperScriptHelperFn;
	tfoot: HyperScriptHelperFn;
	th: HyperScriptHelperFn;
	thead: HyperScriptHelperFn;
	time: HyperScriptHelperFn;
	title: HyperScriptHelperFn;
	tr: HyperScriptHelperFn;
	u: HyperScriptHelperFn;
	ul: HyperScriptHelperFn;
	video: HyperScriptHelperFn;
}
