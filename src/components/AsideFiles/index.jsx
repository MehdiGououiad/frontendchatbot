import React, { useState } from "react";
function AsideFiles({ links }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Event handler for search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Enhanced filtering logic
  const filteredLinks = links.filter((link) => {
    // Convert search term to lowercase for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Check multiple fields for the search term
    return (
      link.value.toLowerCase().includes(lowerCaseSearchTerm) ||
      link.text.toLowerCase().includes(lowerCaseSearchTerm) ||
      (link.type && link.type.toLowerCase().includes(lowerCaseSearchTerm)) // Checking type only if it exists
    );
  });

  return (
    <div className="w-[20%] hidden lg:block">
      <p className="font-semibold mt-5 ml-3">Fichiers et liens</p>
      <div className="relative  mt-3 ml-3 m-3">
        <input
          type="text"
          placeholder="Recherche"
          className="py-2 pr-10 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-500  w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <p className="text-sm text-zinc-600 font-medium  text-center mt-3">
          Vous retrouverez ici les liens et fichiers envoyés par le chatbot
        </p>

        <svg
          width="21"
          className="h-6 w-6 absolute left-3 top-2 text-gray-400"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.9055 19.3598L15.7769 14.2323C17.1475 12.4682 17.7942 10.2481 17.5853 8.02396C17.3764 5.79982 16.3276 3.73893 14.6525 2.26094C12.9774 0.782957 10.8019 -0.000990649 8.56907 0.0687353C6.33623 0.138461 4.21391 1.05662 2.63429 2.63624C1.05466 4.21587 0.136508 6.33818 0.0667822 8.57102C-0.00294377 10.8039 0.781004 12.9793 2.25899 14.6544C3.73698 16.3295 5.79787 17.3783 8.02201 17.5872C10.2461 17.7961 12.4663 17.1495 14.2303 15.7789L19.3589 20.9064L20.9055 19.3598ZM8.87425 15.4376C7.57631 15.4376 6.30752 15.0527 5.22832 14.3316C4.14912 13.6105 3.30799 12.5856 2.81129 11.3865C2.31459 10.1873 2.18463 8.86783 2.43785 7.59483C2.69106 6.32183 3.31608 5.1525 4.23386 4.23472C5.15164 3.31694 6.32097 2.69192 7.59397 2.43871C8.86697 2.18549 10.1865 2.31545 11.3856 2.81215C12.5848 3.30885 13.6097 4.14998 14.3308 5.22918C15.0519 6.30838 15.4368 7.57717 15.4368 8.87511C15.4347 10.615 14.7427 12.283 13.5124 13.5133C12.2821 14.7435 10.6141 15.4356 8.87425 15.4376Z"
            fill="#00B86F"
          />
        </svg>
      </div>
      <div className="flex">
        <div className="items-stretch flex grow flex-col my-auto">
          <nav>
            {filteredLinks.map((link, index) => (
              <a
                href={link.value}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between mx-2 hover:bg-gray-100 mb-2 p-2 rounded-xl animate-slide-in-right" // Using the custom animation class
                key={index}
              >
                <div className="flex">
                  <figure className="justify-center items-center bg-purple-50 flex aspect-square flex-col w-12 h-12 px-3 rounded-xl">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/826fa3601de548c8493d57127b75999bbd991412ff809e24092392e22c4158c2?apiKey=81226a1a8f9f4f2688e9c62cb118fa86&"
                      className="aspect-square object-contain object-center w-full overflow-hidden"
                      alt="Descriptive alt text"
                    />
                  </figure>
                  <div className="ml-3">
                    <h1
                      href={link.value}
                      className="text-black text-sm font-semibold leading-5 "
                    >
                      {link.text}
                    </h1>
                    <p className="text-gray-300">{link.type}</p>
                  </div>
                </div>

                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ab088f9a02c5fc39a6983d298bce7b589988874a6ed1e80ee93c1bdee27e0b9?apiKey=81226a1a8f9f4f2688e9c62cb118fa86&"
                  className="aspect-square object-contain object-center w-6 overflow-hidden self-center shrink-0 max-w-full my-auto"
                  alt="Image 2"
                />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AsideFiles;
