const int leftButton = 2;
const int rightButton = 3;

void setup() {
  Serial.begin(9600);
  pinMode(leftButton, INPUT_PULLUP);
  pinMode(rightButton, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(leftButton) == LOW) {
    Serial.println("LEFT");
    delay(100); 
  }
  if (digitalRead(rightButton) == LOW) {
    Serial.println("RIGHT");
    delay(100); 
  }
}