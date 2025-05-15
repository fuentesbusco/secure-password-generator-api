#!/bin/bash

# Salir inmediatamente si un comando falla
set -e

# --- Configuración - MODIFICA ESTAS VARIABLES ---
# Ruta a tu clave .pem (usa el formato de WSL o Git Bash)
# Ejemplo WSL: PEM_KEY="/mnt/c/Users/TuUsuario/claves/mi-ec2-llave.pem"
# Ejemplo Git Bash: PEM_KEY="/c/Users/TuUsuario/claves/mi-ec2-llave.pem"
PEM_KEY=".ssh/key.pem"

# Ruta local a la carpeta de tu proyecto (usa el formato de WSL o Git Bash)
# Ejemplo WSL: LOCAL_PROJECT_PATH="/mnt/c/Users/TuUsuario/proyectos/secure-password-generator-api"
# Ejemplo Git Bash: LOCAL_PROJECT_PATH="/c/Users/TuUsuario/proyectos/secure-password-generator-api"
LOCAL_PROJECT_PATH="/c/Users/dfuentes/secure-password-generator-api"

EC2_USER="ubuntu"  # Usuario en tu instancia EC2 (común para Ubuntu AMIs)
EC2_HOST="13.51.160.131" # IP de tu servidor EC2

# Ruta en el servidor donde se desplegará el proyecto
REMOTE_PROJECT_PATH="/home/$EC2_USER/secure-password-generator-api"

# Nombre de la aplicación en PM2 (el que usaste en ecosystem.config.js)
PM2_APP_NAME="secure-password-generator-api-prod"
# -------------------------------------------------
# Nombre del archivo temporal para el paquete
ARCHIVE_NAME="project_archive.tar.gz"
# -------------------------------------------------

echo ">>> INICIANDO DESPLIEGUE en $EC2_HOST <<<"

# 1. Navegar al directorio del proyecto local
echo ">>> Accediendo al directorio local del proyecto: $LOCAL_PROJECT_PATH <<<"
cd "$LOCAL_PROJECT_PATH"

# 2. Crear un archivo comprimido del proyecto, excluyendo node_modules, .git, etc.
echo ">>> Creando archivo comprimido '$ARCHIVE_NAME' (excluyendo node_modules, .git, dist, .env)... <<<"
# Asegúrate que el nombre del archivo de salida del tar no exista ya en las exclusiones o en el directorio actual
# si eso pudiera causar problemas.
# Si el archivo ARCHIVE_NAME ya existe de un despliegue anterior, lo sobrescribirá.
tar --exclude='./node_modules' \
    --exclude='./.git' \
    --exclude='./.ssh' \
    --exclude='./deploy.sh' \
    --exclude='./dist' \
    --exclude='./test' \
    --exclude='./.env' \
    --exclude='./coverage' \
    --exclude="./$ARCHIVE_NAME" \
    -czvf "$ARCHIVE_NAME" .
    # El "." al final significa "directorio actual"

echo ">>> Transfiriendo archivo '$ARCHIVE_NAME' al servidor ($EC2_HOST)... <<<"
# Crear el directorio remoto si no existe
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_HOST" "mkdir -p $REMOTE_PROJECT_PATH"
# Copiar el archivo comprimido
scp -i "$PEM_KEY" "$ARCHIVE_NAME" "$EC2_USER@$EC2_HOST:$REMOTE_PROJECT_PATH/$ARCHIVE_NAME"

# 3. Limpiar el archivo comprimido local
echo ">>> Limpiando archivo comprimido local '$ARCHIVE_NAME'... <<<"
rm "$ARCHIVE_NAME"

# Volver al directorio original por si acaso (opcional, ya que el script termina)
# cd -

echo ">>> Ejecutando comandos remotos en el servidor... <<<"
ssh -i "$PEM_KEY" "$EC2_USER@$EC2_HOST" << EOF
  set -e # Salir si un comando falla dentro de la sesión SSH
  
  # --- Cargar NVM ---
  export NVM_DIR="\$HOME/.nvm" # Usar \$HOME para que se evalúe en el servidor
  # Cargar nvm.sh si existe
  [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
  # Cargar bash_completion (opcional para el script pero parte de la carga estándar de nvm)
  [ -s "\$NVM_DIR/bash_completion" ] && \. "\$NVM_DIR/bash_completion"
  # --------------------

  # (Opcional) Verificar que Node/NPM estén disponibles después de cargar NVM
  echo "Versión de Node: \$(node -v)"
  echo "Versión de NPM: \$(npm -v)"

  echo "--- Accediendo al directorio del proyecto: $REMOTE_PROJECT_PATH ---"
  cd "$REMOTE_PROJECT_PATH"

  echo "--- Extrayendo '$ARCHIVE_NAME'... ---"
  tar -xzvf "$ARCHIVE_NAME"

  echo "--- Limpiando archivo '$ARCHIVE_NAME' del servidor... ---"
  rm "$ARCHIVE_NAME"

  echo "--- Instalando dependencias de producción (npm install --production)... ---"
  # No debería haber node_modules viejos si el tar los excluyó
  npm ci --omit-dev

  echo "--- Construyendo la aplicación (npm run build)... ---"
  # No debería haber dist viejo si el tar lo excluyó
  npm run build

  echo "--- Recargando/Reiniciando la aplicación PM2: $PM2_APP_NAME ---"
  if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
    pm2 reload "$PM2_APP_NAME" --env production --update-env
  else
    pm2 start ecosystem.config.js --env production
  fi

  # echo "--- Guardando configuración de PM2... ---"
  # pm2 save

  echo "--- ¡Despliegue en servidor finalizado exitosamente! ---"
EOF

echo ">>> DESPLIEGUE COMPLETADO <<<"