# ! pre run check: docker compose and npm to be installed in dev env

cd ../frontend; npm i; npm run build
cd ../deployment
cp -r ../frontend/dist ./nginx/
docker compose up --build -d
