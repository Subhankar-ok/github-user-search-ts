"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
// Generic fetcher with typing
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    return response.json();
}
// UI renderer
const showResultUI = (singleUser) => {
    const { avatar_url, login, html_url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class="card">
       <img src="${avatar_url}" alt="${login}" />
       <hr />
       <div class="card-footer">
         <a href="${html_url}" target="_blank">GitHub</a>
       </div>
     </div>`);
};
// Fetch initial users (first page of users)
function fetchUserData(url) {
    myCustomFetcher(url).then((userInfo) => {
        main_container.innerHTML = "";
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login: " + singleUser.login);
        }
    });
}
// Initial load
fetchUserData("https://api.github.com/users");
// Handle form search
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase().trim();
    if (!searchTerm)
        return;
    try {
        // Use GitHub search API instead of fetching all users
        const url = `https://api.github.com/search/users?q=${searchTerm}`;
        const result = await myCustomFetcher(url);
        main_container.innerHTML = "";
        if (result.items.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of result.items) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.error(error);
        main_container.insertAdjacentHTML("beforeend", `<p class="error-msg">Error fetching users. Please try again later.</p>`);
    }
});
