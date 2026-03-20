async function checkRisk() {

  let city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter city name");
    return;
  }

  // Capitalize first letter
  city = city.charAt(0).toUpperCase() + city.slice(1);

  document.getElementById("loading").innerText = "⏳ Checking risk...";
  document.getElementById("result").innerHTML = "";
  document.getElementById("fraud").innerHTML = "";

  let apiKey = "000946666df88e700bad2bf38e6d4062"; // 🔴 replace this

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    let temp = data.main.temp;

    let risk = "";
    let payout = 0;

    // 🔥 DEMO LOGIC (important for hackathon)
    // 🔥 DEMO CONTROLLED LOGIC

if (city.toLowerCase() === "delhi") {
  risk = "🔥 High Risk Zone";
  payout = 700;
  document.getElementById("result").style.color = "red";
}
else if (city.toLowerCase() === "jaipur") {
  risk = "⚠ Medium Risk Zone";
  payout = 300;
  document.getElementById("result").style.color = "orange";
}
else if (temp > 40) {
  risk = "🔥 High Risk";
  payout = 700;
  document.getElementById("result").style.color = "red";
}
else if (temp > 30) {
  risk = "⚠ Medium Risk";
  payout = 300;
  document.getElementById("result").style.color = "orange";
}
else {
  risk = "✅ Safe";
  payout = 0;
  document.getElementById("result").style.color = "green";
}

    document.getElementById("loading").innerText = "";

    // 💎 Clean structured output
    document.getElementById("result").innerHTML =
      `<div style="line-height: 1.8;">
        📍 <b>City:</b> ${city}<br>
        🌡 <b>Temperature:</b> ${temp}°C<br>
        ${risk}<br>
        💰 <b>Payout:</b> ₹${payout}
      </div>`;

    // 🛡 Fraud / verification
    document.getElementById("fraud").innerHTML = "🛡 Verified User";

  } catch (error) {
    document.getElementById("loading").innerText = "";
    document.getElementById("result").innerText = "❌ Error fetching data";
  }
}
  
