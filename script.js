const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
const dustTopic = 'phycom/66070271'; // เปลี่ยนเป็น topic ที่ต้องการ
let lastDustValue = 0; // เก็บค่าฝุ่นล่าสุด

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(dustTopic, (err) => {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log(`Subscribed to topic: ${dustTopic}`);
        }
    });
});

client.on('message', (topic, message) => {
    lastDustValue = message.toString();
    document.getElementById('dustValue').textContent = `${lastDustValue} µg/m³`;
    updateStatus(lastDustValue);
});

function updateStatus(value) {
    const statusElement = document.getElementById('status');
    if (value < 35) {
        statusElement.textContent = "สถานะ: ดีมาก";
        statusElement.style.color = "#388e3c"; // สีเขียว
    } else if (value < 75) {
        statusElement.textContent = "สถานะ: ปานกลาง";
        statusElement.style.color = "#ff9800"; // สีส้ม
    } else {
        statusElement.textContent = "สถานะ: ไม่ดี";
        statusElement.style.color = "#d32f2f"; // สีแดง
    }
}

document.getElementById('saveBtn').addEventListener('click', () => {
    const entryName = document.getElementById('entryName').value.trim();
    const popup = document.getElementById('popup');
    if (entryName && lastDustValue) {
        const logDiv = document.createElement('div');
        const currentTime = new Date().toLocaleString();
        logDiv.className = 'log-item';
        logDiv.textContent = `${entryName}: ${lastDustValue} µg/m³ (สถานะ: ${document.getElementById('status').textContent}) เวลา: ${currentTime}`;
        document.getElementById('log').appendChild(logDiv);
        document.getElementById('entryName').value = '';

        // แสดง popup
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000);
    } else {
        alert('กรุณากรอกชื่อบันทึกและตรวจสอบค่าฝุ่น');
    }
});
