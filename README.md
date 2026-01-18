# Slice Drys

# Node.js >= v18.18

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 1. Install dependencies:

```bash
bun
```

//
If you have an error during installation use the command:

```bash
bun install
```

## 2. Create MongoDB database:

The project uses a `MongoDB` database. Go to the site [MongoDB](https://www.mongodb.com) create a project and cluster then add a link to your database to the `.env` file.

## 3. Create Cloudinary account:

The project uses the `Cloudinary` platform to work with images. Go to the site [Cloudinary](https://cloudinary.com/home), register and add your keys and cloud name to the `.env` file.

## 4. Run the development server:

```bash
bun --bun next dev
```

## 5. Build and run project:

```bash
bun --bun next build
```

and

```bash
bun --bun next star
```

### Additionally:

Check the `.env.example` file, your `.env` file should have the same variables but filled with your data.

The site's `admin panel` is located at [http://localhost:3000/en/admin](http://localhost:3000/en/admin).
