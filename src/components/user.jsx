import React, { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "./useDebounce";
import useThrottle from "./useThrottle";

const User = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [range, setRange] = useState(700);
  const [mode, setMode] = useState("debounce"); // 'debounce' or 'throttle'
  const [count, setCount] = useState(0)

  // Apply debounce or throttle based on the selected mode
  const debouncedSearchText = useDebounce(searchText, range);
  const throttledSearchText = useThrottle(searchText, range);
  const effectiveSearchText = mode === "debounce" ? debouncedSearchText : throttledSearchText;

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (effectiveSearchText.trim() === "") {
          setUsers([]);
          return;
        }
        setCount(prev => prev + 1)

        const response = await axios.get(
          `https://dummyjson.com/users/search?q=${effectiveSearchText}`
        );
        console.log(response.data);
        console.log("Delay:", range);
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Response data users is not an array:", response.data.users);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error fetching users:", error.response.status);
        } else {
          console.error("Error fetching users:", error.message);
        }
      }
    };

    handleSearch();
  }, [effectiveSearchText, range]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "debounce" ? "throttle" : "debounce"));
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-10 space-y-8 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">User Search with {mode === "debounce" ? "Debounce" : "Throttle"}</h1>

      <div className="flex items-center space-x-4">
        <input
          className="text-xl border-2 p-4 border-gray-300 rounded-lg w-[600px] shadow-md focus:outline-none focus:border-blue-500 transition-all duration-300"
          type="text"
          name="search-user"
          placeholder="Search for users"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          onClick={toggleMode}
          className="px-6 py-2 text-white transition-all duration-300 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600">
          Switch to {mode === "debounce" ? "Throttle" : "Debounce"}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <label className="text-lg font-medium text-gray-700">Delay: {range}ms</label>
        <input
          type="range"
          min="100"
          max="1000"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="w-64 accent-blue-500"
        />
      </div>

      <div className="text-xl font-medium text-gray-800">
        {mode[0].toUpperCase() + mode.slice(1)} call count: {count}
      </div>

      {users.length > 0 && (
        <ul className="bg-white shadow-lg rounded-lg w-[600px] divide-y divide-gray-200 mt-5">
          {users.map((user) => (
            <li key={user.id} className="flex items-center p-4 space-x-4 transition-all duration-300 hover:bg-gray-100">
              <img className="object-cover w-12 h-12 rounded-full" src={user.image} alt={`${user.firstName} ${user.lastName}`} />
              <div>
                <span className="font-semibold text-gray-800">{user.firstName}</span>{" "}
                <span className="text-gray-600">{user.lastName}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default User;
