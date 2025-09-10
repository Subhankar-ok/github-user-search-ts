const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;

interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  location?: string; // may not always exist
  html_url: string;
}

// Generic fetcher with typing
async function myCustomFetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network response was not ok - status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// UI renderer
const showResultUI = (singleUser: UserData) => {
  const { avatar_url, login, html_url } = singleUser;
  main_container.insertAdjacentHTML(
    "beforeend",
    `<div class="card">
       <img src="${avatar_url}" alt="${login}" />
       <hr />
       <div class="card-footer">
         <a href="${html_url}" target="_blank">GitHub</a>
       </div>
     </div>`
  );
};

// Fetch initial users (first page of users)
function fetchUserData(url: string) {
  myCustomFetcher<UserData[]>(url).then((userInfo) => {
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

  if (!searchTerm) return;

  try {
    // Use GitHub search API instead of fetching all users
    const url = `https://api.github.com/search/users?q=${searchTerm}`;
    const result = await myCustomFetcher<{ items: UserData[] }>(url);

    main_container.innerHTML = "";

    if (result.items.length === 0) {
      main_container.insertAdjacentHTML(
        "beforeend",
        `<p class="empty-msg">No matching users found.</p>`
      );
    } else {
      for (const singleUser of result.items) {
        showResultUI(singleUser);
      }
    }
  } catch (error) {
    console.error(error);
    main_container.insertAdjacentHTML(
      "beforeend",
      `<p class="error-msg">Error fetching users. Please try again later.</p>`
    );
  }
});
