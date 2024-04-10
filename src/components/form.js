import React, { useState, useRef } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Audio } from "react-loader-spinner";
// const data = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//     date_of_birth: "1990-05-15",
//     phone_number: "+912345678900",
//   },
//   {
//     id: 3,
//     name: "Parmanand Prajapatiii",
//     email: "parmanandprajapati06@gmail.com",
//     date_of_birth: "1990-05-15",
//     phone_number: "+912345678902",
//   },
//   {
//     id: 6,
//     name: "Parajatiii",
//     email: "parmananpraati06@gmail.com",
//     date_of_birth: "1990-05-16",
//     phone_number: "+919123456787",
//   },
//   {
//     id: 9,
//     name: "Partiii\\\\",
//     email: "parmi06@gmail.com",
//     date_of_birth: "1990-05-16",
//     phone_number: "+919823606787",
//   },
//   {
//     id: 28,
//     name: "Terabite",
//     email: "parmanandprajapati006@gmail.com",
//     date_of_birth: "1990-05-16",
//     phone_number: "+918523664707",
//   },
//   {
//     id: 29,
//     name: "Terabite",
//     email: "parmanandprapati006@gmail.com",
//     date_of_birth: "1990-05-16",
//     phone_number: "+918523664507",
//   },
//   {
//     id: 30,
//     name: "Testing",
//     email: "parmandprapati006@gmail.com",
//     date_of_birth: "1990-05-16",
//     phone_number: "+918223664507",
//   },
// ];
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i
);
const validateForm = (state) => {
  let valid = true;
  Object.values(state);
  Object.values(state).forEach((val) => {
    val === null && (valid = false);
  });
  Object.values(state.errors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  return valid;
};

function checkAge(birthDate) {
  var currentYear = new Date().getFullYear();
  console.log(birthDate);
  var birthYear = birthDate.split("-")[0];
  console.log("eee");
  var age = currentYear - birthYear;
  if (age < 18) {
    return "your age must be greater than 18";
  }
  return "";
}

const Form = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [formDisplay, setFormDisplay] = useState(true);
  const [state, setState] = useState({
    fullName: null,
    email: null,
    phoneNo: "",
    dob: null,
    errors: {
      fullName: "",
      email: "",
      phoneNo: "",
      dob: "",
    },
  });
  console.log(state.phoneNo);
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = { ...state.errors };

    switch (name) {
      case "fullName":
        errors.fullName =
          value.length < 5
            ? "Full Name must be at least 5 characters long!"
            : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "phoneNo":
        errors.phoneNo =
          value.length !== 10 ? "phoneNo must be of 10 digits!" : "";
        break;
      case "dob":
        errors.dob = checkAge(value);

        break;
      default:
        break;
    }

    setState({ ...state, errors, [name]: value });
  };

  async function SetData() {
    var raw = "";

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const putData = await fetch(
      "https://user-form-email-backend.vercel.app/api/user-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.fullName,
          email: state.email,
          date_of_birth: state.dob,
          phone_number: state.phoneNo,
          password: "",
        }),
      }
    );
    const putdata = await putData.json();
    console.log("data =", putdata);

    const res = await fetch(
      "https://user-form-email-backend.vercel.app/api/user-form/all",
      requestOptions
    );

    const data = await res.json();
    // console.log("data =", data);
    setData(data.data);

    setFormDisplay(false);
    //   .then((response) => response.json())
    //   .then((res) => console.log(res))
    //   .catch((error) => console.log("error", error));
    setLoading(false);
  }
  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    if (validateForm(state)) {
      console.info("Valid Form");
      console.log(state);
      SetData();
    } else {
      console.error("Invalid Form");
      console.log(state);
    }
  };

  const { errors } = state;

  return (
    <div className="wrapper">
      {loading && (
        <>
          <Audio
            height="80"
            width="80"
            radius="9"
            color="black"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
          <div style={{ paddingTop: "10px", fontSize: "20px" }}>Loading</div>
        </>
      )}
      {!loading && formDisplay && (
        <div className="form-wrapper">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="fullName">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                name="fullName"
                onChange={handleChange}
                noValidate
              />
              {errors.fullName.length > 0 && (
                <span className="error">{errors.fullName}</span>
              )}
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                noValidate
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </div>

            <div className="phoneNo">
              <label htmlFor="phoneNo">Phone Number</label>
              <PhoneInput
                name="phoneNo"
                className="phoneNo-input"
                defaultCountry="in"
                value={state.phoneNo}
                onChange={(phone) => {
                  setState({ ...state, ["phoneNo"]: phone });
                }}
              />
            </div>
            <div className="dob">
              <label htmlFor="dob">
                {" "}
                Date of Birth
                <input
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  noValidate
                />
              </label>

              <span className="error">{errors.dob}</span>
            </div>
            <div className="submit">
              <button>Create</button>
              <p>*Email and phone number should be unique</p>
            </div>
          </form>
        </div>
      )}
      {/* {console.log(data)} */}
      {!loading && !formDisplay && (
        <>
          <table id="customers">
            <tr>
              <th>S No.</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>E-mail</th>
              <th>Phone Number</th>
            </tr>
            {data.map((value, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{value.name}</td>
                  <td>{value.date_of_birth}</td>
                  <td>{value.email}</td>
                  <td>{value.phone_number}</td>
                </tr>
              );
            })}
          </table>
          <button
            onClick={() => {
              setFormDisplay(true);
            }}
            className="home-button"
          >
            Home
          </button>
        </>
      )}
    </div>
  );
};

export default Form;
