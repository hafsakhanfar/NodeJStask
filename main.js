//file system module
const fs = require("fs");
//read line module
const readline = require("readline");
const { json } = require("stream/consumers");

//file stream in rl to read the file line by line
const rl = readline.createInterface({
  input: fs.createReadStream("users.csv"),
});

async function readCSV() {
  const users = [];
  //using line event triggered when the input stream receives an end-of-line input
  rl.on("line", (row) => {
    users.push(row.split(",").map((line) => line.trim().split(" ")[0]));
  });

  return users;
}

async function saveToFile(users) {
  let file = "";
  rl.on("close", () => {
    for (let i = 1; i < users.length; i++) {
      file += users[i].join(",") + "\r\n";
    }

    fs.writeFileSync("outputFile.csv", file);
  });

  return users;
}

async function saveJsonFile(users) {
  // Write to JSON and outputFile

  rl.on("close", () => {
    const [keys, ...values] = users;
    const json = values.map((row) => {
      return {
        [row[0]]: keys.reduce(
          (acc, key, index) => ((acc[key] = row[index]), acc),
          {}
        ),
      };
    });

    fs.writeFileSync("outputFile.json", JSON.stringify(json));
  });
}

function readJsonFile() {
  const data = fs.readFileSync("outputFile.json");
  const obj = JSON.parse(data);

  console.log(obj);
}

readCSV()
  .then(saveToFile)
  .then(saveJsonFile)
  .then(
    setTimeout(() => {
      readJsonFile();
    }, 1000)
  );
