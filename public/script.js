const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const eventForm = document.getElementById("eventForm");

const todayContainer = document.getElementById("todayContainer");
const weekContainer = document.getElementById("weekContainer");
const upcomingContainer = document.getElementById("upcomingContainer");
const pastContainer = document.getElementById("pastContainer");

const eventModal = document.getElementById("eventModal");
const modalContent = document.getElementById("modalContent");

let allEvents = [];


// ==========================================
// NAVIGATION
// ==========================================

function showSection(sectionId) {

    document
        .querySelectorAll(".app-section")
        .forEach(section => {
            section.classList.remove("active");
        });


    const section =
        document.getElementById(sectionId);


    if (section) {
        section.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (sectionId === "organizer") {
        updateOrganizerDashboard();
    }

}


// ==========================================
// LOAD EVENTS
// ==========================================

async function loadEvents() {

    try {

        const response =
            await fetch("/api/events");


        if (!response.ok) {
            throw new Error("Failed to load events");
        }


        allEvents =
            await response.json();


        displayEvents();

        updateOrganizerDashboard();

    }

    catch (error) {

        console.error(
            "Error loading events:",
            error
        );

        showLoadingError();

    }

}


// ==========================================
// DATE FUNCTIONS
// ==========================================

function getToday() {

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

}


function getDateOnly(dateString) {

    const date = new Date(dateString);

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


function formatDate(dateString) {

    return new Date(dateString)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


// ==========================================
// DISPLAY EVENTS
// ==========================================

function displayEvents() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const filteredEvents =
        allEvents.filter(event => {

            const title =
                String(event.title || "")
                    .toLowerCase();


            const description =
                String(event.description || "")
                    .toLowerCase();


            const venue =
                String(event.venue || "")
                    .toLowerCase();


            const organizer =
                String(event.organizer || "")
                    .toLowerCase();


            const matchesSearch =
                title.includes(searchText) ||
                description.includes(searchText) ||
                venue.includes(searchText) ||
                organizer.includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                event.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    const today = getToday();

    const weekEnd =
        new Date(today);


    weekEnd.setDate(
        today.getDate() + 7
    );


    const todayEvents = [];
    const weekEvents = [];
    const upcomingEvents = [];
    const pastEvents = [];


    filteredEvents.forEach(event => {

        const eventDate =
            getDateOnly(event.date);


        if (
            eventDate.getTime() ===
            today.getTime()
        ) {

            todayEvents.push(event);

        }

        else if (
            eventDate > today &&
            eventDate <= weekEnd
        ) {

            weekEvents.push(event);

        }

        else if (
            eventDate > weekEnd
        ) {

            upcomingEvents.push(event);

        }

        else {

            pastEvents.push(event);

        }

    });


    todayEvents.sort(compareDates);

    weekEvents.sort(compareDates);

    upcomingEvents.sort(compareDates);


    pastEvents.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    renderStudentEvents(
        todayEvents,
        todayContainer,
        "today"
    );


    renderStudentEvents(
        weekEvents,
        weekContainer,
        "week"
    );


    renderStudentEvents(
        upcomingEvents,
        upcomingContainer,
        "upcoming"
    );


    renderStudentEvents(
        pastEvents,
        pastContainer,
        "past"
    );

}


function compareDates(a, b) {

    return (
        new Date(a.date) -
        new Date(b.date)
    );

}


// ==========================================
// STUDENT EVENT CARDS
// ==========================================

function renderStudentEvents(
    events,
    container,
    type
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (events.length === 0) {

        container.innerHTML = `
            <div class="empty-message">
                No events found.
            </div>
        `;

        return;

    }


    events.forEach(event => {

        const card =
            document.createElement("div");


        card.className =
            "event-card";


        if (type === "today") {
            card.classList.add("today-card");
        }


        if (type === "past") {
            card.classList.add("past-card");
        }


        let badgeClass =
            "category-badge";


        let badgeText =
            event.category || "Event";


        if (type === "today") {

            badgeClass =
                "category-badge today-badge";

            badgeText =
                "HAPPENING TODAY";

        }


        if (type === "past") {

            badgeClass =
                "category-badge past-badge";

        }


        card.innerHTML = `

            <div class="card-top">

                <span class="${badgeClass}">
                    ${escapeHtml(badgeText)}
                </span>

            </div>


            <h3>
                ${escapeHtml(event.title)}
            </h3>


            <p class="event-description">
                ${escapeHtml(event.description)}
            </p>


            <p class="event-detail">
                <strong>📅</strong>
                ${formatDate(event.date)}
            </p>


            <p class="event-detail">
                <strong>📍</strong>
                ${escapeHtml(event.venue)}
            </p>


            <p class="event-detail">
                <strong>👤</strong>
                ${escapeHtml(event.organizer)}
            </p>


            <p class="event-detail">
                <strong>🎫 Capacity:</strong>
                ${event.maxParticipants}
            </p>


            <div class="event-actions">

                <button
                    class="view-btn"
                    onclick="viewEvent('${event._id}')"
                >
                    View Details
                </button>


                ${
                    type !== "past"
                    ?
                    `
                    <button
                        class="register-btn"
                        onclick="registerForEvent('${event._id}')"
                    >
                        Register Now
                    </button>
                    `
                    :
                    ""
                }

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// VIEW EVENT
// ==========================================

function viewEvent(id) {

    const event =
        allEvents.find(
            item => item._id === id
        );


    if (!event) {
        return;
    }


    modalContent.innerHTML = `

        <span class="category-badge">
            ${escapeHtml(event.category)}
        </span>


        <h2>
            ${escapeHtml(event.title)}
        </h2>


        <p class="event-description">
            ${escapeHtml(event.description)}
        </p>


        <p class="event-detail">
            <strong>📅 Date:</strong>
            ${formatDate(event.date)}
        </p>


        <p class="event-detail">
            <strong>📍 Venue:</strong>
            ${escapeHtml(event.venue)}
        </p>


        <p class="event-detail">
            <strong>👤 Organizer:</strong>
            ${escapeHtml(event.organizer)}
        </p>


        <p class="event-detail">
            <strong>🎫 Capacity:</strong>
            ${event.maxParticipants}
        </p>


        <br>


        <button
            class="register-btn"
            onclick="registerForEvent('${event._id}')"
        >
            Register Now
        </button>

    `;


    eventModal.classList.add("show");

}


function closeModal() {

    eventModal.classList.remove("show");

}


window.addEventListener(
    "click",
    event => {

        if (
            event.target === eventModal
        ) {
            closeModal();
        }

    }
);


// ==========================================
// REGISTRATION BUTTON
// TEMPORARY UI
// ==========================================

function registerForEvent(id) {

    const event =
        allEvents.find(
            item => item._id === id
        );


    if (!event) {
        return;
    }


    alert(
        `Registration for "${event.title}" will be connected to the registration system next.`
    );

}


// ==========================================
// CREATE EVENT
// ==========================================

eventForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const formData =
            new FormData(eventForm);


        const eventData = {

            title:
                String(
                    formData.get("title") || ""
                ).trim(),

            description:
                String(
                    formData.get("description") || ""
                ).trim(),

            date:
                String(
                    formData.get("date") || ""
                ),

            venue:
                String(
                    formData.get("venue") || ""
                ).trim(),

            organizer:
                String(
                    formData.get("organizer") || ""
                ).trim(),

            category:
                String(
                    formData.get("category") || ""
                ),

            maxParticipants:
                Number(
                    formData.get("maxParticipants")
                )

        };


        if (
            !eventData.title ||
            !eventData.description ||
            !eventData.date ||
            !eventData.venue ||
            !eventData.organizer ||
            !eventData.category ||
            !eventData.maxParticipants
        ) {

            alert(
                "Please fill in all fields."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/events",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(eventData)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Unable to create event."
                );

                return;

            }


            alert(
                "Event created successfully!"
            );


            eventForm.reset();


            await loadEvents();


            showSection("home");

        }

        catch (error) {

            console.error(
                "Create event error:",
                error
            );


            alert(
                "Unable to connect to the server."
            );

        }

    }
);


// ==========================================
// EDIT EVENT
// ORGANIZER ONLY
// ==========================================

async function editEvent(id) {

    const event =
        allEvents.find(
            item => item._id === id
        );


    if (!event) {

        alert("Event not found.");

        return;

    }


    const title =
        prompt(
            "Event Title:",
            event.title
        );


    if (
        title === null ||
        !title.trim()
    ) {
        return;
    }


    const description =
        prompt(
            "Description:",
            event.description
        );


    if (
        description === null ||
        !description.trim()
    ) {
        return;
    }


    const date =
        prompt(
            "Date (YYYY-MM-DD):",
            event.date
                ? new Date(event.date)
                    .toISOString()
                    .split("T")[0]
                : ""
        );


    if (
        date === null ||
        !date.trim()
    ) {
        return;
    }


    const venue =
        prompt(
            "Venue:",
            event.venue
        );


    if (
        venue === null ||
        !venue.trim()
    ) {
        return;
    }


    const organizer =
        prompt(
            "Organizer:",
            event.organizer
        );


    if (
        organizer === null ||
        !organizer.trim()
    ) {
        return;
    }


    const category =
        prompt(
            "Category:",
            event.category
        );


    if (
        category === null ||
        !category.trim()
    ) {
        return;
    }


    const maxParticipants =
        prompt(
            "Maximum Participants:",
            event.maxParticipants
        );


    if (
        maxParticipants === null ||
        !maxParticipants.trim() ||
        Number(maxParticipants) <= 0
    ) {
        return;
    }


    const updatedData = {

        title:
            title.trim(),

        description:
            description.trim(),

        date:
            date.trim(),

        venue:
            venue.trim(),

        organizer:
            organizer.trim(),

        category:
            category.trim(),

        maxParticipants:
            Number(maxParticipants)

    };


    try {

        const response =
            await fetch(
                `/api/events/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(updatedData)

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to update event."
            );

            return;

        }


        alert(
            "Event updated successfully!"
        );


        await loadEvents();

    }

    catch (error) {

        console.error(
            "Update error:",
            error
        );


        alert(
            "Unable to update event."
        );

    }

}


// ==========================================
// DELETE EVENT
// ORGANIZER ONLY
// ==========================================

async function deleteEvent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/events/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to delete event."
            );

            return;

        }


        alert(
            "Event deleted successfully!"
        );


        await loadEvents();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete event."
        );

    }

}


// ==========================================
// ORGANIZER DASHBOARD
// ==========================================

function updateOrganizerDashboard() {

    const totalEvents =
        document.getElementById(
            "totalEvents"
        );


    const upcomingCount =
        document.getElementById(
            "upcomingCount"
        );


    const pastCount =
        document.getElementById(
            "pastCount"
        );


    const organizerEvents =
        document.getElementById(
            "organizerEvents"
        );


    if (
        !totalEvents ||
        !upcomingCount ||
        !pastCount ||
        !organizerEvents
    ) {
        return;
    }


    const today =
        getToday();


    const upcoming =
        allEvents.filter(
            event =>
                getDateOnly(event.date) >= today
        );


    const past =
        allEvents.filter(
            event =>
                getDateOnly(event.date) < today
        );


    totalEvents.textContent =
        allEvents.length;


    upcomingCount.textContent =
        upcoming.length;


    pastCount.textContent =
        past.length;


    organizerEvents.innerHTML = "";


    if (allEvents.length === 0) {

        organizerEvents.innerHTML = `
            <div class="empty-message">
                No events available.
            </div>
        `;

        return;

    }


    allEvents.forEach(event => {

        const card =
            document.createElement("div");


        card.className =
            "event-card";


        card.innerHTML = `

            <span class="category-badge">
                ${escapeHtml(event.category)}
            </span>


            <h3>
                ${escapeHtml(event.title)}
            </h3>


            <p class="event-detail">
                📅 ${formatDate(event.date)}
            </p>


            <p class="event-detail">
                📍 ${escapeHtml(event.venue)}
            </p>


            <p class="event-detail">
                👤 ${escapeHtml(event.organizer)}
            </p>


            <div class="event-actions">

                <button
                    class="view-btn"
                    onclick="viewEvent('${event._id}')"
                >
                    View
                </button>


                <button
                    class="edit-btn"
                    onclick="editEvent('${event._id}')"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteEvent('${event._id}')"
                >
                    Delete
                </button>

            </div>

        `;


        organizerEvents.appendChild(card);

    });

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayEvents
);


// ==========================================
// FILTER
// ==========================================

categoryFilter.addEventListener(
    "change",
    displayEvents
);


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// ==========================================
// ERROR
// ==========================================

function showLoadingError() {

    if (todayContainer) {

        todayContainer.innerHTML = `
            <div class="empty-message">
                Unable to load events.
            </div>
        `;

    }


    if (weekContainer) {
        weekContainer.innerHTML = "";
    }


    if (upcomingContainer) {
        upcomingContainer.innerHTML = "";
    }


    if (pastContainer) {
        pastContainer.innerHTML = "";
    }

}


// ==========================================
// START
// ==========================================

loadEvents();