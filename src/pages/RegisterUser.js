import React, { useState } from "react";
import { Images } from "../core";
import { TextField, PrimaryButton } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/user/userSlice";
import { useJwt } from "react-jwt";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const passwordRegex = new RegExp(
    "^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()-__+.]){1,}).{8,}$"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;
  const { decodedToken } = useJwt(location.pathname.split("/")[2]);

  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (decodedToken) {
      const { firstName, lastName, email } = decodedToken;

      setFormData({
        ...formData,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedToken]);

  useEffect(() => {
    if (isError) {
      alert(message.response);
    }
    if (isSuccess || user) {
      navigate("/home");
    }

    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onEnterSubmit = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (passwordRegex.test(password)) {
      if (password !== confirmPassword) {
        alert("Password didn't match");
      } else {
        const userData = {
          name: `${firstName} ${lastName}`,
          email: email,
          password: password,
          role: "worker",
        };
        dispatch(register(userData));
      }
    } else {
      alert("Password is too weak");
    }
  };

  return (
    <>
      <div
        className="w-screen h-screen bg-center bg-cover bg-accent-100 flex justify-center items-center"
        style={{ backgroundImage: `url(${Images.LoginRegisterBg})` }}
      >
        <section className="w-full md:w-auto lg:w-1/2 h-full md:h-auto p-4 md:p-16 bg-light-100 absolute md:rounded-3xl shadow flex flex-col justify-center text-center">
          <div className="flex justify-center ">
            <img
              className="w-24 h-auto"
              src={Images.LogoIcon}
              alt="Sprout It"
            />
          </div>
          <div className="mt-4 mb-8">
            <h1 className="poppins-heading-5 text-primary-500 mb-4">
              Welcome to Sprout It
            </h1>
            <h3 className="open-heading-6 text-seconday-400">
              Create a new account
            </h3>
          </div>
          <form className="flex flex-col " onKeyDown={onEnterSubmit}>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <TextField
                value={firstName}
                type="text"
                name="first-name"
                id="first-name"
                placeholder="First name"
                className="w-full pointer-events-none"
                //onChange={onChange}
                readonly
              />
              <TextField
                value={lastName}
                type="text"
                name="last-name"
                id="last-name"
                placeholder="Last name"
                className="w-full pointer-events-none"
                //onChange={onChange}
                readonly
              />
            </div>
            <TextField
              value={email}
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              //onChange={onChange}
              readonly
              className="pointer-events-none"
            />
            <TextField
              value={password}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
            />
            <p className="text-left">Password must contain:</p>
            <ul className="flex flex-col items-start">
              <li>At least 1 lowerchase letter</li>
              <li>At least 1 uppercase letter</li>
              <li>At least 1 number</li>
              <li>At least a special character</li>
              <li>And at least 8 characters long</li>
            </ul>

            <TextField
              value={confirmPassword}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Repeat Password"
              onChange={onChange}
            />

            <PrimaryButton
              className={"mt-10"}
              name="Register"
              onClick={onSubmit}
            >
              <input type="submit" value="Submit" />
            </PrimaryButton>
          </form>
        </section>
      </div>
    </>
  );
};
