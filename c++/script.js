// ---------- Data ----------
let students = [
  {
    id: 1,
    name: "Priya Sharma",
    skill: "Python",
    reviews: [
      { reviewer: "Rahul Mehta", rating: 5, text: "Bahut acche se explain karti hai, code bhi clean likhti hai." },
      { reviewer: "Ananya Iyer", rating: 4, text: "Assignment mein help ki, achi knowledge hai." }
    ]
  },
  {
    id: 2,
    name: "Rohan Gupta",
    skill: "Web Design",
    reviews: [
      { reviewer: "Priya Sharma", rating: 5, text: "Website ka design bahut sundar banaya, colors ka sense zabardast hai." }
    ]
  }
];

let activeStudentId = null;
let selectedRating = 0;

// ---------- Helpers ----------
function getAvgRating(student) {
  if (student.reviews.length === 0) return 0;
  const total = student.reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / student.reviews.length;
}

function starsHTML(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

// ---------- Render student list ----------
function renderStudents() {
  const list = document.getElementById("studentList");

  if (students.length === 0) {
    list.innerHTML = `<div class="empty-msg">Koi student nahi hai. Upar se add karo.</div>`;
    return;
  }

  list.innerHTML = students.map(s => {
    const avg = getAvgRating(s);
    return `
      <div class="student-card" onclick="openModal(${s.id})">
        <div class="student-info">
          <h3>${escapeHtml(s.name)}</h3>
          <span class="skill-tag">${escapeHtml(s.skill)}</span>
        </div>
        <div class="student-rating">
          <div class="stars">${avg ? starsHTML(avg) : "☆☆☆☆☆"}</div>
          <span class="review-count">${s.reviews.length} review${s.reviews.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    `;
  }).join("");
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ---------- Add student ----------
document.getElementById("addStudentBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("studentName");
  const skillInput = document.getElementById("studentSkill");
  const name = nameInput.value.trim();
  const skill = skillInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  students.push({
    id: Date.now(),
    name,
    skill: skill || "General",
    reviews: []
  });

  nameInput.value = "";
  skillInput.value = "";
  renderStudents();
});

// ---------- Modal open/close ----------
function openModal(id) {
  activeStudentId = id;
  selectedRating = 0;
  document.getElementById("reviewModal").classList.remove("hidden");
  renderModal();
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("reviewModal").classList.add("hidden");
});

document.getElementById("reviewModal").addEventListener("click", (e) => {
  if (e.target.id === "reviewModal") {
    document.getElementById("reviewModal").classList.add("hidden");
  }
});

// ---------- Render modal content ----------
function renderModal() {
  const student = students.find(s => s.id === activeStudentId);
  if (!student) return;

  document.getElementById("modalStudentName").textContent = student.name;
  document.getElementById("modalStudentSkill").textContent = student.skill;

  const avg = getAvgRating(student);
  document.getElementById("avgStars").textContent = avg ? starsHTML(avg) : "☆☆☆☆☆";
  document.getElementById("avgNumber").textContent = avg ? avg.toFixed(1) + " / 5" : "Koi rating nahi";

  // reset star picker
  updateStarPicker();

  // render reviews
  const container = document.getElementById("reviewsContainer");
  if (student.reviews.length === 0) {
    container.innerHTML = `<p style="color:#888; font-size:0.88rem;">Abhi tak koi review nahi hai.</p>`;
    return;
  }

  container.innerHTML = student.reviews.map((r, idx) => `
    <div class="review-item">
      <div class="review-top">
        <span>${escapeHtml(r.reviewer)}</span>
      </div>
      <div class="review-stars stars">${starsHTML(r.rating)}</div>
      <p>${escapeHtml(r.text)}</p>
      <span class="delete-review" onclick="deleteReview(${idx})">Delete</span>
    </div>
  `).join("");
}

function deleteReview(idx) {
  const student = students.find(s => s.id === activeStudentId);
  student.reviews.splice(idx, 1);
  renderModal();
  renderStudents();
}

// ---------- Star picker (giving a rating) ----------
document.getElementById("starPicker").addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    selectedRating = parseInt(e.target.dataset.value, 10);
    updateStarPicker();
  }
});

function updateStarPicker() {
  document.querySelectorAll("#starPicker span").forEach(span => {
    const val = parseInt(span.dataset.value, 10);
    span.classList.toggle("active", val <= selectedRating);
  });
}

// ---------- Submit review ----------
document.getElementById("submitReviewBtn").addEventListener("click", () => {
  const student = students.find(s => s.id === activeStudentId);
  const nameInput = document.getElementById("reviewerName");
  const textInput = document.getElementById("reviewText");

  const reviewer = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!reviewer || !text || selectedRating === 0) {
    alert("Please apna naam, rating (stars pe click karo) aur review likho.");
    return;
  }

  student.reviews.push({ reviewer, rating: selectedRating, text });

  nameInput.value = "";
  textInput.value = "";
  selectedRating = 0;

  renderModal();
  renderStudents();
});

// ---------- Init ----------
renderStudents();