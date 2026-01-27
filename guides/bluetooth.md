# DietPi Bluetooth Audio

A comprehensive guide for connecting speakers to Raspberry Pi.

## 1. Core Foundations

**DietPi** is based on **Debian** (v12 "Bookworm" or v13 "Trixie"). It uses the lightweight **Dropbear** SSH server by default (User: `root`, Pass: `dietpi`).

## 2. Hardware & Software Setup

Before pairing, you must initialize the Bluetooth hardware and the ALSA audio bridge:

1. Run `dietpi-config` → **Advanced Options** → **Bluetooth [On]**.
2. **Reboot** to apply hardware changes.
3. Install the bridge tools: `sudo apt update && sudo apt install bluez-alsa-utils`.

## 3. Master Class: Bluetoothctl Pairing

The `bluetoothctl` utility is the primary interface for managing your Bluetooth stack. Follow this detailed sequence to ensure a stable connection:

### A. Initializing the Controller

Launch the tool by typing `bluetoothctl`. Before scanning, ensure the Pi's controller is ready:

```
power on
agent on
default-agent
```

### B. Discovery & Pairing

1. **Scan:** Type `scan on`. Put your speaker in pairing mode. Look for a device matching your speaker's name and note its MAC address (e.g., `E4:56:02:21:4B:92`).
2. **Stop Scan:** Once found, type `scan off` to reduce interference.
3. **Pair:** Run `pair [MAC]`. If prompted for a PIN, enter it (usually `0000` or `1234`), though most modern speakers pair automatically.
4. **Trust:** Run `trust [MAC]`. This is critical; it allows the speaker to reconnect without manual confirmation.
5. **Connect:** Run `connect [MAC]`. You should hear a chime from your speaker.

> **Pro Tip:** If the connection fails with an "Org.bluez.Error" message, try running `remove [MAC]` and start the pairing sequence again from Step 3.

## 4. Testing the Audio

Once connected, you should verify that audio is correctly routing to the speaker. We use the `speaker-test` utility for this.

### The Test Command

```
speaker-test -t wav -c 2
```

<small>This will play "Front Left" and "Front Right" voices in a loop. Press **Ctrl+C** to stop.</small>

### Troubleshooting No Sound

If the command runs but you hear nothing, check the following:

- **Volume:** Run `alsamixer` to check if the volume is muted or low.
- **Routing:** Ensure your `/etc/asound.conf` file is pointing to the correct Bluetooth MAC address.
- **Service:** Verify the bluealsa service is running: `systemctl status bluealsa`.

## 5. Connection Hierarchy

| Command | Status | Persistence |
| :--- | :--- | :--- |
| `pair` | Cryptographic Bond | Permanent |
| `trust` | Security Clearance | Permanent |
| `connect` | Active Session | Temporary (Link) |

## 6. Automation (The "Seamless" Setup)

Since DietPi is minimal, use **Cron** to ensure your speaker stays connected automatically.

**The Script:** `/home/dietpi/reconnect_speaker.sh`

```bash
#!/bin/bash
# Replace with your actual MAC address
MAC="XX:XX:XX:XX:XX:XX"

if bluetoothctl info $MAC | grep -q "Connected: yes"; then
exit 0
else
bluetoothctl connect $MAC
fi
```

**The Schedule:** Run `crontab -e` and add this line for a 5-minute check:

```
*/5 * * * * /home/dietpi/reconnect_speaker.sh > /dev/null 2>&1
```

---
Built for DietPi on Raspberry Pi.
