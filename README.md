# Slice Drys

# Node.js >= v18.18

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 1. Install dependencies:

```bash
npm i
# or
yarn
```

If you have an error during installation use the command:

```bash
npm i --legacy-peer-deps
# or
yarn --legacy-peer-deps
```

## 2. Create MongoDB database:

The project uses a `MongoDB` database. Go to the site [MongoDB](https://www.mongodb.com) create a project and cluster then add a link to your database to the `.env` file.

## 2. Create Cloudinary account:

The project uses the `Cloudinary` platform to work with images. Go to the site [Cloudinary](https://cloudinary.com/home), register and add your keys and cloud name to the `.env` file.

## 3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

## 4. Build and run project:

```bash
npm run build
# or
yarn build
```

and

```bash
npm run start
# or
yarn start
```

### Additionally:

Check the `.env.example` file, your `.env` file should have the same variables but filled with your data.

The site's `admin panel` is located at [http://localhost:3000/en/admin](http://localhost:3000/en/admin).