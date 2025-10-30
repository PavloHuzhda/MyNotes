# ===== BUILD STAGE =====
FROM node:20 AS build
WORKDIR /app

# Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо решту коду
COPY . .
# Встановлюємо змінну оточення для продакшн збірки
ENV NODE_ENV=production
# Збираємо React (Vite)
RUN npm run build

# ===== RUNTIME STAGE =====
FROM nginx:stable-alpine

# Видаляємо дефолтну конфігурацію Nginx (опційно)
RUN rm /etc/nginx/conf.d/default.conf

# Копіюємо згенерований билд
COPY --from=build /app/dist /usr/share/nginx/html

# Додаємо власний конфіг (опційно, якщо потрібен router fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
