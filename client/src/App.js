import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("");

  const displayRazorPay = async (amount) => {
    const data = await fetch(
      `https://razorpay-server-pb.herokuapp.com/razorpay?amount=${amount}`,
      {
        method: "POST",
      }
    ).then((res) => res.json());

    const options = {
      key: "rzp_test_2IXWX4ZkmH4p8O",
      amount: data.amount.toString(), // 100 paise = ₹1
      currency: data.currency,
      name: "Donation",
      description: "This is a test donation!",
      image: "https://razorpay-server-pb.herokuapp.com/logo.svg",
      order_id: data.id,
      handler: function (response) {
        setName("");
      },
      prefill: {
        name,
        // email: "gaurav.kumar@example.com",
        // contact: "9999999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const loadRazorPay = (amount) => {
    if (!name) return alert("Please enter your name!");

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    script.onload = displayRazorPay(amount);
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <button onClick={() => loadRazorPay(100)}>Donate ₹100</button>
        <button onClick={() => loadRazorPay(200)}>Donate ₹200</button>
        <button onClick={() => loadRazorPay(300)}>Donate ₹300</button>
        <button onClick={() => loadRazorPay(400)}>Donate ₹400</button>
        <button onClick={() => loadRazorPay(500)}>Donate ₹500</button>
      </div>
    </div>
  );
}

export default App;
