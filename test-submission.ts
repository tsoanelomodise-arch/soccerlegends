
const testData = {
  title: "Mr",
  firstName: "Jane",
  surname: "Doe",
  email: "jane.doe@example.com",
  identification: "9876543210",
  cellphone: "0712345678",
  doctorName: "Dr. Roberts",
  doctorContact: "0112223333",
  nextOfKin: "John Doe (Husband)",
  socialConsent: "yes",
  comments: "This is an automated test submission to verify the Resend integration.",
  playerName: "Junior Doe",
  playerDob: "2012-05-15",
  playerPosition: "Midfielder",
  playerSkillLevel: "Advanced",
  goals: 12,
  assists: 8,
  minutesPlayed: 1200,
  playerImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80"
};

async function sendTest() {
  console.log("Starting test submission to http://localhost:3000/api/register...");
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Success! Test submission sent successfully.");
      console.log("Response:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Failed. Server returned an error.");
      console.error("Status:", response.status);
      console.error("Error Detail:", JSON.stringify(result, null, 2));
      console.log("\nNote: This will fail if RESEND_API_KEY is not set in the environment.");
    }
  } catch (error) {
    console.error("❌ Error connecting to server:", error.message);
    console.log("Make sure the dev server is running on port 3000.");
  }
}

sendTest();
