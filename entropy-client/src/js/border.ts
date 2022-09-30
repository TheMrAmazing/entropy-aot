
interface AsciiBorderChars {
    n: string
    e: string
    s: string
    w: string
    ne: string
    nw: string
    se: string
    sw: string
}

export interface AsciiBorder {
    chars: AsciiBorderChars
    foreground: string
    background: string
}

interface BorderStyleOptions extends AsciiBorder {
    width: number
    height: number
    family: string
    base64Src: string
}

export interface BorderStyleSheetOptions {
    width: number
    height: number
    family: string
    borders: Record<string, AsciiBorder>
}

function genBorderStyles(options: BorderStyleOptions) {
    let { width, height, foreground, family, base64Src, chars } = options
    let { n, w, e, s, nw, sw, ne, se } = chars
    let svg = 
    `<svg width="${3 * width}px" height="${3 * height}px" xmlns="http://www.w3.org/2000/svg">
        <style>
            @font-face {
                font-family: "${family}";
                src: url("${base64Src}") format('truetype');
                font-weight: normal;
                font-style: normal;
                -webkit-font-smoothing: none;    
            }
            .bordertext {
                font-family: "${family}";
                font-size: ${height}px;
                line-height: ${height}px;
                letter-spacing: 0px;
            }
            .c1 {
                fill: ${foreground};
            }
        </style>

        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="0px" y="${height}px" width="${width}px" height="${height}px">${nw}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="${width}px" y="${height}px" width="${width}px" height="${height}px">${n}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="${2 * width}px" y="${height}px" width="${width}px" height="${height}px">${ne}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="0px" y="${ 2 * height}px" width="${width}px" height="${height}px">${w}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="${2 * width}px" y="${2 * height}px" width="${width}px" height="${height}px">${e}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="0px" y="${3 * height}px" width="${width}px" height="${height}px">${sw}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="${width}px" y="${3 * height}px" width="${width}px" height="${height}px">${s}</text>
        <text class="bordertext c1" text-rendering="geometricPrecision" text-antialiasing="false" textLength="${width}px" letter-spacing="0px" x="${2 * width}px" y="${3 * height}px" width="${width}px" height="${height}px">${se}</text>
    </svg>`
    let base64 = window.btoa(unescape(encodeURIComponent(svg)))
    return `
        border-image-source: url(data:image/svg+xml;base64,${base64});
        border-image-repeat: repeat;
        border-width: ${height}px ${width}px;
        border-image-slice: ${height} ${width};
        border-style: solid;
    `
}

export function createAsciiBorderChars(chars: string): AsciiBorderChars {
    return {
        nw: chars[0],
        n: chars[1],
        ne: chars[2],
        w: chars[3],
        e: chars[4],
        sw: chars[5],
        s: chars[6],
        se: chars[7]
    }
}


export async function createAsciiBorderStyleSheet(options: BorderStyleSheetOptions) {
    let { width, height, family, borders } = options
    let base64Src = await getFont(family)
    let classes = Object.entries(borders).map(([key, value]) => {
        let borderStyles = makeBorders({
            ...value,
            width,
            height,
            family,
            base64Src
        })
        return `.ascii-border-${key}{ ${borderStyles} }`
    }).join('\n')
    let styleTag = document.createElement('style')
    styleTag.innerHTML = classes
    return styleTag
}

function getFont(family: string): Promise<string> {
    let fontFaceRuleName = CSSFontFaceRule.name
    let familyRegex = /(?<=local\(\").*?(?=\"\))/m
    let srcRegex = /(?<=url\(\").*(?=\"\) format)/m
    let dataRegex = /^data\:/
    for(let el of document.head.children) {
        if(el.tagName === 'STYLE' || el.tagName === 'LINK') {
            let rules = (el as HTMLStyleElement | HTMLLinkElement).sheet?.cssRules
            if(rules) {
                for(let rule of rules) {
                    if(rule.constructor.name === fontFaceRuleName) {
                        let fontFaceRule = rule as CSSFontFaceRule
                        let src = fontFaceRule.style.getPropertyValue('src')
                        let familyExec = familyRegex.exec(src)
                        let urlExec = srcRegex.exec(src)
                        if(familyExec && urlExec) {
                            let url = urlExec[0]
                            let _family = familyExec[0]
                            if(family === _family) {
                                if(dataRegex.test(url)) {
                                    return Promise.resolve(url)
                                } else {
                                    return new Promise(async (res, rej) => {
                                        let result = await fetch(url)
                                        let blob = await result.blob()
                                        let reader = new FileReader()
                                        reader.onload = () => res(reader.result as string)
                                        reader.onabort = reader.onerror = rej
                                        reader.readAsDataURL(blob)
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return Promise.reject('ERR_COULDNT_FIND_FONT')
}

function makeBorders(options: BorderStyleOptions) {
    let { width, height, foreground, family, base64Src, chars } = options
    let { n, w, e, s, nw, sw, ne, se } = chars
    let canvas = document.createElement("canvas");
    let charx = 3;
    let chary = 3;
    let ws = width * 4
    let hs = height * 4
    canvas.width = charx * ws;
    canvas.height = chary * hs;
    let ctx = canvas.getContext("2d")
    if (ctx) {
        ctx.font = hs + "px " + family
        ctx.fillStyle = foreground
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.imageSmoothingEnabled = false
        ctx.fillText(nw, 0, 0)
        ctx.fillText(n, ws, 0)
        ctx.fillText(ne, ws * 2, 0)

        ctx.fillText(w, 0, hs)
        ctx.fillText(e, ws * 2, hs)

        ctx.fillText(sw, 0, hs * 2)
        ctx.fillText(s, ws, hs * 2)
        ctx.fillText(se, ws * 2, hs * 2)
        let durl = canvas.toDataURL()
        return `
        border-image-source: url(${durl});
        border-image-repeat: repeat;
        /*border-width: ${height}px ${width}px;*/
        border-image-slice: ${hs} ${ws};
        border-style: solid;
    `
    }    
}