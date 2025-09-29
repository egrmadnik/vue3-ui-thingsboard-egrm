# WSL setup: Run ThingsBoard backend (Docker) on Ubuntu WSL2

## Recommended: Docker Desktop + WSL2 integration

- **Prerequisites**
  - Windows 10/11 with WSL2 and Ubuntu installed
  - Docker Desktop for Windows
- **Enable WSL integration**
  - Docker Desktop → Settings → General: enable "Use the WSL 2 based engine"
  - Docker Desktop → Settings → Resources → WSL Integration: enable for your Ubuntu distro
- **Run from Ubuntu (WSL) shell**

  ```bash
  cd /mnt/c/Users/edvard/Documents/code/thingsboard-ui-vue3-egrm
  docker compose pull
  docker compose run --rm tb install
  docker compose up -d
  docker compose logs -f tb
  ```

- **Access UI**: <http://localhost:8080>
  - Login: `sysadmin@thingsboard.org` / `sysadmin`

## Alternative: Native Docker Engine inside WSL Ubuntu (no Docker Desktop)

1) Enable systemd in WSL (if not already):

   - In PowerShell:

     ```powershell
     wsl.exe --shutdown
     ```
   - In Ubuntu, edit `/etc/wsl.conf`:

     ```ini
     [boot]
     systemd=true
     ```
   - In PowerShell again:

     ```powershell
     wsl.exe --shutdown
     ```
   - Reopen Ubuntu.

2) Install Docker Engine and compose plugin:

   ```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg lsb-release
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   sudo usermod -aG docker $USER
   newgrp docker
   sudo systemctl enable --now docker
   ```

3) Run ThingsBoard:

   ```bash
   cd /mnt/c/Users/edvard/Documents/code/thingsboard-ui-vue3-egrm
   docker compose pull
   docker compose run --rm tb install
   docker compose up -d
   docker compose logs -f tb
   ```

- **Access UI**: <http://localhost:8080>

## Troubleshooting

- If `permission denied` with Docker: ensure your user is in the `docker` group, reopen terminal or run `newgrp docker`.
- If port 8080 is busy: change the `8080:8080` mapping in `docker-compose.yml`.
- Reset stack if switching TB versions:

  ```bash
  docker compose down -v
  docker compose pull
  docker compose run --rm tb install
  docker compose up -d
  ```
