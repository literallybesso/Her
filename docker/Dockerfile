FROM nginx:alpine

# Remove the default index page from Nginx
RUN rm -rf /usr/share/nginx/html/*

# Just set up the container — we’ll mount content later
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
