# Siteyi derler ve nginx ile sunar. Coolify'da "Dockerfile" derleme paketiyle kullanılır;
# başka bir Docker sunucusunda da aynen çalışır (port 80).

FROM node:22-bookworm-slim AS derleme
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# İsteğe bağlı ziyaretçi sayacı (istatistik.bumba.tr üzerindeki Umami site kimliği)
ARG PUBLIC_UMAMI_ID=
ENV PUBLIC_UMAMI_ID=$PUBLIC_UMAMI_ID
RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=derleme /app/dist /usr/share/nginx/html
EXPOSE 80
