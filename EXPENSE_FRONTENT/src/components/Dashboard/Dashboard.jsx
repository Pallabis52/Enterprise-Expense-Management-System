import { useState } from "react";
import Box from "./Boxes";

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const users = [
    {
      id: 1,
      name: "Neil Sims",
      email: "neil.sims@flowbite.com",
      position: "React Developer",
      status: "Online",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCJDmi508h1yLx1Dj1BlP-QrJ6-vjX3yuoA&s",
    },
    {
      id: 2,
      name: "Bonnie Green",
      email: "bonnie@flowbite.com",
      position: "Designer",
      status: "Online",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCJDmi508h1yLx1Dj1BlP-QrJ6-vjX3yuoA&s",
    },
    {
      id: 3,
      name: "Jese Leos",
      email: "jese@flowbite.com",
      position: "Vue JS Developer",
      status: "Online",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCJDmi508h1yLx1Dj1BlP-QrJ6-vjX3yuoA&s",
    },
    {
      id: 4,
      name: "Thomas Lean",
      email: "thomes@flowbite.com",
      position: "UI/UX Engineer",
      status: "Online",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCJDmi508h1yLx1Dj1BlP-QrJ6-vjX3yuoA&s",
    },
    {
      id: 5,
      name: "Leslie Livingston",
      email: "leslie@flowbite.com",
      position: "SEO Specialist",
      status: "Offline",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCJDmi508h1yLx1Dj1BlP-QrJ6-vjX3yuoA&s",
    },
  ];

  return (
    <>
    <Box />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <div>
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Action
              <svg
                className="w-2.5 h-2.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reward
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Promote
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Activate account
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete User
                  </a>
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-4">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
              </th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="p-4">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </td>
                <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.img}
                    alt={user.name}
                  />
                  <div className="ml-3">
                    <div className="text-base font-semibold">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{user.position}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        user.status === "Online" ? "bg-green-500" : "bg-red-500"
                      } mr-2`}
                    ></div>
                    {user.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit user
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
