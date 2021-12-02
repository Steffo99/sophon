import re

with open("build/latex/progettazioneesviluppodisophonapplicativocloudasupportodellaricerca.tex", "r") as file:
    text = file.read()

text = re.sub(r"\\renewcommand[{]\\indexname[}][{]Indice del modulo Python[}].*?\\end[{]sphinxtheindex[}]", "", text, re.DOTALL)
text = re.sub(r"\\renewcommand[{]\\indexname[}][{]HTTP Routing Table[}].*?\\end[{]sphinxtheindex[}]", "", text, re.DOTALL)

with open("build/latex/progettazioneesviluppodisophonapplicativocloudasupportodellaricerca.tex", "w") as file:
    file.write(text)
