const app = require("express")();
const path = require("path");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const crypto = require("crypto");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const instance = new Razorpay({
  key_id: "rzp_test_2IXWX4ZkmH4p8O",
  key_secret: "jeuTWEN3eAOTuJ7cz2O2E9qM",
});

app.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "logo.svg"));
});

app.post("/verification", async (req, res) => {
  const SECRET = "CU`JA(Xf0W2@m6+:w,mL";

  console.log(req.body);

  const shasum = crypto.createHmac("sha256", SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request is legit!");
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 2)
    );
    res.json({ status: "ok" });
  } else {
    res.status(401);
  }
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = req.query.amount;
  const currency = "INR";
  const receipt = uuidv4();

  const options = {
    amount: amount * 100,
    currency,
    receipt,
    payment_capture,
  };

  try {
    const response = await instance.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is listening!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
