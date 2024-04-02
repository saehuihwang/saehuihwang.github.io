---
name: Portable Electrocardiogram
tools: [ESP32]
# image: /assets/images/SNUPPY.jpg
# description:
pdf: /assets/publications/Final Report.pdf
---

# Portable Electrocardiogram

My colleageus Hamza Abdul-Ghani, Grace Ding and I've made an inexpensive portable electrocardiogram, otherwise known as an EKG.

## Goals

The goal of this project is to create an affordable ECG device that can be used regularly at home. To provide adequate data for medical diagnostics, we plan to design the ECG to compute Leads I/II/III and report the estimated angle of the heart. The user can view the trace on an integrated display, on a computer over USB, or on a smartphone application over Low Energy Bluetooth. CSV data to plot the measured trace will also be recorded on an SD card. An LED indicator will light with each heartbeat, and an optionally enabled speaker will beep with each heartbeat. To power the device while maintaining enforced isolation from mains electricity, a lithium polymer battery will supply the power rails to the system. The device will not function while the battery is charging.

{% include elements/video.html video_ids="BthJ6cHA9PI" %}
