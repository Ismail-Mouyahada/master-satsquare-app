```bash
    docker build \
  --build-arg DATABASE_URL="postgresql://ismail:ieMfgjIETD9is76kdkDihSnZQnE9KqOg@dpg-cr6cvj5svqrc73c1f290-a.frankfurt-postgres.render.com/sat_square_db" \
  --build-arg NEXT_AUTH_SECRET="CP912ECDSClsdezoPDZCMSJXCPISJCIY20SmfdsFOYDflHZORdsvdsFOZIRGOIZHGOURHZ" \
  --build-arg NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="http://localhost:5157" \
  -t my-app-image .

```
