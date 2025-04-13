// C++ code
//
#include <Servo.h>

int pos = 0;

int soil_sensor = 0;

Servo servo_9;

Servo servo_8;

Servo servo_7;

Servo servo_6;

void setup()
{
  pinMode(A0, INPUT);
  servo_9.attach(9, 500, 2500);
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(A1, INPUT);
  servo_8.attach(8, 500, 2500);
  pinMode(A2, INPUT);
  servo_7.attach(7, 500, 2500);
  pinMode(A3, INPUT);
  servo_6.attach(6, 500, 2500);
}

void loop()
{
  soil_sensor = analogRead(A0);
  if (soil_sensor <= 100) {
    servo_9.write(180);
    digitalWrite(13, HIGH);
    digitalWrite(12, LOW);
  } else {
    servo_9.write(90);
  }
  soil_sensor = analogRead(A1);
  if (soil_sensor <= 100) {
    servo_8.write(180);
    digitalWrite(13, HIGH);
  } else {
    servo_8.write(90);
    digitalWrite(13, LOW);
    digitalWrite(12, HIGH);
  }
  digitalWrite(13, LOW);
  digitalWrite(12, HIGH);
  soil_sensor = analogRead(A2);
  if (soil_sensor <= 100) {
    servo_7.write(180);
    digitalWrite(13, HIGH);
    digitalWrite(12, LOW);
  } else {
    servo_7.write(90);
    digitalWrite(13, LOW);
    digitalWrite(12, HIGH);
  }
  digitalWrite(13, LOW);
  digitalWrite(12, HIGH);
  digitalWrite(12, LOW);
  soil_sensor = analogRead(A3);
  if (soil_sensor <= 100) {
    servo_6.write(180);
    digitalWrite(13, HIGH);
    digitalWrite(12, LOW);
  } else {
    servo_6.write(90);
    digitalWrite(13, LOW);
    digitalWrite(12, HIGH);
  }
  digitalWrite(13, LOW);
  digitalWrite(12, HIGH);
  digitalWrite(12, LOW);
  delay(10); // Delay a little bit to improve simulation performance
}