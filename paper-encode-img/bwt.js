/**
  * test  
  * nbacbccubawuba
  */

function compare(a, b, len) {
    for(let i = 0; i < len; i++) {
        if (a[i] < b[i]) {
            return -1;
        } else if (a[i] > b[i]) {
            return 1;
        }
    }
    return 0;
}

function findIndex(matrix, source) {
    return matrix.findIndex(function(m) {
        if (m.join('') === source.join('')) {
            return true;
        }
        return false;
    });
}

function bwt(buffer) {
    let ary = typeof buffer === 'string' ? buffer.split('') : buffer;

    // ary = ary.concat(16);

    const mid = [ary];
    const len = ary.length;
    ary.map(function(a, i) {
        const lastIndex = len - i - 1;
        mid.push([ary[lastIndex], ...mid[i].slice(0, len - 1)]);
    });
    
    const matrix = mid.slice(1);
    matrix.sort(function(a, b) {return compare(a, b, len);})
    
    const sourceIndex = findIndex(matrix, ary);

    const lastColumn = matrix.map(function(m) { return m[len - 1]});

    // return lastColumn;
    return lastColumn.concat(sourceIndex);
}

// bwt('nbacbccubawuba');
// const res = bwt([81, 158, 62, 88, 165, 62, 90, 167, 74, 102, 179, 82, 114, 190, 87, 121, 197, 96, 130, 206])









