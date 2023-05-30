import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

function FormPage() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState("1");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/vehicles/" + id).then((response) => {
      const { data } = response;
      console.log(data);
      setName(data.name);
      setType(data.type);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setFeature(data.feature);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();

    const vehicleData = {
      name,
      type,
      address,
      addedPhotos,
      description,
      feature,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      // update
      await axios.put("/vehicles", {
        id,
        ...vehicleData,
      });
      setRedirect(true);
    } else {
      //new place
      await axios.post("/vehicles", vehicleData);
      setRedirect(true);
    }
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filenames } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, ...filenames];
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    console.log(files);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filename } = response;
        console.log(response);
        setAddedPhotos((prev) => {
          return [...prev, ...filename];
        });
      });
  }

  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      setFeature([...feature, name]);
    } else {
      setFeature([...feature.filter((selectedName) => selectedName !== name)]);
    }
  }

  function removePhoto(filename, ev) {
    ev.preventDefault();
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function selectedAsMainPhoto(filename, ev) {
    ev.preventDefault();
    const addedPhotosWithoutSelected = addedPhotos.filter(
      (photo) => photo !== filename
    );
    const newAddedPhotos = [filename, ...addedPhotosWithoutSelected];
    setAddedPhotos(newAddedPhotos);
    console.log(addedPhotos);
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        <h2 className="text-xl mt-4">name</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <h2 className="text-xl mt-4">type</h2>
        <input
          type="text"
          placeholder="type"
          value={type}
          onChange={(ev) => setType(ev.target.value)}
        />
        <h2 className="text-xl mt-4">Address</h2>
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />
        <h2 className="text-xl mt-4">Photos</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add using a link"
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
          />
          <button
            onClick={addPhotoByLink}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            Add&nbsp;photo
          </button>
        </div>
        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, index) => (
              <div className="h-32 flex relative" key={index}>
                <img
                  className="rounded-2xl w-full object-cover"
                  src={"http://localhost:3000/uploads/" + link}
                  alt="photo"
                />
                <button
                  onClick={(ev) => removePhoto(link, ev)}
                  className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  onClick={(ev) => selectedAsMainPhoto(link, ev)}
                  className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                >
                  {link === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {link !== addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Upload
          </label>
        </div>
        <h2 className="text-2xl mt-4">Description</h2>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <h2 className="text-2xl mt-4">Feature</h2>
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={feature.includes("wifi")}
              name="wifi"
              onChange={handleCbClick}
            />
            <span>Wifi</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={feature.includes("parking")}
              name="parking"
              onChange={handleCbClick}
            />
            <span>Free parking</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={feature.includes("tv")}
              name="tv"
              onChange={handleCbClick}
            />
            <span>TV</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={feature.includes("driver")}
              name="driver"
              onChange={handleCbClick}
            />
            <span>Driver</span>
          </label>
          <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={feature.includes("gasoline")}
              name="gasoline"
              onChange={handleCbClick}
            />
            <span>Gasoline</span>
          </label>
        </div>
        <h2 className="text-2xl mt-4">Extra info</h2>
        <p className="text-gray-500 text-sm">rules</p>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        <h2 className="text-2xl mt-4">Check in&out times</h2>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              placeholder="14"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              placeholder="13"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}

export default FormPage;
