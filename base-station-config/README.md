# Base Station Config Files

This directory contains configuration files/scripts for whatever
computer we're running Mission Control on, similar to the
`rover-config` directory in the
[Resurgence](https://github.com/huskyroboticsteam/Resurgence)
repository (which contains config files for the Jetson).

Some of the files include:

- `50-logitech-f710.rules`
- `setup-f710.sh`
## Logitech F710 Gamepad Setup

We're currently using the Logitech F710 wireless gamepad on the actual
base station; however there's some weirdness with Linux and some of
the axes are swapped. The `setup-f710.sh` script will remap the axes
to their correct positions and also apply calibration to the
joysticks; the `50-logitech-f710.rules** udev rules will run this
script automatically whenever the gamepad is plugged in.

**To install, run** `chmod +x setup-f710.sh && sudo cp
50-logitech-f710.rules setup-f710.sh /etc/udev/rules.d/`, and then
`sudo udevadm control --reload-rules`. You will also need to make sure
the `jscal` program is installed with `sudo apt install joystick`.
