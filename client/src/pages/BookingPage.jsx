import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import BookingDates from "../components/BookingDates";

function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get(`/api/v1/bookings/user/${id}`).then((response) => {
        setBooking(response.data.data.bookings[0]);
        console.log(response.data.data.bookings[0]);
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking?.vehicle.name}</h1>
      <AddressLink className="my-2 block">
        {booking?.vehicle.address}
      </AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking?.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking?.vehicle} />
    </div>
  );
}

export default BookingPage;
