import "./App.css";
import { useEffect, useState } from "react";
import { fetchPics, API_BASE_URL, uploadPic } from "./api";
// import AppClassExample from "./AppClassExample";

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fetchStatusError, setFetchStatusError] = useState(null);

  useEffect(() => {
    async function getPhotos() {
      setPhotos(await fetchPics());
    }

    getPhotos();
  }, []);

  const refetchPhotos = async () => {
    try {
      setFetchStatusError(null);
      setPhotos(await fetchPics());
    } catch {
      setFetchStatusError("Unable to fetch photos");
    }
  };

  const submitForm = async (event) => {
    try {
      event.preventDefault();
      await uploadPic(selectedFile);
      await refetchPhotos();
      setUploadStatus("Success!");
    } catch {
      setUploadStatus("Unable to upload photo");
    } finally {
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    }
  };
  const onSelectFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <div className="App">
      {fetchStatusError && <p>{fetchStatusError}</p>}
      {uploadStatus && <p>{uploadStatus}</p>}
      <form onSubmit={submitForm}>
        <input type="file" name="photo" onChange={onSelectFile} />
        <button type="submit">Submit</button>
      </form>
      {photos.map((pic) => {
        console.log(`${API_BASE_URL}${pic}`);
        return <img key={pic} src={`${API_BASE_URL}${pic}`} alt={pic} width={"150px"} height={"105px"} />;
      })}
    </div>
  );
}

export default App;
