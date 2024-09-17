<div align="center">

# Sophon

Research hub for universities

</div>

> [!Danger]
> This project is not currently being maintained due to a sudden lack of external interest.

## Links

[![On ACM Digital Library](https://img.shields.io/badge/acm%20digital%20library-open%20access-b95709)](https://dl.acm.org/doi/abs/10.1145/3491418.3535163)


## Goal

The goal of this project is developing a platform that universities can use to **host** and **share** their _datasets_, _research projects_ and resulting _papers_.


## Screenshots

![Screenshot 1](https://user-images.githubusercontent.com/1540885/138204295-59c6efc3-a4fe-4c91-982b-8257e42b7970.png)

![Screenshot 2](https://user-images.githubusercontent.com/1540885/138204345-346d144f-914f-4435-8816-69abe4a34381.png)

![Screenshot 3](https://user-images.githubusercontent.com/1540885/138204387-69cd2e63-3030-48b8-a149-043e3e2393f7.png)


## Installation

### Requirements

- Internet connection
- Any Linux server
- [Docker][what-is-docker]
- [Docker Compose][what-is-compose]

[what-is-docker]: https://www.docker.com/

[what-is-compose]: https://docs.docker.com/compose/


### Steps

1. Create a new directory named `sophon` on your machine and enter it:
   ```console
   # mkdir sophon
   # cd sophon
   ```

2. Pull the `ghcr.io/steffo99/sophon-jupyter` Docker image:
   ```console
   # docker pull ghcr.io/steffo99/sophon-jupyter
   ```

3. Download the `docker-compose.yml` file from this repository:
   ```console
   # wget "https://raw.githubusercontent.com/Steffo99/sophon/main/docker-compose.yml"
   ```

4. Configure the `docker-compose.yml` file following the instructions written in the comments:
   ```console
   # vim docker-compose.yml
   ```

5. Start the Docker containers:
   ```console
   # docker compose up -d
   ```


## Structure

The project consists of four parts:

- a **single-page-app** built with [React][what-is-react] (`/frontend`);
- a **web API** built with [Django Rest Framework][what-is-drf] (`/backend`);
- a **dynamic proxy** implemented on the [Apache HTTP Server][what-is-httpd] (`/proxy`);
- a **Docker image** containing a single instance of [JupyterLab][what-is-jupyterlab] (`/jupyter`)

[what-is-react]: https://reactjs.org/

[what-is-drf]: https://www.django-rest-framework.org/

[what-is-httpd]: https://httpd.apache.org/

[what-is-jupyterlab]: https://jupyter.org/

For more details on the underlying libraries, packages, modules and plugins used, see the following files:

- [`/frontend/package.json`][lib-frontend]
- [`/backend/pyproject.toml`][lib-backend]
- [`/proxy/httpd.conf`][lib-proxy]
- [`/jupyter/Dockerfile`][lib-jupyter]

[lib-frontend]: https://github.com/Steffo99/sophon/blob/main/frontend/package.json

[lib-backend]: https://github.com/Steffo99/sophon/blob/main/backend/pyproject.toml

[lib-proxy]: https://github.com/Steffo99/sophon/blob/main/proxy/httpd.conf

[lib-jupyter]: https://github.com/Steffo99/sophon/blob/main/jupyter/Dockerfile


## Development

### Progress

Development progress is tracked on issues [#20][issue-#20] and [#67][issue-#67].  
Also see the [issue tracker][issue-tracker].

[issue-#20]: https://github.com/Steffo99/sophon/issues/20

[issue-#67]: https://github.com/Steffo99/sophon/issues/67

[issue-tracker]: https://github.com/Steffo99/sophon/issues


### Tools

Sophon is developed using [IntelliJ IDEA Ultimate][what-is-idea].

Metadata is included in the `/.idea` directory so that code style and run configuration are consistent across all machines used during the development.

Run configurations for *running the backend*, *testing the backend*, *running the frontend* and *testing the frontend* are included.

[what-is-idea]: https://www.jetbrains.com/idea/


### Commits

Commits names are prefixed with a variant of [Gitmoji][what-is-gitmoji] which follows roughly this legend:

- ✨ New feature
- 🔧 Refactor or tweak
- 🐛 Bug fix
- 🧹 Cleanup
- 📔 Documentation
- 🎓 Thesis
- 🗒 Readme
- ⬆ Dependency update
- 📦 Packaging
- 🔨 Tool update
- 🚧 Work in progress
- 🔀 Merge

[what-is-gitmoji]: https://gitmoji.dev/


### Continuous Deployment (CD)

Sophon uses [GitHub Actions][what-is-github-actions] and [Vercel][what-is-vercel] for Continuous Deployment.

[what-is-vercel]: https://vercel.com/

[what-is-github-actions]: https://docs.github.com/en/actions

Docker images for the frontend, backend, proxy and jupyterlab are built by GitHub Actions **on each push to the `main` branch** of this repository,
and [automatically published][list-containers] to the [GitHub Container Registry][what-is-github-containers]

[list-containers]: https://github.com/Steffo99?tab=packages&repo_name=sophon

[what-is-github-containers]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

A generic version of the frontend is build automatically by Vercel **on each push to the `main` branch** and **on every pull request** to this repository, and
automatically published to the [sophon.steffo.eu](https://sophon.steffo.eu) domain.


### Releases

Releases are created on each milestone and are available on the [Releases page][list-releases].

[list-releases]: https://github.com/Steffo99/sophon/releases


## People

The project is developed by [Stefano Pigozzi][who-is-stefano-pigozzi] for [Università degli studi di Modena e Reggio Emilia][what-is-unimore].

[who-is-stefano-pigozzi]: https://steffo.eu

[what-is-unimore]: https://www.unimore.it/
