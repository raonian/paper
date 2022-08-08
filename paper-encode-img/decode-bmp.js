/**
  * decode
  */
function decode(buffer) {

    const arrayBuffer = new Uint8Array(buffer);

    console.log(arrayBuffer, '+++++++++');

    /*--- file header ---*/
    const fileType = parseFileType(arrayBuffer.slice(0, 2));

    if (fileType !== 'BM') {
        // 不是 bmp
        return;
    }

    const fileSize = parseFileSize(arrayBuffer.slice(2, 6));

    // 0 0 0 0

    const dataOffset = parseDataOffset(arrayBuffer.slice(10, 14));

    /*--- bitmap header ---*/
    const headerSize = parseHeaderSize(arrayBuffer.slice(14, 18));

    const width = parseImgWidth(arrayBuffer.slice(18, 22));

    const height = parseImgHeight(arrayBuffer.slice(22, 26));

    // 1
    const plane = parsePlane(arrayBuffer.slice(26, 28));

    // 1 4 8 16 24 32
    const bpp = parsePixelBits(arrayBuffer.slice(28, 30));

    // 0 1 2 3
    const compression = parseCompression(arrayBuffer.slice(30, 34));

    // 4n
    const dataSize = parseDataSize(arrayBuffer.slice(34, 38));

    const hResolution = parseResolution(arrayBuffer.slice(38, 42));

    const vResolution = parseResolution(arrayBuffer.slice(42, 46));

    const colors = parseColors(arrayBuffer.slice(46, 50));

    const importantColors = parseColors(arrayBuffer.slice(50, 54));

    /*--- color table ---*/
    const colorTableSize = colors * 4;

    if (dataOffset !== (54 + colorTableSize)) {
        // 位图数据偏移量错误
        return;
    }

    let step = width * bpp / 8;
    const rows = [];
    for (let i = dataOffset; i < arrayBuffer.length;) {
        rows.push(arrayBuffer.slice(i, i + step));
        i += step;
    }
    return { rows, width, height };
}

function parseFileType(buffer) {
    const chars = [];
    for (let i = 0; i < buffer.length; i++) {
        chars.push(String.fromCharCode(buffer[i]));
    }
    return chars.join('');
}

function parseWords(buffer) {
    const chars = [];
    for (let i = 0; i < buffer.length; i++) {
        let charHex = buffer[i].toString(16);
        if (charHex.length === 1) {
            charHex = '0' + charHex;
        }
        chars.push(charHex);
    }
    chars.reverse();
    return parseInt(chars.join(''), 16);
}

function parseFileSize(buffer) {
    return parseWords(buffer);
}

function parseDataOffset(buffer) {
    return parseWords(buffer);
}

function parseHeaderSize(buffer) {
    return parseWords(buffer);
}

function parseImgWidth(buffer) {
    return parseWords(buffer);
}

function parseImgHeight(buffer) {
    return parseWords(buffer);
}

function parsePlane(buffer) {
    return parseWords(buffer);
}

function parsePixelBits(buffer) {
    return parseWords(buffer);
}

function parseCompression(buffer) {
    return parseWords(buffer);
}

function parseDataSize(buffer) {
    return parseWords(buffer);
}

function parseResolution(buffer) {
    return parseWords(buffer);
}

function parseColors(buffer) {
    return parseWords(buffer);
}








