---
name: Pulse Oximeter
tools: [Arduino, Python]
image: https://github.com/saehuihwang/pulse_ox/blob/main/Media/pulseox_wiring_diagram.png?raw=true
description: An inexpensive arduino-based pulse oximeter
---

# Arduino Pulse Oximeter and Browser App

#### [Source Code](https://github.com/saehuihwang/pulse_ox)

This project is an inexpensive arduino-based pulse oximeter. The design is characterized by its small size and robust digital signal processing.  
![alt text](https://github.com/saehuihwang/pulse_ox/blob/main/Media/pulseox_wiring_diagram.png?raw=true)

### App & User Interface

To run the app, run

`bokeh serve --show pulseox_app.py`

On the command line.  
The following user interface will show, displaying the heartrate, and the blood oxygen concentration below.
![alt text](https://github.com/saehuihwang/pulse_ox/blob/main/Media/UI.png?raw=true)
