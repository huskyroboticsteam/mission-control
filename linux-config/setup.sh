script_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$script_path" # cd to script dir so relative paths work

sudo apt-get install -y joystick

sudo cp map_gamepad.sh /usr/local/bin/map_gamepad.sh
sudo cp 90-gamepad.rules /etc/udev/rules.d
