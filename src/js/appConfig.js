// General parameters for this app

const APPCONFIG = {
    BASE_WIDTH: 1000,
    BASE_HEIGHT: 1000,
    BASE_COLOUR: 0xffffff,
    COLUMN_WIDTH: 20,
    COLUMN_HEIGHT: 10,
    COLUMN_DEPTH: 20,
    COLUMN_SEGMENTS: 16,
    NUM_COUNTRIES: 4,
    UPDATE_INTERVAL: 0.15,
    TIME_SPAN: 48,
    SCALE_FACTOR: 1,
    // England, Wales, Northern Ireland, Scotland
    COUNTRY_COLOURS: [
        0xff0000,
        0x00ff00,
        0xff00ff,
        0x0000ff
    ],
    COUNTRY_POS: [
        {
            x: 250,
            y: 0,
            z: 225
        },
        {
            x: 50,
            y: 0,
            z: 250
        },
        {
            x: -150,
            y: 0,
            z: -30
        },
        {
            x: 25,
            y: 0,
            z: -250
        }
    ],
    ENGLAND_POS: {
        x: 250,
        y: 0,
        z: 225
    },
    VALUE_SCALE: {
        x: 100,
        y: 25,
        z: 1
    },
    MILLION: 1000000
}

export { APPCONFIG };