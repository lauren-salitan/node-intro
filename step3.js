const fs = require('fs');
const process = require('process');
const axios = require('axios');
const {readFile, writeFile} = fs.promises;


function handleOutput(text, out) {
  if (out) {
    fs.writeFile(out, text, 'utf8', function(err) {
      if (err) {
        console.error(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}


function cat(path, out) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    } else {
      handleOutput(data, out);
    }
  });
}


async function webCat(url, out) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

let path;
let out;

if (process.argv[2] === '--out') {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
  webCat(path, out);
} else {
  cat(path, out);
}


async function write(path, contents) {
    try {
        await writeFile(path, contents, "utf8");
    } catch (err) {
      console.error(`Error writing ${path}: ${err}`);
      process.exit(1);
    }
}


async function cat(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
  }
}


async function webCat(url) {
  try {
    return (await axios.get(url)).data;
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}


async function main() {
  let path;
  let out;

  if (process.argv[2] === '--out') {
    out = process.argv[3];
    path = process.argv[4];
  } else {
    path = process.argv[2];
  }

  let contentsPromise = (path.slice(0, 4) === 'http')
      ? webCat(path)
      : cat(path);

  let contents = await contentsPromise;

  if (out) {
      await write(out, contents);
  } else {
      console.log(contents);
  }
}

main();