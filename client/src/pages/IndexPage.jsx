import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Car from "../assets/car-outline.svg";
import CarSport from "../assets/car-sport-outline.svg";
import Bus from "../assets/bus-outline.svg";
import Boat from "../assets/boat-outline.svg";
import Motorcycle from "../assets/motorcycle-fill.svg";
import Plane from "../assets/airplane-outline.svg";
import Bicycle from "../assets/bicycle-outline.svg";

function IndexPage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/vehicles").then((response) => {
      setVehicles(response.data.data.vehicles);
    });
  }, []);

  const handleClickCar = async () => {
    const response = await axios.get("/api/v1/vehicles?type=car");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickSports = async () => {
    const response = await axios.get("/api/v1/vehicles?type=sports");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickBus = async () => {
    const response = await axios.get("/api/v1/vehicles?type=bus");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickPlane = async () => {
    const response = await axios.get("/api/v1/vehicles?type=plane");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickBoat = async () => {
    const response = await axios.get("/api/v1/vehicles?type=boat");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickBicycle = async () => {
    const response = await axios.get("/api/v1/vehicles?type=bicycle");
    setVehicles(response.data.data.vehicles);
  };
  const handleClickMotor = async () => {
    const response = await axios.get("/api/v1/vehicles?type=motorcycle");
    setVehicles(response.data.data.vehicles);
  };

  return (
    <div>
      <div className="px-20 pt-5">
        <div className="flex gap-8 items-center justify-center">
          <label
            onClick={handleClickCar}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Car} />
              <span className="">Car</span>
            </span>
          </label>
          <label
            onClick={handleClickSports}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={CarSport} />
              <span className="">Car Sports</span>
            </span>
          </label>
          <label
            onClick={handleClickMotor}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Motorcycle} />
              <span className="">Motorcycle</span>
            </span>
          </label>
          <label
            onClick={handleClickBus}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Bus} />
              <span className="">Bus</span>
            </span>
          </label>
          <label
            onClick={handleClickBoat}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Boat} />
              <span className="">Boat</span>
            </span>
          </label>
          <label
            onClick={handleClickPlane}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Plane} />
              <span className="">Plane</span>
            </span>
          </label>
          <label
            onClick={handleClickBicycle}
            className="bg-transparent w-20 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-2">
              <img className="h-6 w-6" src={Bicycle} />
              <span className="">Bicycle</span>
            </span>
          </label>
        </div>
      </div>
      <div className="px-20 mt-12 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {vehicles.length > 0 &&
          vehicles.map((place, index) => (
            <Link to={"/place/" + place._id} key={index}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.images?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:3000/uploads/" + place.images?.[0]}
                  />
                )}
              </div>
              <h3 className="font-bold">{place.address}</h3>
              <h2 className="text-sm  text-gray-500">{place.name}</h2>
              <div className="mt-2">
                <span className="font-bold">${place.price} per night</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default IndexPage;
