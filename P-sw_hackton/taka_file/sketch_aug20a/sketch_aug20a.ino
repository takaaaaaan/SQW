// const int turbiditySensorPin = A0; // 탁도 센서를 A0에 연결

// void setup() {
//   // 시리얼 통신 시작
//   Serial.begin(9600);
// }

// void loop() {
//   int sensorValue = analogRead(turbiditySensorPin); // 센서로부터 값을 읽음
//   float voltage = sensorValue * (5.0 / 1023.0); // 아날로그 값을 전압으로 변환 (우노의 경우: 5V)

//   // 시리얼 모니터에 출력
//   Serial.print("탁도 센서 값: ");
//   Serial.println(sensorValue-660);

//   delay(5000); // 1초 간격으로 데이터 출력
//   exit(0);
// }
float turbidity;

void setup() {
  Serial.begin(9600);
  pinMode(A0, INPUT); // センサーがA0ピンに接続されていると仮定
}

void loop() {
  turbidity = analogRead(A0); // A0ピンからのアナログ読取り
  Serial.println(turbidity);
  delay(1000);
}
