import React, { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "./useDebounce";

const User = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [range, setRange] = useState(700);

  const debouncedSearchText = useDebounce(searchText, range);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (debouncedSearchText.trim() === "") {
          setUsers([]);
          return;
        }
        const response = await axios.get(
          `https://dummyjson.com/users/search?q=${debouncedSearchText}`
        );
        console.log(response.data);
        console.log(range);
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error(
            "Response data users is not an array:",
            response.data.users
          );
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
  }, [debouncedSearchText]);

  return (
    <>
      <div className="p-10 flex ">
        <input
          className="text-4xl border-2 p-5 border-black rounded-md w-[900px] mx-auto relative"
          type="text"
          name="search-user"
          placeholder="Enter the name to search any user"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="flex gap-10">
          <h3>Debounce delay</h3>
          <h3>{range}</h3>
          <input
            type="range"
            min="100"
            max="1000"
            default="700"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-80"
          />
        </div>
        <ul className="absolute top-40 bg-gray-200 ">
          {users &&
            users?.map((user) => (
              <li key={user.id} className="flex justify-center">
                <span>{user.firstName}</span>
                <img className="w-24" src={user.image} />
                <span>{user.lastName}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default User;
