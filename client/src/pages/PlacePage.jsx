import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
import UserContext from "../UserContext";
import avatar from "../assets/default.jpg";

function PlacePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewMsg, setReviewMsg] = useState("");

  const { user, session, setSession } = useContext(UserContext);
  let numberOfDays = 0;

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    axios.get(`/api/v1/reviews/${id}`).then((response) => {
      console.log(response.data.data.reviews);
      setReviews(response.data.data.reviews);
    });
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/v1/vehicles/${id}`).then((response) => {
      console.log(response.data.data.vehicle);
      setVehicle(response.data.data.vehicle);
    });
  }, []);

  if (!vehicle) return "";

  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
    console.log(numberOfDays);
  }

  async function bookThis() {
    console.log(vehicle._id);
    const data = {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      vehicle: vehicle._id,
      price: numberOfDays * vehicle.price,
    };

    const res = await axios.post(
      `/api/v1/bookings/checkout-session/${vehicle.id}/${user._id}`,
      data
    );
    setSession(res.data.data);
    setRedirect(`${res.data.redirectUrl}/${user._id}`);
  }

  if (redirect) {
    return <Navigate to={redirect} state={session} />;
  }

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const data = {
      review: reviewMsg,
      rating,
      vehicle: vehicle.id,
      user: user._id,
    };
    await axios.post("/api/v1/reviews", data);
  };

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-36">Photos of {vehicle.name}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close photos
            </button>
          </div>
          {vehicle?.images?.length > 0 &&
            vehicle.images.map((photo, index) => (
              <div key={index}>
                <img
                  src={"http://localhost:3000/uploads/" + photo}
                  alt="photo vehicle"
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{vehicle.name}</h1>
      <a
        className="flex gap-1 my-3 font-semibold underline"
        target="#"
        href={"https://maps.google.com/?q=" + vehicle.address}
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
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
        {vehicle.address}
      </a>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div>
            {vehicle.images?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-ratio object cover cursor-pointer"
                  src={"http://localhost:3000/uploads/" + vehicle.images[0]}
                />
              </div>
            )}
          </div>
          <div className="grid">
            {vehicle.images?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={"http://localhost:3000/uploads/" + vehicle.images[1]}
              />
            )}
            <div className="overflow-hidden">
              {vehicle.images?.[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer relative top-2"
                  src={"http://localhost:3000/uploads/" + vehicle.images[2]}
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500"
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          Show more photo
        </button>
      </div>

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {vehicle.description}
          </div>
        </div>
        <div>
          <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
              Price: ${vehicle.price} / night
            </div>
            <div className="border rounded-2xl">
              <div className="flex">
                <div className="py-3 px-4">
                  <label>Check in:</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(ev) => setCheckIn(ev.target.value)}
                  />
                </div>
                <div className="py-3 px-4 border-l">
                  <label>Check out:</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(ev) => setCheckOut(ev.target.value)}
                  />
                </div>
              </div>
              <div className="py-3 px-4 border-t">
                <label>Number of guests</label>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(ev) => setNumberOfGuests(ev.target.value)}
                />
              </div>
              {numberOfDays > 0 && (
                <div className="py-3 px-4 border-t">
                  <label>Your full name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                  />
                  <label>Phone number:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </div>
              )}
            </div>
            <button onClick={bookThis} className="primary mt-4">
              Booking
              {numberOfDays > 0 && (
                <span> ${numberOfDays * vehicle.price}</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <div>
            <h2 className="font-semibold text-2xl">Feature</h2>
          </div>
          <div className="flex gap-1">
            {vehicle?.feature.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
        <div>
          <div>
            <h2 className="font-semibold text-2xl">Summary</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
            {vehicle.summary}
          </div>
        </div>
      </div>
      <div className="border rounded-sm bg-white">
        <div>
          <h2 className="font-semibold text-2xl mt-8">
            Reviews ({reviews.length})
          </h2>
          <span>Rating Average ({vehicle.ratingAverage})</span>
        </div>
        <form onSubmit={handlerSubmit} className="mt-5">
          <div className="flex gap-5 ml-5">
            <span
              onClick={() => setRating(1)}
              className="bg-transparent cursor-pointer flex gap-1 items-center"
            >
              1
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
            <span
              onClick={() => setRating(2)}
              className="bg-transparent cursor-pointer flex items-center gap-1"
            >
              2
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
            <span
              onClick={() => setRating(3)}
              className="bg-transparent cursor-pointer flex gap-1 items-center"
            >
              3
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
            <span
              onClick={() => setRating(4)}
              className="bg-transparent cursor-pointer flex gap-1 items-center"
            >
              4
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
            <span
              onClick={() => setRating(5)}
              className="bg-transparent cursor-pointer flex gap-1 items-center"
            >
              5
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </div>
          <div className="flex gap-2 mt-4">
            <input
              value={reviewMsg}
              type="text"
              placeholder="share your thoughts"
              onChange={(ev) => setReviewMsg(ev.target.value)}
            />
            <button className="primary rounded-lg p-2">Submit</button>
          </div>
        </form>
        <div className="user__reviews">
          {reviews?.map((review, index) => (
            <div key={index} className="my-4 mx-2 flex gap-2">
              <img
                className="w-8 h-8 rounded-lg"
                src={avatar}
                alt="photo profile"
              />
              <div className="w-20">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5>{review.user.name}</h5>
                    <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="d-flex align-items-center">
                    {review.rating} <i className="ri-star-s-fill"></i>
                  </span>
                </div>
                <h6>{review.review}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlacePage;
