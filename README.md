<img src="apps/web/public/og-image.png" min-width="200px" max-width="250px" width="400px" align="right" alt="Computer">

# Weather.io

Weather.io is a simple,
user-friendly application that fetches
and displays real-time weather data for any city
using the [OpenWeatherMap API](https://openweathermap.org/api) and [Open Meteo API](https://open-meteo.com).

## How to start

After you installed pnpm (you can look here at the [installation guide](https://pnpm.io/installation)), you can run the following command:
`pnpm install` <br>
This will install all the dependencies for the project.
<br> <br>
Next you will have to fill the `.env` file with your own API keys, following the `.env.example` file as a guide.
<br> <br>
After that you can run the following command, to look at the current state (with your own changes) of the project:
`pnpm dev`

## What's next? Which technologies are used?

<div align="center">
	<table>
		<tr>
			<td><code><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/5f8c622c-c217-4649-b0a9-7e0ee24bd704" alt="Next.js" title="Next.js"/></code></td>
			<td><code><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/25181517/1275d076-f047-432b-9084-308f88f8c176" alt="tRPC" title="tRPC"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code></td>
			<td><code><img width="50" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/></code></td>
			<td><code><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/25181517/37cb517e-d059-4cc0-8124-1a72b663167c" alt="Playwright" title="Playwright"/></code></td>
		</tr>
	</table>
</div>

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://discord.gg/VUv9vAHyjW) and ask for help.

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://www.typescriptlang.org)
- [Turborepo](https://turbo.build/repo)
- [Playwright](https://playwright.dev)
- [Convex](https://convex.dev)
#### APIs
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Open Meteo API](https://open-meteo.com)
- [QWeather API](https://dev.qweather.com/en/)
- [API Ninjas API](https://api-ninjas.com/) (For the Reverse Geocoding)

## Project Structure
```text
.github
  └─ workflows
        ├─ Playwright tests
        ├─ Update Convex Deployment
        └─ CI with pnpm cache setup
apps
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ city-data
  |    ├─ Convex Files for the database and convex functions
  |    └─ Scripts for pulling the city-data
  ├─ e2e-web-tests
  |    └─ Playwright tests for the Next.js app
  ├─ types 
  |    └─ Types that are used across the whole project  
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui and custom components
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow the T3 deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

#### Create T3 App & Create T3 Turbo

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

The Turborepo structure is from [Create T3 Turbo](https://github.com/t3-oss/create-t3-turbo).
