let theme = {
        colors: {
            palette: [
                '#25d898',
                '#209cd9',
                '#d1857d',
                '#b2af5d',
                '#50c6c7',
                '#c59b69',
                '#72ad4b',
                '#82b9c9'
            ],
            background: 'black',
            surface: 'lightgray',
            primary: '#25d898',
            secondary: '#209cd9',
            accent: '#d1857d',
            info: '#2196F3',
            success: '#4CAF50',
            error: 'red',
            warning: '#FB8C00'
        },
        font: {
            family: 'Topaz Plus',
            w: 8,
            h: 16
        }
    }

let borders = {
    solid: {
        background: 'transparent',
        foreground: '#25d898',
        chars: {
            nw: '┌',
            n: '─',
            ne: '┐',
            w: '│',
            e: '│',
            sw: '└',
            s: '─',
            se: '┘'
        }
    }
}

export {theme, borders}