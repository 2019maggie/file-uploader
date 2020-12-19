import express from "express";
import cors from "cors";
import path from "path";
import { uploader, UPLOAD_DIRECTORY, getUploadedFiles, findUploadedFile } from "./utils";

const app = express();
// allow CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOAD_DIRECTORY));

app.get("/pics", async (req, res) => {
  try {
    const files = await getUploadedFiles();
    const fileData = files.map((file) => `/uploads/${file}`);
    res.json(fileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/pics/:filename", async (req, res) => {
  try {
    const { birthtime, size } = await findUploadedFile(req.params.filename);
    res.json({ birthtime, size });
  } catch (err) {
    res.status(404).json({ message: "Unable to find file." });
  }
});

app.post("/pics", uploader.single("photo"), (req, res) => {
  res.json({
    photo: req.file.path,
  });
});

app.get("/pics-hard-mode", async (req, res) => {
  try {
    const files = await getUploadedFiles();
    const fileData = files.map((file) => `/uploads/${file}`);
    if (!req.query.size) {
      res.json(fileData);
      return;
    }
    const size = Number.parseInt(req.query.size, 10);

    const promises = files.map((file) => findUploadedFile(file));
    const results = await Promise.all(promises);
    const photos = [];
    results.forEach((data, i) => {
      if (data.size <= size) {
        photos.push(fileData[i]);
      }
    });

    res.json(photos);
    // SLOW WAY BELOW
    // for (let file of files) {
    //   const result = await findUploadedFile(file);
    //   if (result.size <= size) {
    //     results.push(file);
    //   }
    // }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(4000, () => {
  console.log("express server is now running on port 4000");
});
