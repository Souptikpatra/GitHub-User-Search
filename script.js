const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const repos = document.getElementById("repos");
const following = document.getElementById("following");
const follower = document.getElementById("followers");
const place = document.getElementById("location");
const office = document.getElementById("office");
const twitter = document.getElementById("x");
const join = document.getElementById("join");
const repoListSection = document.getElementById("repo-list");
const reposContainer = document.getElementById("repos-container");

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("username").trim();

  if (!name) return alert("Please enter a username");

  // Show loading spinner on button
  const searchBtn = document.querySelector('.search-button');
  searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  // Fetch user profile
  fetch(`https://api.github.com/users/${name}`)
    .then((res) => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then((data) => {
      // Update user profile info
      const joinDate = new Date(data.created_at).toLocaleDateString();
      join.textContent = `Joined on ${joinDate}`;
      avatar.src = data.avatar_url || "./assets/avatar.png";
      username.textContent = data.login || "Not available";
      repos.textContent = data.public_repos || "0";
      following.textContent = data.following || "0";
      follower.textContent = data.followers || "0";
      place.textContent = data.location || "Not available";
      office.textContent = data.company || "Not available";
      twitter.textContent = data.twitter_username ? `@${data.twitter_username}` : "Not available";

      // Animate profile card
      const profileCard = document.querySelector('.profile-card');
      profileCard.classList.add('animate-pop');
      setTimeout(() => {
        profileCard.classList.remove('animate-pop');
      }, 1000);

      // Fetch and display repos
      return fetch(`https://api.github.com/users/${name}/repos?sort=updated&per_page=10`);
    })
    .then((res) => {
      if (!res.ok) throw new Error("Repos not found");
      return res.json();
    })
    .then((reposData) => {
      // Clear previous repos
      reposContainer.innerHTML = "";

      if (reposData.length === 0) {
        reposContainer.innerHTML = "<li>No repositories found.</li>";
      } else {
        // Add each repo as a list item
        reposData.forEach(repo => {
          const repoEl = document.createElement("li");
          repoEl.classList.add("repo-item");
          repoEl.innerHTML = `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
            <p class="repo-desc">${repo.description ? repo.description : "No description"}</p>
            <div class="repo-stats">
              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
            </div>
          `;
          reposContainer.appendChild(repoEl);
        });
      }

      // Show repos section
      repoListSection.style.display = "block";
    })
    .catch((err) => {
      alert(err.message);
      // Error animation on form
      const form = document.getElementById('form');
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
      // Hide repos section on error
      repoListSection.style.display = "none";
    })
    .finally(() => {
      // Reset search button content
      searchBtn.innerHTML = '<span>Search</span><i class="fas fa-arrow-right"></i>';
    });
});
