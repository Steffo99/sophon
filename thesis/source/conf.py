# Customized Sphinx configuration
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import datetime

# Project name
project = 'Progettazione e sviluppo di Sophon, applicativo cloud a supporto della ricerca'
# Project author
author = 'Stefano Pigozzi'
# Project copyright
project_copyright = f'{datetime.date.today().year}, {author}'

# Sphinx language
language = "it"
# Sphinx extensions
extensions = [
    "sphinx.ext.intersphinx",
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.todo",
]

# Source files encoding
source_encoding = "UTF-8"
# Source file extensions
source_suffix = {
    ".rst": "restructuredtext",
}
# Source files parsers
source_parsers = {}

# The doc from which to start rendering
root_doc = "index"
# Files to ignore when rendering
exclude_patterns = [
    "build",
    "_build",
    "Thumbs.db",
    ".DS_Store",
]
# Sphinx template files
templates_path = [
    '_templates',
]

# Prologue of all rst files
rst_prolog = ""
# Epilogue of all rst files
rst_epilog = ""

# Default domain
primary_domain = None
# Default role
default_role = "any"

# Print warnings on the page
keep_warnings = False
# Display more warnings than usual
nitpicky = False

# Intersphinx URLs
intersphinx_mapping = {
    "python": ("https://docs.python.org/3.8", None),
    "django": ("http://docs.djangoproject.com/en/3.2/", "http://docs.djangoproject.com/en/3.2/_objects/"),
    "docker": ("https://docker-py.readthedocs.io/en/stable/", None),
    "coloredlogs": ("https://coloredlogs.readthedocs.io/en/latest/", None),
    "gunicorn": ("https://docs.gunicorn.org/en/stable/", None),
    "psycopg2": ("https://www.psycopg.org/docs/", None),
}
# Manpages URL
manpages_url = "https://man.archlinux.org/"

# Autonumber figures
numfig = True
# Autonumeration formatting
numfig_format = {
    "figure": "Figura %s",
    "table": "Tabella %s",
    "code-block": "Listati %s",
    "section": "Sezione %s",
}
# Maximum depth for autonumeration
numfig_secnum_depth = 2

# HTML builder theme
html_theme = 'sphinx_rtd_theme'
# Configuration for the theme
html_theme_options = {
    "style_nav_header_background": "#051836",
}
# Title of the HTML page
html_title = f"{project}"
# Short title of the HTML page
html_short_title = f"{project}"
# Path of the documentation static files
html_static_path = [
    "_static",
]
# Path of extra files to add to the build
html_extra_path = [
    "_extra",
]

# LaTeX rendering engine to use
latex_engine = "lualatex"
# LaTeX top level title type
latex_toplevel_sectioning = "chapter"
# LaTeX URLs rendering
latex_show_urls = "footnote"
# LaTeX theme
latex_theme = "manual"

latex_setup = {
    "TitleColor": "{rgb}{0,0,0.08}",

    "InnerLinkColor": "{rgb}{0.19,0.57,0.82}",
    "OuterLinkColor": "{rgb}{0.19,0.57,0.82}",

    "VerbatimBorderColor": "{rgb}{0.88,0.88,0.88}",
    "VerbatimColor": "{rgb}{0.97,0.97,0.97}",

    "noteBorderColor": "{rgb}{0.42,0.69,0.87}",
    "importantBorderColor": "{rgb}{0.42,0.69,0.87}",

    "hintBorderColor": "{rgb}{0.1,0.74,0.61}",
    "tipBorderColor": "{rgb}{0.1,0.74,0.61}",

    "warningBorderColor": "{rgb}{0.94,0.7,0.49}",
    "warningBgColor": "{rgb}{1,0.93,0.8}",
    "cautionBorderColor": "{rgb}{0.94,0.7,0.49}",
    "cautionBgColor": "{rgb}{1,0.93,0.8}",
    "attentionBorderColor": "{rgb}{0.94,0.7,0.49}",
    "attentionBgColor": "{rgb}{1,0.93,0.8}",

    "dangerBorderColor": "{rgb}{0.95,0.62,0.59}",
    "dangerBgColor": "{rgb}{0.95,0.62,0.59}",
    "errorBorderColor": "{rgb}{0.95,0.62,0.59}",
    "errorBgColor": "{rgb}{0.95,0.62,0.59}",
}
latex_elements = {
    "papersize": "a4paper",
    "pointsize": "12pt",
    "sphinxsetup": ", ".join(f"{key}={value}" for key, value in latex_setup.items()),
    "fontpkg": r"""
        \setmainfont{EB Garamond}
        \setsansfont{EB Garamond}
        \setmonofont{Fira Code}
    """
}

# TODOs
todo_include_todos = True  # TODO: Change to false in the final version
todo_emit_warnings = False
todo_link_only = False

# Rinohtype
rinoh_documents = [
    {
        "doc": "index",
        "target": "manual",
    }
]

# Smartquotes
smartquotes_excludes = {
    "languages": [
        # Smartquotes is completely broken in italian!
        "it",
        # Keep the default, just in case
        "ja",
    ],
    "builders": [
        "man",
        "text",
    ]
}
