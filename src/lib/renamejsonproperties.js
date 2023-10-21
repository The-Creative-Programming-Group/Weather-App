const fs = require("fs");

// Replace 'input.json' with the path to your JSON file.
const filePath = "city-list.json";

// Read the JSON file.
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data.
    const jsonData = JSON.parse(data);

    // Rename "state" to "region" in all objects.
    jsonData.forEach((item) => {
      if (item.state !== undefined && item.state !== null) {
        item.region = item.state;
        delete item.state;
      }
    });

    // Convert the updated JSON data back to a string.
    const updatedJson = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON back to the file.
    fs.writeFile(filePath, updatedJson, "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
      } else {
        console.log(
          'Renaming complete. "state" has been replaced with "region" in the JSON file.',
        );
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
