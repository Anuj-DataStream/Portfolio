// C++ code
//
#include <Servo.h>

int pos = 0;

int soil_sensor = 0;

Servo servo_7;

void setup()
{
  pinMode(3, INPUT);
  servo_7.attach(7, 500, 2500);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
}

void loop()
{
  soil_sensor = analogRead(A1);
  if (soil_sensor <= 400) {
    servo_7.write(180);
    digitalWrite(4, HIGH);
    digitalWrite(5, LOW);
  } else {
    servo_7.write(0);
    digitalWrite(4, LOW);
    digitalWrite(5, HIGH);
  }
  delay(1); // Delay a little bit to improve simulation performance
}