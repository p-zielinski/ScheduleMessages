import { Slider, InputNumber } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useStripe } from "@stripe/react-stripe-js";
import Loading from "../../utils/Loading";

const CreateSession = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/create_checkout_session",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response);
};

const AddFunds = () => {
  const { email, token } = useSelector((state) => state.userData);
  const [value, setValue] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();

  const AddFundsFunction = async () => {
    setIsLoading(true);
    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: value * 100, //amount is in cents
          product_data: {
            name: `Adding funds`,
            description: `Will add ${value}USD to your ${email} account on ScheduleMessage.com`,
            images: [],
          },
        },
      },
    ];
    const response = await CreateSession({
      line_items,
      token: token,
    });

    const { sessionId } = response;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        hidden={!isLoading}
        style={{
          zIndex: 3,
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
          background: "rgba(255,255,255,0.8)",
        }}
      >
        <div style={{ position: "relative", marginTop: 240 }}>
          <Loading
            size={"2rem"}
            margin={"20px"}
            height={"-3rem"}
            background={"rgba(0,1,255,0.62)"}
          />
        </div>
      </div>
      <h2 className={"center"} style={{ marginBottom: 10 }}>
        Add funds to you account:
      </h2>
      <p className={"center"} style={{ marginBottom: 5, textAlign: "center" }}>
        Choose how much funds you want to add to your <u>{email}</u> account:
      </p>
      <div className={"flex-wrapper"}>
        <InputNumber
          min={5}
          max={50}
          style={{ width: 130, marginRight: 20 }}
          addonAfter={"USD"}
          formatter={() => value + " USD"}
          value={value}
          onChange={setValue}
          size={"large"}
        />
        <Slider
          min={5}
          max={50}
          style={{ width: "100%", marginTop: 13, marginRight: 10 }}
          onChange={setValue}
          value={value}
          step={0.01}
        />
      </div>
      <button
        style={{
          marginTop: 10,
          fontSize: "2rem",
        }}
        onClick={() => AddFundsFunction()}
        className={"button"}
        type={"button"}
      >
        Continue
      </button>
    </div>
  );
};

export default AddFunds;
