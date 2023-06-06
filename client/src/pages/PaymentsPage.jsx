import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AccountNav from "./AccountNav";
import UserContext from "../UserContext";

function PaymentsPage() {
  const { user } = useContext(UserContext);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get(`/api/v1/payments/${user._id}`).then(({ data }) => {
      setPayments(data.data.payments);
      console.log(data.data.payments[0].orderId);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {payments?.length > 0 &&
          payments.map((payment, index) => (
            <Link
              to={`/account/payments/${payment._id}`}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
              key={index}
            >
              <div className="py-3 pr-3 flex gap-2 flex-col grow">
                <span>Payment Order {payment.orderId}</span>
                <span>Amount Price {payment.totalPrice}</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default PaymentsPage;
