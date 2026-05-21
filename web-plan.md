Here is a complete, self-contained Markdown guide that you can save directly to your laptop (e.g., as LEARNING_PATH.md).

It includes the Multipass setup to simulate your Linode server locally, followed by copy-pasteable configurations for your entire 7-step learning roadmap.

---

# Linode Deployment Learning Lab: From Laptop to Cloud

This guide walks you through building a modern, automated web architecture locally using **Multipass** to simulate a cloud server, **Ansible** to automate configuration, **Caddy** for reverse-proxying, and **Authelia** for Single Sign-On (SSO).

---

## Part 1: Setting Up the Local Lab (Multipass)

We will create a completely isolated Ubuntu virtual machine on your laptop to act as our "Fake Linode."

### 1. Install Multipass

* **macOS:** brew install multipass
* **Windows:** Download the installer from multipass.run
* **Linux:** sudo snap install multipass

### 2. Launch the VM

Run this command in your terminal to spin up an Ubuntu 24.04 instance named fake-linode:

```bash
multipass launch --name fake-linode --disk 10G --memory 2G 24.04

```

### 3. Get the VM's IP Address

Run multipass list. Look for the IP address under the IPv4 column:

```bash
multipass list
# Expected output:
# Name           State      IPv4             Image
# fake-linode    Running    192.168.64.15    Ubuntu 24.04 LTS

```

> **Note:** Throughout this guide, replace 192.168.64.15 with *your* VM's actual IP address.

### 4. Inject Your SSH Key

To let Ansible log in without a password, copy your laptop's public SSH key into the VM:

```bash
multipass exec fake-linode -- bash -c "echo '$(cat ~/.ssh/id_rsa.pub)' >> ~/.ssh/authorized_keys"

```

*(If your key uses a different name, like id_ed25519.pub, adjust the command accordingly).*

### 5. Create Your Local Project Workspace

On your laptop, create a folder to hold all your project files:

```bash
mkdir linode-lab && cd linode-lab

```

---

## Part 2: The Step-by-Step Learning Roadmap

### Step 1: System Baseline (Ansible Updates)

We will use Ansible to connect to the VM and update its package manager.

**1. Create your Ansible Inventory (inventory.ini):**

```ini
[linode]
192.168.64.15 ansible_user=ubuntu

```

**2. Create the System Update Playbook (step1-baseline.yml):**

```yaml
---
- name: System Baseline Setup
  hosts: linode
  become: true # Runs commands as root via sudo
  tasks:
    - name: Update apt repository cache
      ansible.builtin.apt:
        update_cache: yes

    - name: Upgrade all packages to their latest version
      ansible.builtin.apt:
        upgrade: dist

```

**3. Run it from your laptop:**

```bash
ansible-playbook -i inventory.ini step1-baseline.yml

```

---

### Step 2: Recovery First (Ansible Backups)

Before modifying the server heavily, we want a reliable way to pull data back to our laptop.

**1. Create the Backup Playbook (step2-backup.yml):**

```yaml
---
- name: Fetch Remote Backups
  hosts: linode
  tasks:
    - name: Ensure dummy backup folder exists on server
      ansible.builtin.file:
        path: /opt/infrastructure/backups
        state: directory

    - name: Create a mock data file on the server to simulate data
      ansible.builtin.copy:
        content: "Database or user configuration files go here."
        dest: /opt/infrastructure/backups/data_dump.txt

    - name: Pull the backup file securely to your laptop
      ansible.builtin.fetch:
        src: /opt/infrastructure/backups/data_dump.txt
        dest: ./local_backups/
        flat: yes

```

**2. Run it:**

```bash
ansible-playbook -i inventory.ini step2-backup.yml

```

*(Check your local directory; you will find a new ./local_backups/data_dump.txt file).*

---

### Step 3: Infrastructure Setup (Docker & Overlay Network)

Now we will automate installing Docker on the server and setting up our shared network.

**1. Create the Docker Setup Playbook (step3-docker.yml):**

```yaml
---
- name: Install Docker and Infrastructure
  hosts: linode
  become: true
  tasks:
    - name: Install dependencies
      ansible.builtin.apt:
        name:
          - docker.io
          - docker-compose-v2
        state: present

    - name: Ensure Docker service is started
      ansible.builtin.systemd:
        name: docker
        state: started
        enabled: yes

    - name: Ensure 'ubuntu' user is in the docker group (so no sudo is needed for docker commands)
      ansible.builtin.user:
        name: ubuntu
        groups: docker
        append: yes

    - name: Create the shared Docker network
      community.docker.docker_network:
        name: web_network
        driver: bridge

```

**2. Run it:**

```bash
ansible-playbook -i inventory.ini step3-docker.yml

```

---

### Step 4: Static Gateway (Manual Caddy in Docker)

We will deploy a traditional Caddy container that serves static files out of a folder on the server.

**1. Create your static site files locally:**

```bash
mkdir site
echo "<h1>Hello from the Dashboard Launchpad!</h1>" > site/index.html

```

**2. Create the Caddy Deployment Playbook (step4-caddy.yml):**

```yaml
---
- name: Deploy Manual Caddy Server
  hosts: linode
  tasks:
    - name: Create directories on the server
      ansible.builtin.file:
        path: "{{ item }}"
        state: directory
      loop:
        - /opt/infrastructure/caddy
        - /opt/infrastructure/site

    - name: Upload static web files to the server
      ansible.builtin.copy:
        src: ./site/index.html
        dest: /opt/infrastructure/site/index.html

    - name: Create Caddyfile on the server
      ansible.builtin.copy:
        dest: /opt/infrastructure/caddy/Caddyfile
        content: |
          http://localhost:80 {
              root * /srv
              file_server
          }

    - name: Write Docker Compose file for Caddy
      ansible.builtin.copy:
        dest: /opt/infrastructure/caddy/docker-compose.yml
        content: |
          services:
            caddy:
              image: caddy:2-alpine
              container_name: caddy_manual
              ports:
                - "80:80"
              volumes:
                - ./Caddyfile:/etc/caddy/Caddyfile
                - /opt/infrastructure/site:/srv
              networks:
                - web_network

          networks:
            web_network:
              external: true

    - name: Start Caddy container
      community.docker.docker_compose_v2:
        project_src: /opt/infrastructure/caddy
        state: present

```

**3. Run it:**

```bash
ansible-playbook -i inventory.ini step4-caddy.yml

```

Open your web browser on your laptop and go to [http://192.168.64.15.](http://192.168.64.15.) You will see your static HTML page.

---

### Step 4.5: The Automation Shift (caddy-docker-proxy)

We will teardown the old manual Caddy setup and transition to the label-based automated discovery version.

**1. Create the Proxy Migration Playbook (step45-proxy.yml):**

```yaml
---
- name: Migrate to Caddy Docker Proxy
  hosts: linode
  tasks:
    - name: Stop and remove the old manual Caddy container
      community.docker.docker_compose_v2:
        project_src: /opt/infrastructure/caddy
        state: absent

    - name: Create directory for the automated proxy
      ansible.builtin.file:
        path: /opt/infrastructure/caddy-proxy
        state: directory

    - name: Deploy caddy-docker-proxy Compose file
      ansible.builtin.copy:
        dest: /opt/infrastructure/caddy-proxy/docker-compose.yml
        content: |
          services:
            caddy:
              image: lucaslorentz/caddy-docker-proxy:2.8-alpine
              container_name: caddy_proxy
              ports:
                - "80:80"
              environment:
                - CADDY_INGRESS_NETWORKS=web_network
              volumes:
                - /var/run/docker.sock:/var/run/docker.sock:ro
                - caddy_data:/data
              networks:
                - web_network
              restart: unless-stopped

          volumes:
            caddy_data:

          networks:
            web_network:
              external: true

    - name: Start Caddy Proxy
      community.docker.docker_compose_v2:
        project_src: /opt/infrastructure/caddy-proxy
        state: present

```

**2. Run it:**

```bash
ansible-playbook -i inventory.ini step45-proxy.yml

```

---

### Step 5: Reverse Proxy (Deploying a Backend App via Labels)

Let's launch a backend container. We won't edit any server config files; Caddy will find the app purely using the Docker labels we supply.

**1. Create the Application Playbook (step5-backend.yml):**

```yaml
---
- name: Deploy Backend Application
  hosts: linode
  tasks:
    - name: Create directory for App 1
      ansible.builtin.file:
        path: /opt/infrastructure/apps/app1
        state: directory

    - name: Write Compose file with Caddy Routing Labels
      ansible.builtin.copy:
        dest: /opt/infrastructure/apps/app1/docker-compose.yml
        content: |
          services:
            hello-app:
              image: nginxdemos/hello:plain-text
              container_name: hello_backend
              networks:
                - web_network
              labels:
                caddy: http://192.168.64.15
                caddy.handle_path: /app1*
                caddy.handle_path.reverse_proxy: "{{upstreams 80}}"

          networks:
            web_network:
              external: true

    - name: Start App 1 Container
      community.docker.docker_compose_v2:
        project_src: /opt/infrastructure/apps/app1
        state: present

```

**2. Run it:**

```bash
ansible-playbook -i inventory.ini step5-backend.yml

```

Go to your laptop's browser and visit [http://192.168.64.15/app1](http://192.168.64.15/app1). Caddy automatically routes you directly into the hidden backend container.

---

### Step 6: The Bouncer (Authelia Integration)

We will deploy Authelia and force incoming requests on /app1 to log in first.

**1. Create the Authelia Setup Playbook (step6-authelia.yml):**

```yaml
---
- name: Deploy Authelia SSO
  hosts: linode
  tasks:
    - name: Create Authelia config directories
      ansible.builtin.file:
        path: /opt/infrastructure/authelia
        state: directory

    - name: Write a minimal Authelia configuration file
      ansible.builtin.copy:
        dest: /opt/infrastructure/authelia/configuration.yml
        content: |
          server:
            address: 'tcp://0.0.0.0:9091/'
          log:
            level: 'info'
          jwt_secret: 'a_very_long_secret_string_for_testing_only'
          default_redirection_url: 'http://192.168.64.15/'
          authentication_backend:
            file:
              path: '/config/users.yml'
          access_control:
            default_policy: 'bypass'
            rules:
              - domain: '192.168.64.15'
                resources:
                  - '^/app1.*$'
                policy: 'one_factor'
          session:
            secret: 'another_secret_string_for_sessions_testing'
            cookies:
              - domain: '192.168.64.15'
                authelia_url: 'http://192.168.64.15/authelia'
          storage:
            local:
              path: '/config/db.sqlite3'
          notifier:
            filesystem:
              filename: '/config/emails.txt'

    - name: Write user database (User: admin / Password: password)
      ansible.builtin.copy:
        dest: /opt/infrastructure/authelia/users.yml
        content: |
          users:
            admin:
              disabled: false
              displayname: "Admin User"
              password: "$argon2id$v=19$m=65536,t=3,p=4$6iS86T6GvH3YUpX7R9u+fQ$0Cms1r7G5U6fXfAOmW0e3VnCg6bK7LgM" # plain text: password
              groups:
                - admins

    - name: Deploy Authelia and update Caddy proxy global labels
      ansible.builtin.copy:
        dest: /opt/infrastructure/authelia/docker-compose.yml
        content: |
          services:
            authelia:
              image: authelia/authelia:latest
              container_name: authelia
              volumes:
                - ./configuration.yml:/config/configuration.yml
                - ./users.yml:/config/users.yml
              networks:
                - web_network
              labels:
                # Tell Caddy how to route traffic to Authelia itself
                caddy: http://192.168.64.15
                caddy.handle_path: /authelia*
                caddy.handle_path.reverse_proxy: "{{upstreams 9091}}"
                
                # Create a global reusable snippet authentication rule
                caddy.forward_auth: "http://192.168.64.15"
                caddy.forward_auth.uri: /authelia/api/authz/forward-auth
                caddy.forward_auth.copy_headers: Remote-User Remote-Groups

          networks:
            web_network:
              external: true

    - name: Launch Authelia
      community.docker.docker_compose_v2:
        project_src: /opt/infrastructure/authelia
        state: present

```

**2. Run it:**

```bash
ansible-playbook -i inventory.ini step6-authelia.yml

```

**3. Update your App 1 Labels to enforce auth:**
Go back into step5-backend.yml, modify your labels to match this configuration, and run ansible-playbook -i inventory.ini step5-backend.yml again:

```yaml
              labels:
                caddy: http://192.168.64.15
                caddy.handle_path: /app1*
                # Add this line to pass requests through the forward auth check first:
                caddy.handle_path.forward_auth: authelia:9091
                caddy.handle_path.forward_auth.uri: /api/authz/forward-auth
                caddy.handle_path.reverse_proxy: "{{upstreams 80}}"

```

Now, navigating to [http://192.168.64.15/app1](http://192.168.64.15/app1) automatically redirects you to a beautiful Authelia login portal. Log in with admin / password to pass through.

---

### Step 7: Development Workflow (Laptop to Server)

When you write your own custom Python/Go code on your laptop, use this standard deployment playbook pattern to containerize and publish it.

**1. The Application Setup:**
Keep a standard Dockerfile inside your application source repository on your laptop:

```dockerfile
# Example Python App Dockerfile
FROM python:3.11-alpine
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["python", "main.py"]

```

**2. Create the App Production Deployment Playbook (step7-deploy.yml):**

```yaml
---
- name: Pipeline - Deploy Custom App from Laptop to Server
  hosts: linode
  vars:
    app_name: "custom-api"
    dest_dir: "/opt/infrastructure/apps/{{ app_name }}"
  tasks:
    - name: Create deployment destination folder on server
      ansible.builtin.file:
        path: "{{ dest_dir }}"
        state: directory

    - name: Copy application source code folder from your laptop to the server
      ansible.posix.synchronize:
        src: ./my-local-code-folder/
        dest: "{{ dest_dir }}/src/"

    - name: Write the Docker Compose file directly over to the server
      ansible.builtin.copy:
        dest: "{{ dest_dir }}/docker-compose.yml"
        content: |
          services:
            web-app:
              build: ./src
              container_name: "{{ app_name }}"
              restart: unless-stopped
              networks:
                - web_network
              labels:
                caddy: http://192.168.64.15
                caddy.handle_path: /{{ app_name }}*
                caddy.handle_path.forward_auth: authelia:9091
                caddy.handle_path.forward_auth.uri: /api/authz/forward-auth
                caddy.handle_path.reverse_proxy: "{{upstreams 8080}}"

          networks:
            web_network:
              external: true

    - name: Command Docker to build the image locally on-server and launch it
      community.docker.docker_compose_v2:
        project_src: "{{ dest_dir }}"
        build: always
        state: present

```

Running ansible-playbook -i inventory.ini step7-deploy.yml will automatically copy your source changes, compile your new code container on the server, hook it up to Authelia authentication, and make it instantly reachable at [http://192.168.64.15/custom-api](http://192.168.64.15/custom-api).
