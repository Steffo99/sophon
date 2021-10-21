# Sophon

_A research hub for universities_


## Goal

The goal of this project is developing a platform that universities can use to **host** and **share** their _datasets_, _research projects_ and resulting
_papers_.


## Development

The project consists of four parts:

- a **single-page-app** built with [React][react] (`/frontend`);
- a **web API** built with [Django Rest Framework][drf] (`/backend`);
- a **dynamic proxy** implemented on the [Apache HTTP Server][httpd] (`/proxy`);
- a **Docker image** containing a single instance of [JupyterLab][jupyterlab] (`/jupyter`)

[react]: https://reactjs.org/
[drf]: https://www.django-rest-framework.org/
[httpd]: https://httpd.apache.org/
[jupyterlab]: https://jupyter.org/

For more details on the underlying libraries, packages, modules and plugins used, see the following files:

- [`/frontend/package.json`][lib-frontend]
- [`/backend/pyproject.toml`][lib-backend]
- [`/proxy/httpd.conf`][lib-proxy]
- [`/jupyter/Dockerfile`][lib-jupyter]

[lib-frontend]: https://github.com/Steffo99/sophon/blob/main/frontend/package.json
[lib-backend]: https://github.com/Steffo99/sophon/blob/main/backend/pyproject.toml
[lib-proxy]: https://github.com/Steffo99/sophon/blob/main/proxy/httpd.conf
[lib-jupyter]: https://github.com/Steffo99/sophon/blob/main/jupyter/Dockerfile


### Progress

Development progress is tracked on [issue #20](https://github.com/Steffo99/sophon/issues/20).


### Tools

Sophon is being developed using [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/): its metadata is included in the `.idea` directory so that the code
style and tools are consistent across all machines used during the development.

Run configurations for *running the backend*, *testing the backend* and *running the frontend* are included.


### Commits

Commits names are prefixed with a variant of [Gitmoji](https://gitmoji.dev/) which follows roughly this legend:

- ✨ New feature
- 🔧 Refactor or tweak
- 🐛 Bug fix
- 🧹 Cleanup
- 📔 Documentation
- 🗒 Readme
- ⬆ Dependency update
- 📦 Packaging
- 🔨 Tool update
- 🚧 Work in progress


### People

The project is currently being developed by [Stefano Pigozzi](https://github.com/Steffo99/), under the tutoring of [Francesco Faenza](https://github.com/Cicciodev) and [Claudia Canali](https://weblab.ing.unimore.it/people/canali/).
