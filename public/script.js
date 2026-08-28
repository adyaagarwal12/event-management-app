const eventForm = document.getElementById("eventForm");
const eventsContainer = document.getElementById("eventsContainer");


// ==========================================
// GET ALL EVENTS
// ==========================================

async function loadEvents() {

    try {

        const response = await fetch("/api/events");

        const events = await response.json();

        eventsContainer.innerHTML = "";

        if (events.length === 0) {

            eventsContainer.innerHTML = `
                <p>No events available.</p>
            `;

            return;
        }

        events.forEach(event => {

            const card = document.createElement("div");

            card.className = "event-card";

            card.innerHTML = `

                <h3>${event.title}</h3>

                <p>
                    <strong>Description:</strong>
                    ${event.description}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${new Date(event.date).toLocaleDateString()}
                </p>

                <p>
                    <strong>Venue:</strong>
                    ${event.venue}
                </p>

                <p>
                    <strong>Organizer:</strong>
                    ${event.organizer}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${event.category}
                </p>

                <p>
                    <strong>Maximum Participants:</strong>
                    ${event.maxParticipants}
                </p>

                <div class="event-actions">

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

            eventsContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading events:", error);

    }
}


// ==========================================
// CREATE EVENT
// ==========================================

eventForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const eventData = {

        title: document.getElementById("title").value,

        description:
            document.getElementById("description").value,

        date:
            document.getElementById("date").value,

        venue:
            document.getElementById("venue").value,

        organizer:
            document.getElementById("organizer").value,

        category:
            document.getElementById("category").value,

        maxParticipants:
            Number(
                document.getElementById("maxParticipants").value
            )

    };


    try {

        const response = await fetch("/api/events", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(eventData)

        });


        const result = await response.json();


        if (!response.ok) {

            alert(result.message || "Failed to create event");

            return;
        }


        alert("Event created successfully!");

        eventForm.reset();

        loadEvents();


    } catch (error) {

        console.error("Error:", error);

        alert("Something went wrong.");

    }

});


// ==========================================
// DELETE EVENT
// ==========================================

async function deleteEvent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this event?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(`/api/events/${id}`, {

                method: "DELETE"

            });


        const result =
            await response.json();


        if (!response.ok) {

            alert(result.message || "Failed to delete event");

            return;
        }


        alert("Event deleted successfully!");

        loadEvents();


    } catch (error) {

        console.error("Error deleting event:", error);

    }

}


// ==========================================
// EDIT EVENT
// ==========================================

async function editEvent(id) {

    const newTitle =
        prompt("Enter new event title:");


    if (!newTitle) {
        return;
    }


    try {

        const response =
            await fetch(`/api/events/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: newTitle
                })

            });


        const result =
            await response.json();


        if (!response.ok) {

            alert(result.message || "Failed to update event");

            return;
        }


        alert("Event updated successfully!");

        loadEvents();


    } catch (error) {

        console.error("Error updating event:", error);

    }

}


// ==========================================
// LOAD EVENTS WHEN PAGE OPENS
// ==========================================

loadEvents();