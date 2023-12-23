const fs = require("fs");

// Replace 'input.json' with the path to your JSON file.
const filePath = "cities.json";
const newFilePath = "city-list.json";

// Read the JSON file.
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data.
    const jsonData = JSON.parse(data);

    jsonData.forEach((item, index) => {
      item.id = index + 1;
    });

    // Make the lat and lng into coord
    jsonData.forEach((item) => {
      item.coord = {
        lat: Number(item.lat),
        lon: Number(item.lng),
      };
      delete item.lat;
      delete item.lng;
    });

    // Convert the updated JSON data back to a string.
    const updatedJson = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON back to the file.
    fs.writeFile(newFilePath, updatedJson, "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
      } else {
        console.log(`Successfully wrote to the file: '${newFilePath}'`);
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
