window.onload = function() {
    fetch('./images/test.bmp')
        .then(function(response) {
            response.arrayBuffer()
                .then(function(buffer) {
                    const data = decode(buffer);

                    // console.log(data);
                    const start = Date.now();
                    // console.log(Date.now());

                    encodeData(data);
                    console.log(Date.now() - start);
                    // drawCanvas(data);
                });
        });
}

function drawCanvas({ width, height, rows }) {
    const canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    let j = rows.length - 1;
    let k = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = rows[j][k + 2];  // R value
      imageData.data[i + 1] = rows[j][k + 1];    // G value
      imageData.data[i + 2] = rows[j][k + 0];  // B value
      imageData.data[i + 3] = 255;  // A value
      
      k += 3;
      if (k === rows[j].length) {
        j--;
        k = 0;
      }

    }

    ctx.putImageData(imageData, 0, 0);
}

function pixel(row) {
  const res = [];
  for(let i = 0;i < row.length; i+=3) {
    // if (i % 3 === 0) {
      res.push(row[i]);
    // }
  }
  // console.log(res);
  return res;
}

function encodeData(data) {
  const { rows, bpp } = data;
  // const res = rows.slice(500).map(function(row) {
  //   bwt(row);
  // });
  const pixels = pixel(rows[0]);
  // const bwtData = bwt(pixels);

  // const {minData, delData, step} = delta(pixels, 7);

  // const resultData = rle((delData));

  // const {minData: minMinData, delData: minDelData} = delta(minData, 3);
  // const resultMin = rle((minDelData));


  // console.log(resultData, '----', resultMin, '====', minData, '+++++', minDelData);

  // const minDataRaw = [[minMinData.length, 0, 0, ...minMinData]];

  // const minDataRawBlock = createBlock(minDataRaw);

  // const minDataBlock = createBlock(resultMin);

  // const dataBlock = createBlock(resultData);

  // const dataLength = dataBlock.reduce((p, d) => d.length + p, 0);
  // const minLength = minDataBlock.reduce((p, d) => d.length + p, 0);
  // console.log(dataBlock, '-=-=-=-=-=-', dataLength, minDataBlock, minLength, dataLength + minLength + minDataRawBlock.length);

  const {buckets, indexs} = buc(((pixels)), 64);
  // console.log(buckets, indexs, '----');

  // const {buckets: buckets1, indexs: indexs1} = buc(((buckets)), 4);
  // // const {buckets: buckets2, indexs: indexs2} = buc(((indexs)), 4);

  // const bucketData = rless(((buckets1)));
  // const indexData = rle(((indexs1)));

  // const bucketBlock = createRleBlock(bucketData);
  // const indexBlock = createBlock(indexData);

  // const bucketLength = bucketBlock.reduce((p, d) => d.length + p, 0);
  // const indexLength = indexBlock.reduce((p, d) => d.length + p, 0);

  // console.log(buckets, buckets1, '----', bucketData, bucketBlock, bucketLength, '**********');
  // console.log(indexs1, indexData, indexBlock, indexLength, '********');

  // console.log(bucketLength + indexLength, '**********');


  const bucketData = rless(((buckets)));

  const bucketBlock = createRleBlock(bucketData);

  const bucketLength = bucketBlock.reduce((p, d) => d.length + p, 0);

  console.log(buckets, '----', bucketData, bucketBlock, bucketLength, '**********');



  // const {minData, delData, step} = delta(indexs, 7);
  const {buckets: buckets1, indexs: indexs1} = buc(((indexs)), 16);

  // const {buckets: buckets2, indexs: indexs2} = buc((bwt(indexs)), 4);
  // const {minData, delData, step} = delta(((indexs)), 7);
  // const allLength = createBlock(rle(((delData)))).reduce((p, d) => d.length + p, 0);
  // console.log(indexs, minData, delData, bwt(delData), rle((delData)), createBlock(rle((delData))), '*********', allLength);

  const indexData = rless(((buckets1)));
  const indexBlock = createRleBlock(indexData);
  const indexLength = indexBlock.reduce((p, d) => d.length + p, 0);
  console.log(buckets1, '----', indexData, indexBlock, indexLength, '**********');

  const resultData = rle((indexs1));
  const resultBlock = createBlock(resultData);
  const resultLength = resultBlock.reduce((p, d) => d.length + p, 0);

  console.log(indexs1, '---', resultData, resultBlock, resultLength, '===', bucketLength + indexLength + resultLength, '*****');


  const {buckets: buckets2, indexs: indexs2} = buc(buckets, 2);
  const lastData = rless((indexs2));
  const lastBlock = createRleBlock(lastData);
  const lastLength = lastBlock.reduce((p, d) => d.length + p, 0);

  console.log(indexs2, '---', lastData, lastBlock, lastLength);
}

function avg(data) {
  const length = data.length;
  const count = data.reduce(function(p, d) {return p + d}, 0);
  return Math.floor(count / length);
}
function delta(data, step = 7) {
  const res = [];
  const k = step;

  const mins = [];

  for(let i = 0;i < data.length; i+=k) {

    let min = Math.min.apply(null, data.slice(i, i + k));
    // let min = avg(data.slice(i, i + k))
    mins.push(min);
    for (let j = i; j < i + k; j++) {
      if (j === data.length) {
        break;
      }
      res.push(data[j] - min);
    }

  }

  return {minData: mins, delData: res, step: k};
}

function buc(data, step = 16) {
  const buckets = [];
  const indexs = [];
  for (let i = 0; i < data.length; i++) {
    const bucket = Math.floor(data[i] / step);
    const index = data[i] % step;

    buckets.push(bucket);
    indexs.push(index);
  }

  return {buckets, indexs};
}

function xor(data) {
  let start = data[0];
  const res = [start];
  for(let i = 1;i < data.length;i++) {
    res.push(start ^ data[i]);
    start = data[i];
  }

  return res;
}

function mtf(data) {
  const max = Math.max.apply(null, data);
  const arr = Array(max + 1).fill(0).map(function(a, i) {return i;});

  let mid = arr.slice();
  const res = [];

  for(let i = 0;i < data.length; i++) {
    const index = mid.findIndex(function(a) {return data[i] === a;});

    mid = [data[i]].concat(mid.slice(0, index)).concat(mid.slice(index + 1));

    res.push(index);
  }

  // for(let i = 0;i < data.length; i++) {
  //   const index = mid.findIndex(function(a) {return data[i] === a;});

  //   if (index > 0) {
  //     const temp = mid[index - 1];
  //     mid[index - 1] = data[i];
  //     mid[index] = temp;
  //   }

  //   res.push(index);
  // }


  // let step = 7;
  // for(let i = 0;i < data.length; ) {
  //   const index = mid.findIndex(function(a) {return data[i] === a;});

  //   res.push(index);

  //   mid = mid.slice(index, index + step).concat(mid.slice(0, index)).concat(mid.slice(index + step));
    
  //   for (let j = i + 1; j < i + step; j++) {
  //     if (j >= data.length) {
  //       break;
  //     }
  //     const dataIndex = mid.findIndex(function(a) {return data[j] === a;});
      
  //     res.push(dataIndex);
  //   }
  //   i = i + step;

  // }

  return res;
}

function rles(data) {
  const k = 15;
  const max = 16;
  const min = 4;

  let compressLength = data[0] < 4 ? 2 : 4;

  const res = [];

  for(let i = 0; i < data.length;) {
    let maxs = 0;
    let mins = 0;

    let j = i;
    for (;j< j + k;j++) {
      if (j === data.length) {
        break;
      }
      if (data[j] < min) {
        mins++;
        if (compressLength !== 2) {
          compressLength = 2;
          break;
        }
      } else if (data[j] < max) {
        maxs++;
        if (compressLength !== 4) {
          compressLength = 4;
          break;
        }
      }
    }

    let step = j - i;
    if (mins === step && (compressLength !== 2 || j === data.length)) {
      const flag = [step, 1, 2];
      const datas = data.slice(i, j);
      res.push(flag.concat(datas));
      // res.push(datas);
    } else if (maxs > 0 && (compressLength !== 4 || j === data.length)) {
      const flag = [step, 1, 4];
      const datas = data.slice(i, j);
      res.push(flag.concat(datas));
      // res.push(datas);
    }

    i = j;
  }

  return res;
}

function rle(data) {
  const k = 15;
  const max = 16;
  const min = 4;

  let compress = data[0] < max ? true : false;
  // const compressBitLength = 0;

  const res = [];

  for(let i = 0; i < data.length;) {
    let maxs = 0;
    let mins = 0;
    let raws = 0;

    let j = i;
    for (;j< j + k;j++) {
      if (j === data.length) {
        break;
      }
      if (data[j] < min) {
        mins++;
        if (!compress) {
          compress = true;
          break;
        }
      } else if (data[j] < max) {
        maxs++;
        if (!compress) {
          compress = true;
          break;
        }
      } else {
        raws++;
        if (compress) {
          compress = false;
          break;
        }
      }
    }

    let step = j - i;
    if (mins === step && (!compress || j === data.length)) {
      const flag = [step, 1, 2];
      const datas = data.slice(i, j);
      res.push(flag.concat(datas));
      // res.push(datas);
    } else if (maxs > 0 && (!compress || j === data.length)) {
      const flag = [step, 1, 4];
      const datas = data.slice(i, j);
      res.push(flag.concat(datas));
      // res.push(datas);
    } else {
      const flag = [step, 0, 0];
      const datas = data.slice(i, j);
      res.push(flag.concat(datas));
      // res.push(datas);
    }

    i = j;
  }

  return res;
}

function rless(data) {
  const res = [];

  let count = 0;
  for(let i = 0; i < data.length;) {
    
    let target = data[i];

    for(let j = i; j < data.length; j++) {
      if (data[j] === target) {
        count++;
      } else {
        break;
      }
    }

    const flag = [count, target];

    res.push(flag);

    i = i + count;

    count = 0;
  }

  return res;
}

// block [111111 1|0 1|0]
function createBlock(data) {
  const res = [];
  const step = 63;

  for(let i = 0; i < data.length; i++) {
    const length = data[i][0];
    const compress = data[i][1];
    const bitLength = data[i][2];
    
    if (length > step) {
      const times = Math.floor(length / step);
      const rest = length % step;

      const blocks = [];
      for (let k = 0; k < times; k++) {
        let block = [step, compress, bitLength].concat(data[i].slice(k * step + 3, k * step + step + 3));
        blocks.push(block);
      }
      if (rest) {
        let block = [rest, compress, bitLength].concat(data[i].slice(times * step + 3));
        blocks.push(block);
      }

      const buffers = createBlock(blocks);
      buffers.map(function(b) {
        res.push(b);
      });
    } else {
      let buffer = [];
      const len = length.toString(2).padStart(6, '0');
      // const compress = data[i][1];
      // const bitLength = data[i][2];
      let comporessMode = 0;
      if (compress) {
        if (bitLength === 4) {
          comporessMode = 1;
        } else {
          comporessMode = 0;
        }
      }

      buffer.push(len + compress + comporessMode);

      const datas = data[i].slice(3);
      if (compress && comporessMode === 1) {
        for(let j = 0; j < datas.length; j+=2) {
          const byteData1 = datas[j].toString(2).padStart(4, '0');
          const byteData2 = datas[j + 1] ? datas[j + 1].toString(2).padStart(4, '0') : '0000';
          const byte = byteData1 + byteData2;
          buffer.push(byte);
        }
      } else if (compress && comporessMode === 0) {
        for(let j = 0; j < datas.length; j+=4) {
          const byteData1 = datas[j].toString(2).padStart(2, '0');
          const byteData2 = datas[j + 1] ? datas[j + 1].toString(2).padStart(2, '0') : '00';
          const byteData3 = datas[j + 2] ? datas[j + 2].toString(2).padStart(2, '0') : '00';
          const byteData4 = datas[j + 3] ? datas[j + 3].toString(2).padStart(2, '0') : '00';
          const byte = byteData1 + byteData2 + byteData3 + byteData4;
          buffer.push(byte);
        }
      } else {
        for(let j = 0; j < datas.length; j++) {
          const byte = datas[j].toString(2).padStart(8, '0');
          buffer.push(byte);
        }
      }
      res.push(buffer);
    }
    
  }


  return res;
}

// block [111111 11]
function createRleBlock(data) {
  const res = [];
  const step = 63;

  for(let i = 0; i < data.length; i++) {
    const length = data[i][0];
    const target = data[i][1];
    
    if (length > step) {
      const times = Math.floor(length / step);
      const rest = length % step;

      const blocks = [];
      for (let k = 0; k < times; k++) {
        let block = [step, target];
        blocks.push(block);
      }
      if (rest) {
        let block = [rest, target];
        blocks.push(block);
      }

      const buffers = createRleBlock(blocks);
      buffers.map(function(b) {
        res.push(b);
      });
    } else {
      let buffer = [];
      const len = length.toString(2).padStart(6, '0');

      buffer.push(len + target.toString(2).padStart(2, '0'));

      res.push(buffer);
    }
    
  }

  return res;
}