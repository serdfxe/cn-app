// const config = {
//     baseURL: window.location === "localhost" ? "http://localhost:3000" : "https://proxy.custom-notion.ru:443",
//     authBaseURL: window.location === "localhost" ? "http://localhost:8000" : "https://auth.custom-notion.ru:443",
//     notesBaseURL: window.location === "localhost" ? "http://localhost:8000" : "https://notes.custom-notion.ru:443",
//     mediaBaseURL: window.location === "localhost" ? "http://localhost:8000" : "https://media.custom-notion.ru:443",
//     reminderBaseURL: window.location === "localhost" ? "http://localhost:8000" : "https://reminder.custom-notion.ru:443",
// }

const config = {
    baseURL: "https://proxy.memorand.ru",
    authBaseURL: "http://localhost:8000",
    notesBaseURL: "http://localhost:8000",
    mediaBaseURL: "http://localhost:8000",
    reminderBaseURL: "http://localhost:8000",
}

export {
    config,
}