import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Input Handle
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      console.log("Login Response:", data);

      // Save Access Token
      localStorage.setItem(
        "accesstoken",
        data.accesstoken
      );

      // Save User Data
      localStorage.setItem(
        "user",
        JSON.stringify(data.data)
      );

      setMessage(data.message);

      // Role ke according redirect
      setTimeout(() => {
        if (data.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 700);

    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Server se connection nahi ho raha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="
                w-full
                px-4
                py-3
                border
                border-gray-300
                rounded-xl
                text-gray-800
                placeholder-gray-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="
                w-full
                px-4
                py-3
                border
                border-gray-300
                rounded-xl
                text-gray-800
                placeholder-gray-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
              shadow-md
              hover:bg-blue-700
              active:scale-[0.98]
              transition
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-7">
          <p className="text-gray-500 text-sm">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="
              inline-block
              mt-1
              text-blue-600
              font-semibold
              hover:text-blue-700
              hover:underline
            "
          >
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

