# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

import datetime

import pkg_resources

# -- Project information -----------------------------------------------------

project = 'Sophon'
author = 'Stefano Pigozzi'
copyright = f'{datetime.date.today().year}, {author}'
release = pkg_resources.get_distribution("sophon").version

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "sphinx.ext.todo",
    "sphinx.ext.autosectionlabel",
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# Print warnings on the page
keep_warnings = True

# Display more warnings than usual
nitpicky = True

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = 'sphinx_rtd_theme'

html_theme_options = {
    "style_nav_header_background": "#051836"
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# -- Intersphinx options -----------------------------------------------------

intersphinx_mapping = {
    "python": ("https://docs.python.org/3.8", None),
    "django": ("http://docs.djangoproject.com/en/3.2/", "http://docs.djangoproject.com/en/3.2/_objects/"),
    "docker": ("https://docker-py.readthedocs.io/en/stable/", None),
}

# -- Automodule options ------------------------------------------------------

autodoc_default_options = {
    'members': True,
    'member-order': 'bysource',
    'special-members': '__init__',
    'undoc-members': True,
    'show-inheritance': False,
}
