import { Component } from "react";
import { fetchPics, API_BASE_URL, uploadPic } from "./api";

export default class AppClassExample extends Component {
  state = {
    photos: [],
    selectedFile: null,
    uploadStatus: null,
    fetchStatusError: null,
  };

  componentDidMount() {
    this.fetchPhotos();
  }

  async fetchPhotos() {
    try {
      this.setState(() => ({ fetchStatusError: null }));
      const photos = await fetchPics();
      this.setState(() => ({ photos }));
    } catch {
      this.setState(() => ({ fetchStatusError: "Unable to fetch photos" }));
    }
  }

  submitForm = async (event) => {
    try {
      event.preventDefault();
      const { selectedFile } = this.state;
      await uploadPic(selectedFile);
      await this.fetchPhotos();
      this.setState(() => ({ uploadStatus: "Success!" }));
    } catch {
      this.setState(() => ({ uploadStatus: "Unable to upload photo" }));
    } finally {
      setTimeout(() => {
        this.setState(() => ({ uploadStatus: null }));
      }, 3000);
    }
  };

  onSelectFile = (event) => {
    this.setState(() => ({ selectedFile: event.target.files[0] }));
  };

  render() {
    const { uploadStatus, photos, fetchStatusError } = this.state;
    return (
      <div className="App">
        {fetchStatusError && <p>{fetchStatusError}</p>}
        {uploadStatus && <p>{uploadStatus}</p>}
        <form onSubmit={this.submitForm}>
          <input type="file" name="photo" onChange={this.onSelectFile} />
          <button type="submit">Submit</button>
        </form>
        {photos.map((pic) => (
          <img key={pic} src={`${API_BASE_URL}${pic}`} alt={pic} width={"150px"} height={"105px"} />
        ))}
      </div>
    );
  }
}
