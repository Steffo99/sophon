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
    "sphinxcontrib.httpdomain",
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

# Try making more space
add_module_names = False

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
# Disable additional indexes
html_domain_indices = False

# LaTeX rendering engine to use
latex_engine = "lualatex"
# LaTeX top level title type
latex_toplevel_sectioning = "chapter"
# LaTeX URLs rendering
latex_show_urls = "footnote"
# LaTeX theme
latex_theme = "manual"

latex_setup_rgb = {
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

    "bookmarksdepth": "2",

    "verbatimforcewraps": "true",
}
latex_setup_bw = {
    "TitleColor": "{rgb}{0,0,0}",

    "InnerLinkColor": "{rgb}{0,0,0}",
    "OuterLinkColor": "{rgb}{0,0,0}",

    "VerbatimBorderColor": "{rgb}{0.88,0.88,0.88}",
    "VerbatimColor": "{rgb}{0.97,0.97,0.97}",

    "noteBorderColor": "{rgb}{0.88,0.88,0.88}",
    "importantBorderColor": "{rgb}{0.88,0.88,0.88}",

    "hintBorderColor": "{rgb}{0.88,0.88,0.88}",
    "tipBorderColor": "{rgb}{0.88,0.88,0.88}",

    "warningBorderColor": "{rgb}{0.88,0.88,0.88}",
    "warningBgColor": "{rgb}{0.97,0.97,0.97}",
    "cautionBorderColor": "{rgb}{0.88,0.88,0.88}",
    "cautionBgColor": "{rgb}{0.97,0.97,0.97}",
    "attentionBorderColor": "{rgb}{0.88,0.88,0.88}",
    "attentionBgColor": "{rgb}{0.97,0.97,0.97}",

    "dangerBorderColor": "{rgb}{0.88,0.88,0.88}",
    "dangerBgColor": "{rgb}{0.97,0.97,0.97}",
    "errorBorderColor": "{rgb}{0.88,0.88,0.88}",
    "errorBgColor": "{rgb}{0.97,0.97,0.97}",

    "bookmarksdepth": "2",

    "verbatimforcewraps": "true",
}
latex_setup = latex_setup_bw

latex_elements = {
    "papersize": "a4paper",
    "pointsize": "12pt",
    "sphinxsetup": ", ".join(f"{key}={value}" for key, value in latex_setup.items()),
    "fontpkg": r"""
        \setmainfont{EB Garamond}
        \setsansfont{EB Garamond}
        \setmonofont{Fira Code}
    """,
    "maketitle": r"""
        \begin{titlepage}
        
            \begin{center}
                \mdseries
                \huge UNIVERSITÀ DEGLI STUDI DI MODENA E REGGIO EMILIA
                \vskip-.1in
                \rule{\textwidth}{1pt}
                \vskip.1in
                \LARGE Dipartimento di Scienze Fisiche, Informatiche e Matematiche
                \vskip.2in
            
                \LARGE Corso di Laurea in Informatica
                \vskip.5in
                \LARGE Tesi di Laurea
                \vskip.5in
                \emph{\Huge Progettazione e sviluppo di Sophon, applicativo cloud a supporto della ricerca}
            \end{center}
            \vskip1.7in
            
            \begin{minipage}{.40\textwidth}
              \begin{flushleft}
                \mdseries\large Relatore: 
                \vskip0.1in
                \large Prof.ssa\\ Claudia Canali 
              \end{flushleft}
            \end{minipage}
            \hskip.3\textwidth
            \begin{minipage}{.25\textwidth}
              \begin{flushleft}
                \mdseries\large Candidato: 
                \vskip0.1in
                \large Matr. 128570\\Stefano Pigozzi
              \end{flushleft}
            \end{minipage}
            
            \vskip0.5in
            
            \centering
            \mdseries
            \rule{\textwidth}{1pt}
            \LARGE Anno Accademico 2020-2021
            
        \end{titlepage}
        
        \newpage 

        \ % The empty page
        
        \newpage
    """,
}

# TODOs
todo_include_todos = False
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
