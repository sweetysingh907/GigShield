async function checkWeather() {
  const city = document.getElementById("city").value;
  const apiKey = "000946666df88e700bad2bf38e6d4062"; // 🔥 paste your key here

  if (city === "") {
    document.getElementById("result").innerText = "⚠️ Please enter a city";
    return;
  }

  document.getElementById("result").innerText = "⏳ Checking risk...";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data.cod !== 200) {
      document.getElementById("result").innerText =
        "❌ City not found";
      return;
    }

    const temp = data.main.temp;

    let result = "";

    if (temp > 40 && city.toLowerCase() === "delhi") {
      result = `🔥 High Risk Zone!
🌡️ Temp: ${temp}°C
💰 ₹700 payout initiated`;
    } 
    else if (temp > 40) {
      result = `🔥 Extreme Heat!
🌡️ Temp: ${temp}°C
💰 ₹500 payout`;
    } 
    else if (temp > 30) {
      result = `🌤️ Moderate Heat
🌡️ Temp: ${temp}°C
💰 ₹300 payout`;
    } 
    else if (temp < 5) {
      result = `❄️ Cold Wave
🌡️ Temp: ${temp}°C
💰 ₹300 payout`;
    } 
    else {
      result = `✅ Safe Conditions
🌡️ Temp: ${temp}°C
📍 ${data.name}
No payout needed`;
    }

    document.getElementById("result").innerText = result;

  } catch (error) {
    document.getElementById("result").innerText =
      "⚠️ Error fetching data";
    console.error(error);
  }
}